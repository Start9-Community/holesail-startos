import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:12',
  releaseNotes: {
    en_US: `- Turning Public on or off for an existing tunnel in Manage Tunnels takes effect: it replaces that tunnel's connection string, and the toggle warns before it changes.`,
    es_ES: `- Activar o desactivar Público en un túnel existente desde Administrar túneles surte efecto: reemplaza la cadena de conexión de ese túnel, y el interruptor avisa antes de cambiar.`,
    de_DE: `- Das Ein- oder Ausschalten von Öffentlich für einen bestehenden Tunnel unter Tunnel verwalten wirkt: Es ersetzt die Verbindungszeichenfolge dieses Tunnels, und der Schalter warnt vor der Änderung.`,
    pl_PL: `- Włączenie lub wyłączenie opcji Publiczny dla istniejącego tunelu w Zarządzaj tunelami działa: zastępuje ciąg połączenia tego tunelu, a przełącznik ostrzega przed zmianą.`,
    fr_FR: `- Activer ou désactiver Public sur un tunnel existant dans Gérer les tunnels prend effet : cela remplace la chaîne de connexion de ce tunnel, et l'interrupteur avertit avant le changement.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
