import { utils } from '@start9labs/start-sdk'

/**
 * The IPv4 LXC-bridge `{ hostname, port }` for the interface on a binding of an
 * already-resolved host. `<pkg>.startos` DNS and container IPs are deprecated;
 * containers — and the OS admin UI (`start-os`/`admin`) — are reached over this
 * bridge. `ssl` picks the https vs http variant. Returns `undefined` when the
 * binding exports no bridge-reachable interface.
 */
export const bridgeHost = (
  host: utils.FilledHost | null,
  internalPort: number,
  ssl: boolean,
) => {
  const binding = host?.bindings[internalPort]
  const iface = binding && Object.values(binding.interfaces)[0]
  return iface
    ? iface.addressInfo.filter({
        kind: 'bridge',
        predicate: (h) => h.metadata.kind === 'ipv4' && h.ssl === ssl,
      }).hostnames[0]
    : undefined
}

export function getRandomConnectionString(isPublic: boolean) {
  const key = utils.getDefaultString({
    charset: 'a-z,A-Z,0-9',
    len: 42,
  })

  return `hs://${isPublic ? '0' : 's'}000${key}`
}

export const isPublic = (connectionString: string) =>
  connectionString.charAt(5) === '0'

// Holesail's CLI and its INFO log both print the tunnel's credential, so the daemon drives the library.
export const serverScript = `const Holesail = require('/usr/src/app/src/index.js')
const { HOST, PORT, KEY } = process.env
new Holesail({ server: true, host: HOST, port: Number(PORT), key: KEY, secure: true })
  .ready()
  .then(() => console.log(\`Holesail is forwarding to \${HOST}:\${PORT}\`))`
