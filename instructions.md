# Holesail

## Documentation

- [Holesail upstream docs](https://docs.holesail.io/) — the official Holesail documentation, covering client setup, connection strings, and protocol details.

## What you get on StartOS

Holesail on StartOS runs in **server mode** only. It creates peer-to-peer tunnels over Hyperswarm DHT that expose any interface of any installed StartOS service — or the StartOS UI itself — to a remote Holesail client, without port forwarding, a static IP, or firewall configuration. Connection strings are generated and stored for you; the package exposes no inbound network ports of its own.

## Getting set up

1. Open Holesail's **Actions** tab and run **Manage Tunnels**.
2. Click **Add** to create a tunnel. Pick a **Service** (any installed service, or **StartOS** for the StartOS UI), pick a **Service Interface**, and toggle **Public** on or off — public tunnels are discoverable on the DHT, private tunnels require the exact connection string.
3. Save. A connection string is generated and a tunnel daemon starts.
4. Run **View Connections** to retrieve a connection string. Each entry is masked, copyable, and offers a QR code. Share it with the client device that needs to reach the service.
5. On the client, install a Holesail client (see the upstream docs) and connect using the string.

To remove a tunnel, run **Manage Tunnels** again and delete its row.

## Using Holesail

### Actions

- **Manage Tunnels** — add and remove tunnels. Each tunnel binds one interface of one service to a Holesail connection string.
- **View Connections** — list every active tunnel with its connection string and QR code. Available once you have at least one tunnel configured.
