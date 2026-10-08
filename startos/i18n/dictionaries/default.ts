export const DEFAULT_LANG = 'en_US'

const dict = {
  'Tunnel is working': 2,
  Tunnels: 3,
  Service: 4,
  'Service Interface': 5,
  Public: 6,
  'Manage Tunnels': 7,
  'Add and remove Holesail tunnels': 8,
  'View Connections': 9,
  'View the connection URLs for your tunnels': 10,
  'You have no tunnels': 11,
  Connections: 12,
  'Create your first tunnel': 13,
  'Changing this on an existing tunnel replaces its connection string. Every client of that tunnel then needs the new one from View Connections.': 14,
} as const

export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
