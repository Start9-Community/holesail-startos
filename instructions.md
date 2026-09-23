# Holesail

## Documentation

- [Holesail upstream docs](https://docs.holesail.io/) — the official Holesail documentation, covering client setup, connection strings, and protocol details.

## What you get on StartOS

Holesail on StartOS runs in **server mode** only. It creates peer-to-peer tunnels over Hyperswarm DHT that expose any interface of any installed StartOS service — or the StartOS UI itself — to a remote Holesail client, without port forwarding, a static IP, or firewall configuration. Connection strings are generated and stored for you; the package exposes no inbound network ports of its own.

## Notes

- **Adding, removing, or editing one tunnel does not restart the others** — only the changed tunnel reconciles, and each tunnel keeps its runtime data in its own area. Connection strings are stable across restarts.
- **Sign in to the StartOS UI at `localhost` or `127.0.0.1`** on the device running the client. StartOS rejects a sign-in from any other address, such as that device's LAN IP, with "invalid request signature".

## Getting set up

1. Open Holesail's **Actions** tab and run **Manage Tunnels**.
2. Click **Add** to create a tunnel. Pick a **Service** (any installed service, or **StartOS** for the StartOS UI), pick a **Service Interface**, and toggle **Public** on or off — public tunnels are discoverable on the DHT, private tunnels require the exact connection string.
3. Save. A connection string is generated and a tunnel daemon starts.
4. Run **View Connections** to retrieve a connection string. Each entry is masked, copyable, and offers a QR code. Share it with the client device that needs to reach the service.
5. On the client device, install a Holesail client (see the upstream docs) and connect using the string. With the `holesail` command-line client, choose where it listens:

   ```
   holesail <connection string> --host 127.0.0.1 --port 8989
   ```

   Without `--host` and `--port` it exits with `EADDRNOTAVAIL`.

6. Open the address the client prints, such as `http://127.0.0.1:8989`, in a browser on the same device.

To remove a tunnel, run **Manage Tunnels** again and delete its row.

## Using Holesail

### Actions

- **Manage Tunnels** — add and remove tunnels. Each tunnel binds one interface of one service to a Holesail connection string.
- **View Connections** — list every active tunnel with its connection string and QR code. Available once you have at least one tunnel configured.
