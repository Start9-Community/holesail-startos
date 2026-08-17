# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Keep the per-tunnel state in `exec.env`.** The reconciler hashes it, so editing one tunnel's connection string or target restarts just that daemon.
- **Subcontainers must stay lazy handles, one per tunnel, each on its own volume subpath.** Dynamic reconcile needs lazy handles so unchanged daemons never re-materialize, and separate subpaths are what stop independent tunnels contending for the same files mid-reconcile.
- **`effects.getServiceInterface` here is a deliberate exception to host-first addressing.** Holesail can tunnel any installed package's interface, known only by id, and no effect enumerates a package's hosts — so the interface is read directly to obtain the host id, and everything after that is ordinary bridge addressing.
- **Connection strings must stay stable across restarts.** They are the credential a remote client holds; regenerating one silently breaks every client using it.
