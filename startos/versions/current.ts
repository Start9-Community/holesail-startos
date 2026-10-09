import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:12',
  releaseNotes: {
    en_US: `- Turning Public on or off for an existing tunnel in Manage Tunnels takes effect: it replaces that tunnel's connection string, and the toggle warns before it changes.
- Holesail keeps running, and Manage Tunnels and View Connections keep working, after a tunneled service is uninstalled.`,
    es_ES: `- Activar o desactivar Público en un túnel existente desde Administrar túneles surte efecto: reemplaza la cadena de conexión de ese túnel, y el interruptor avisa antes de cambiar.
- Holesail sigue funcionando, y Administrar túneles y Ver conexiones siguen funcionando, después de desinstalar un servicio tunelizado.`,
    de_DE: `- Das Ein- oder Ausschalten von Öffentlich für einen bestehenden Tunnel unter Tunnel verwalten wirkt: Es ersetzt die Verbindungszeichenfolge dieses Tunnels, und der Schalter warnt vor der Änderung.
- Holesail läuft weiter, und Tunnel verwalten und Verbindungen anzeigen funktionieren weiter, nachdem ein getunnelter Dienst deinstalliert wurde.`,
    pl_PL: `- Włączenie lub wyłączenie opcji Publiczny dla istniejącego tunelu w Zarządzaj tunelami działa: zastępuje ciąg połączenia tego tunelu, a przełącznik ostrzega przed zmianą.
- Holesail działa dalej, a Zarządzaj tunelami i Wyświetl połączenia nadal działają po odinstalowaniu tunelowanej usługi.`,
    fr_FR: `- Activer ou désactiver Public sur un tunnel existant dans Gérer les tunnels prend effet : cela remplace la chaîne de connexion de ce tunnel, et l'interrupteur avertit avant le changement.
- Holesail continue de fonctionner, et Gérer les tunnels et Afficher les connexions aussi, après la désinstallation d'un service tunnelisé.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
