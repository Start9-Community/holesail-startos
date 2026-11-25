import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:14',
  releaseNotes: {
    en_US:
      'Connection strings stay out of the service logs. **View Connections** shows them.',
    es_ES:
      'Las cadenas de conexión quedan fuera de los registros del servicio. **Ver conexiones** las muestra.',
    de_DE:
      'Verbindungszeichenfolgen erscheinen nicht in den Dienstprotokollen. **Verbindungen anzeigen** zeigt sie an.',
    pl_PL:
      'Ciągi połączeń nie trafiają do logów usługi. **Wyświetl połączenia** je wyświetla.',
    fr_FR:
      'Les chaînes de connexion restent hors des journaux du service. **Voir les connexions** les affiche.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
