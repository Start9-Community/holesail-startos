import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:14',
  releaseNotes: {
    en_US:
      'Connection strings stay out of the service logs. **View Connections** shows them.\n\nPublic tunnels now accept connections from a standard Holesail client. After updating, copy the connection string of each Public tunnel from **View Connections** again and give it to every client of that tunnel.',
    es_ES:
      'Las cadenas de conexión quedan fuera de los registros del servicio. **Ver conexiones** las muestra.\n\nLos túneles públicos ahora aceptan conexiones de un cliente Holesail estándar. Después de actualizar, vuelva a copiar la cadena de conexión de cada túnel público desde **Ver conexiones** y entréguela a todos los clientes de ese túnel.',
    de_DE:
      'Verbindungszeichenfolgen erscheinen nicht in den Dienstprotokollen. **Verbindungen anzeigen** zeigt sie an.\n\nÖffentliche Tunnel nehmen jetzt Verbindungen von einem Standard-Holesail-Client an. Kopieren Sie nach dem Update die Verbindungszeichenfolge jedes öffentlichen Tunnels erneut aus **Verbindungen anzeigen** und geben Sie sie an jeden Client dieses Tunnels weiter.',
    pl_PL:
      'Ciągi połączeń nie trafiają do logów usługi. **Wyświetl połączenia** je wyświetla.\n\nTunele publiczne przyjmują teraz połączenia ze standardowego klienta Holesail. Po aktualizacji ponownie skopiuj ciąg połączenia każdego tunelu publicznego z **Wyświetl połączenia** i przekaż go każdemu klientowi tego tunelu.',
    fr_FR:
      'Les chaînes de connexion restent hors des journaux du service. **Voir les connexions** les affiche.\n\nLes tunnels publics acceptent désormais les connexions d’un client Holesail standard. Après la mise à jour, copiez à nouveau la chaîne de connexion de chaque tunnel public depuis **Voir les connexions** et transmettez-la à chaque client de ce tunnel.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
