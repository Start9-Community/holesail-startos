<p align="center">
  <img src="icon.png" alt="Holesail Logo" width="21%">
</p>

# Holesail on StartOS

> Everything not listed in this document should behave the same as upstream
> Holesail. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

[Holesail](https://github.com/holesail/holesail-docker/) makes a peer-to-peer tunnel over a DHT, so a remote client can reach a service without port forwarding, a static IP, or a firewall change. This package runs it in **server mode only**, and can tunnel any interface of any installed service — or the StartOS admin interface itself.

- **Upstream repo:** <https://github.com/holesail/holesail-docker/>
- **Wrapper repo:** <https://github.com/Start9-Community/holesail-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One upstream image, consumed unmodified — but the daemon set is not fixed.

| Property      | Value                                      |
| ------------- | ------------------------------------------ |
| Image         | `holesail/holesail`                        |
| Architectures | x86_64, aarch64                            |
| Entrypoint    | The image's own, via `sdk.useEntrypoint()` |

| Subcontainer                     | Purpose                   |
| -------------------------------- | ------------------------- |
| `holesail-<package>-<interface>` | One per configured tunnel |

**There is one daemon and one subcontainer per tunnel, built dynamically from the stored list.** A fresh install with no tunnels runs nothing at all; adding three tunnels runs three daemons. The subcontainer names are derived from the target, so an agent cannot know them in advance — read the configured tunnels to find them.

**Adding, removing, or editing one tunnel touches only that tunnel.** The daemon set is reconciled rather than rebuilt, so the others keep running throughout — which matters, because tearing them all down would drop every remote connection to reconfigure one.

## Volume and Data Layout

Two volumes.

| Volume     | Mount Point         | Purpose                                  |
| ---------- | ------------------- | ---------------------------------------- |
| `holesail` | `/usr/src/app/data` | Runtime data, **one subpath per tunnel** |
| `startos`  | not mounted         | The tunnel list                          |

**Each tunnel mounts its own subpath**, not the volume root. That is what keeps independent tunnels from contending for the same files when one of them reconciles.

The tunnel list is kept on a separate volume the containers cannot see, since it is the package's record rather than the application's state.

## File Models

One model, and its shape is unusual: it has no fixed fields at all.

| File         | Format | Modelled                | Written by                |
| ------------ | ------ | ----------------------- | ------------------------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | The Manage Tunnels action |

It is a **nested map**, keyed by package id and then by interface id, whose values are connection strings. Every tunnel is one entry, and the daemon set is generated from it directly — the store _is_ the configuration.

**The connection string is the credential.** It is generated when a tunnel is created and encodes whether the tunnel is public or private; anyone holding it can reach the tunnelled interface from anywhere. It is stable across restarts, so it does not need re-sharing.

Nothing else is modelled — the application has no configuration of its own here beyond the environment each daemon is given.

## Dependencies

None declared, and that is deliberate rather than incidental: Holesail can tunnel **any** installed service, so no fixed set could be declared. What it tunnels is chosen at run time, and a target that is uninstalled simply stops resolving.

## Network Access and Interfaces

**None.** `setInterfaces` returns an empty array — the package binds no port and publishes no address.

That is the point of it. Reachability comes from the peer-to-peer network rather than from an address on this box, which is why it needs no port forwarding and exposes no new inbound surface locally.

**Tunnel targets are reached over the internal bridge**, the same as any other service-to-service call. The package resolves the chosen interface by id, finds its host, and dials the bridge address.

That resolution is the one place this package does something unusual: because it can tunnel an interface it knows only by id — with no way to enumerate a package's hosts — it reads the interface directly rather than going host-first. Once it has the host, the addressing is ordinary.

**The StartOS admin interface is tunnellable too**, and is special-cased because it is not an installed package.

## Installation and First-Run Flow

Install raises a critical task to create the first tunnel. Until then there is nothing to run: **the daemon set is empty, so the service has nothing to start.**

The task is **reactive** — keyed on the tunnel list being empty, not on install — so removing every tunnel brings it back rather than leaving a service that runs nothing with no prompt.

Creating a tunnel generates its connection string; the remote end needs a Holesail client and that string, and nothing else.

## Actions

Two actions.

### Manage Tunnels

Creates, edits, and removes tunnels. This is the whole of configuration.

- **What it changes:** the tunnel list, and through it the daemon set.
- **Cost:** only the changed tunnel reconciles. Others keep running, and their connections survive.
- **Repeat safety:** idempotent.
- **Each tunnel picks a service and one of its interfaces**, and is marked public or private — a distinction carried inside the generated connection string.
- **A new connection string is generated per tunnel**, and is what a remote client needs.

### View Connections

Shows the connection strings for the configured tunnels.

- **Hidden until at least one tunnel exists** — there is nothing to show before that.
- **What it changes:** nothing. It is a read.
- **Repeat safety:** read-only, and the strings are stable, so re-running returns the same values.
- **These are credentials.** Anyone holding one can reach the tunnelled interface.

## Tasks

One, and it is reactive.

| Task           | Severity   | Raised when               | Cleared when        |
| -------------- | ---------- | ------------------------- | ------------------- |
| Manage Tunnels | `critical` | No tunnels are configured | A tunnel is created |

`critical` blocks the service from starting and suspends the ordinary controls — which is honest here, since a Holesail with no tunnels has nothing to do.

## Health Checks

One check per tunnel, named for what it tunnels.

| Check                   | Displayed as              | Method                                |
| ----------------------- | ------------------------- | ------------------------------------- |
| `<package>-<interface>` | "<Service> - <Interface>" | Reports success while the daemon runs |

**The check does not probe the tunnel**, and that is worth knowing: it reports success whenever its daemon is up. So a green check means Holesail is running for that tunnel, not that a remote client can currently connect — the peer-to-peer path, the target service, and the client are all outside what it observes.

There is no aggregate check. A service with no tunnels shows none at all.

## Backups and Restore

Both volumes are copied wholesale — `sdk.Backups.ofVolumes('holesail', 'startos')`.

**The backup contains every connection string**, which are the credentials for reaching the tunnelled services. Treat it accordingly.

A restored instance comes back with the same tunnels and the same connection strings, so **remote clients keep working without being re-paired** — which is the main reason the strings are stable rather than regenerated.

Tunnels whose target service is not present on the restored server simply fail to resolve and run nothing, rather than blocking the rest.

## Limitations and Differences

1. **Server mode only.** This package does not run a Holesail client.
2. **No local interface at all.** Everything is reached over the peer-to-peer network.
3. **Connection strings are credentials**, are stable, and are in the backup.
4. **The health check does not test connectivity**, only that the daemon is running.
5. **A tunnel's target is resolved by interface id**, so removing or renaming an interface on the target service silently stops that tunnel from resolving.
6. **The subcontainer names are derived from the tunnel**, so they vary per install.
7. **The service runs nothing until a tunnel is configured**, and its task returns if you remove them all.

---

## Quick Reference for AI Consumers

```yaml
package_id: holesail
image: holesail/holesail
architectures:
  - x86_64
  - aarch64
subcontainers: # one per tunnel, named holesail-<packageId>-<interfaceId>
  - holesail-<packageId>-<interfaceId>
volumes:
  holesail: /usr/src/app/data # one subpath per tunnel
  startos: not mounted # holds store.json
file_models:
  - store.json # nested map: packageId -> interfaceId -> connection string
startos_managed_env_vars: # per tunnel daemon
  - MODE
  - PORT
  - HOST
  - KEY
  - LOG
  - NODE_ENV
dependencies: [] # can tunnel any installed service; none can be declared
interfaces: {} # none; reachability is peer-to-peer
actions:
  - manage-tunnels
  - view-connections # hidden until a tunnel exists
tasks:
  - { action: manage-tunnels, severity: critical } # reactive on an empty tunnel list
health_checks: # one per tunnel; reports the daemon, not connectivity
  - <packageId>-<interfaceId>
```
