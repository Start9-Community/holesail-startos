import { z } from '@start9labs/start-sdk'
import { shape, storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { getRandomConnectionString, isPublic } from '../utils'

const { InputSpec, Value, List, Variants } = sdk

export const inputSpec = InputSpec.of({
  tunnels: Value.list(
    List.obj(
      { name: i18n('Tunnels') },
      {
        displayAs: '{{service.selection}} {{service.value.iface}}',
        uniqueBy: { all: ['service.selection', 'service.value.iface'] },
        spec: InputSpec.of({
          service: Value.dynamicUnion(async ({ effects }) => {
            const packages = await sdk.getInstalledPackages(effects)
            const store = (await storeJson.read().once()) || {}

            const entries = (
              await Promise.all(
                packages.map(async (packageId) => {
                  const title =
                    (await sdk
                      .getServiceManifest(effects, packageId, (m) => m?.title)
                      .const()) ?? packageId

                  const iFaces = Object.values(
                    await effects.listServiceInterfaces({ packageId }),
                  ).map((i) => [i.id, i.name] as [string, string])

                  if (!iFaces.length) return null

                  return getSpec(packageId, title, iFaces, !!store[packageId])
                }),
              )
            ).filter((e): e is NonNullable<typeof e> => e !== null)

            return {
              name: i18n('Service'),
              default: null,
              disabled: false,
              variants: Variants.of(
                Object.fromEntries(
                  [
                    getSpec(
                      'start-os',
                      'StartOS',
                      [['admin-ui', 'Admin UI']],
                      !!store['start-os'],
                    ),
                  ].concat(entries),
                ),
              ),
            }
          }),
        }),
      },
    ),
  ),
})

export const manageTunnels = sdk.Action.withInput(
  // id
  'manage-tunnels',

  // metadata
  async ({ effects }) => ({
    name: i18n('Manage Tunnels'),
    description: i18n('Add and remove Holesail tunnels'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // input spec
  inputSpec,

  // optionally pre-fill form
  async ({ effects }) => {
    const store = (await storeJson.read().once()) || {}

    return {
      tunnels: Object.entries(store).flatMap(([packageId, ifaces]) =>
        Object.entries(ifaces).map(([interfaceId, connectionString]) => ({
          service: {
            selection: packageId,
            value: {
              iface: interfaceId,
              isPublic: isPublic(connectionString),
            },
          },
        })),
      ),
    }
  },

  // execution function
  async ({ effects, input }) => {
    const store = (await storeJson.read().once()) || {}

    const toSave: z.infer<typeof shape> = {}

    input.tunnels.forEach((tunnel) => {
      const { selection, value } = tunnel.service as {
        selection: string
        value: {
          iface: string
          isPublic: boolean
        }
      }

      const existing = store[selection]?.[value.iface]
      const iface: z.infer<typeof shape>[''] = {
        [value.iface]:
          existing && isPublic(existing) === value.isPublic
            ? existing
            : getRandomConnectionString(value.isPublic),
      }

      if (!toSave[selection]) {
        toSave[selection] = iface
      } else {
        toSave[selection] = {
          ...toSave[selection],
          ...iface,
        }
      }
    })

    await storeJson.write(effects, toSave)
  },
)

function getSpec(
  packageId: string,
  packageTitle: string,
  iFaces: string[][],
  hasTunnel: boolean,
) {
  return [
    packageId,
    {
      name: packageTitle,
      spec: InputSpec.of({
        iface: Value.select({
          name: i18n('Service Interface'),
          default: null,
          values: Object.fromEntries(iFaces),
        }),
        isPublic: Value.toggle({
          name: i18n('Public'),
          warning: hasTunnel
            ? i18n(
                'Changing this on an existing tunnel replaces its connection string. Every client of that tunnel then needs the new one from View Connections.',
              )
            : null,
          default: false,
        }),
      }),
    },
  ] as const
}
