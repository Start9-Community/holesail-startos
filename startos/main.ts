import { Daemons } from '@start9labs/start-sdk'
import { storeJson } from './fileModels/store.json'
import { manifest } from './manifest'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { bridgeHost } from './utils'

// Reactive daemon set: one Holesail server daemon per stored tunnel, built with
// `Daemons.dynamic` so adding, removing, or editing a single tunnel reconciles
// only that daemon — every other tunnel keeps running. (A plain `setupMain`
// that reads `store.read().const()` in its body restarts the WHOLE service on
// any store change, dropping every tunnel.) The store `.const` is therefore
// read INSIDE this builder, whose `constRetry` drives a reconcile rather than a
// full `main` re-run.
export const main = sdk.Daemons.dynamic(async ({ effects }) => {
  const store = (await storeJson.read().const(effects)) ?? {}

  let daemons: Daemons<typeof manifest, string> = sdk.Daemons.of(effects)

  await Promise.all(
    Object.entries(store).map(async ([packageId, ifaces]) => {
      // start-os (the OS admin UI) isn't a real installed package, so its
      // manifest/title won't resolve — label it directly.
      const packageTitle =
        packageId === 'start-os'
          ? 'StartOS'
          : ((await sdk
              .getServiceManifest(effects, packageId, (m) => m?.title)
              .once()) ?? packageId)

      await Promise.all(
        Object.entries(ifaces).map(async ([interfaceId, connectionString]) => {
          const id = `${packageId}-${interfaceId}`

          // Holesail can tunnel ANY installed package's interface, so it must
          // resolve an interface it knows only by id. There is no host-based way
          // to do that (no "list a package's hosts" effect exists), so this raw
          // interface read is the one deliberate exception to the otherwise
          // host-based addressing. Once we have the host id we dial the target
          // over the LXC bridge like everything else.
          const iface = await effects.getServiceInterface({
            packageId,
            serviceInterfaceId: interfaceId,
          })
          if (!iface?.addressInfo) return null

          const { hostId, internalPort } = iface.addressInfo
          const host = await sdk.host.get(effects, { hostId, packageId }).once()
          const addr = bridgeHost(host, internalPort, false)
          if (!addr) return null

          daemons = daemons.addDaemon(id as never, {
            // One lazy subcontainer per tunnel (dynamic reconcile requires lazy
            // handles so unchanged daemons never re-materialize), each mounting
            // its OWN per-tunnel subpath of the data volume — independent
            // tunnels then never contend for the same files across a reconcile.
            subcontainer: sdk.SubContainer.of(
              effects,
              { imageId: 'holesail' },
              sdk.Mounts.of().mountVolume({
                volumeId: 'holesail',
                subpath: id,
                mountpoint: '/usr/src/app/data',
                readonly: false,
              }),
              `holesail-${id}`,
            ),
            exec: {
              command: sdk.useEntrypoint(),
              // connectionString/HOST/PORT ride in exec.env (hashed by the
              // reconciler), so editing one tunnel restarts only its daemon.
              env: {
                MODE: 'server',
                PORT: String(addr.port),
                HOST: addr.hostname,
                KEY: connectionString,
                LOG: 'true',
                NODE_ENV: 'production',
              },
            },
            ready: {
              display: `${packageTitle} - ${iface.name}`,
              fn: () => ({
                result: 'success',
                message: i18n('Tunnel is working'),
              }),
            },
            requires: [],
          })
        }),
      )
    }),
  )

  return daemons
})
