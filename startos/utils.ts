import { utils } from '@start9labs/start-sdk'
import { createHash, createPrivateKey, createPublicKey } from 'node:crypto'

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

const z32Alphabet = 'ybndrfg8ejkmcpqxot1uwisza345h769'

const z32 = (bytes: Buffer) => {
  let out = ''
  let bits = 0
  let value = 0
  for (const byte of bytes) {
    value = ((value << 8) | byte) & 0xfff
    bits += 8
    while (bits >= 5) {
      bits -= 5
      out += z32Alphabet[(value >>> bits) & 31]
    }
  }
  return bits ? out + z32Alphabet[(value << (5 - bits)) & 31] : out
}

// A Public tunnel's clients dial the server's ed25519 public key, which Holesail seeds from sha256 of the stored key.
export const clientConnectionString = (stored: string) => {
  if (!isPublic(stored)) return stored
  const seed = createHash('sha256').update(stored.slice(9)).digest()
  const publicKey = createPublicKey(
    createPrivateKey({
      key: Buffer.concat([
        Buffer.from('302e020100300506032b657004220420', 'hex'),
        seed,
      ]),
      format: 'der',
      type: 'pkcs8',
    }),
  ).export({ format: 'der', type: 'spki' })
  return `hs://0000${z32(publicKey.subarray(-32))}`
}

// Holesail's CLI and its INFO log both print the tunnel's credential, so the daemon drives the library.
export const serverScript = `const Holesail = require('/usr/src/app/src/index.js')
const { HOST, PORT, KEY } = process.env
new Holesail({ server: true, host: HOST, port: Number(PORT), key: KEY, secure: KEY.charAt(5) === 's' })
  .ready()
  .then(() => console.log(\`Holesail is forwarding to \${HOST}:\${PORT}\`))`
