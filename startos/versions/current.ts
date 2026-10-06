import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:12',
  releaseNotes: {
    en_US: `The instructions now cover choosing where a Holesail client listens, and which address to sign in to the StartOS UI from.

- Turning Public on or off for an existing tunnel in Manage Tunnels takes effect: it replaces that tunnel's connection string, and the toggle warns before it changes.`,
    es_ES: `Las instrucciones ahora explican cómo elegir dónde escucha un cliente de Holesail y desde qué dirección iniciar sesión en la interfaz de StartOS.

- Activar o desactivar Público en un túnel existente desde Administrar túneles surte efecto: reemplaza la cadena de conexión de ese túnel, y el interruptor avisa antes de cambiar.`,
    de_DE: `Die Anleitung erklärt jetzt, wie du festlegst, wo ein Holesail-Client lauscht, und unter welcher Adresse du dich an der StartOS-Oberfläche anmeldest.

- Das Ein- oder Ausschalten von Öffentlich für einen bestehenden Tunnel unter Tunnel verwalten wirkt: Es ersetzt die Verbindungszeichenfolge dieses Tunnels, und der Schalter warnt vor der Änderung.`,
    pl_PL: `Instrukcja wyjaśnia teraz, jak wybrać, na jakim adresie nasłuchuje klient Holesail, i pod jakim adresem logować się do interfejsu StartOS.

- Włączenie lub wyłączenie opcji Publiczny dla istniejącego tunelu w Zarządzaj tunelami działa: zastępuje ciąg połączenia tego tunelu, a przełącznik ostrzega przed zmianą.`,
    fr_FR: `Les instructions expliquent désormais comment choisir l'adresse d'écoute d'un client Holesail et depuis quelle adresse se connecter à l'interface de StartOS.

- Activer ou désactiver Public sur un tunnel existant dans Gérer les tunnels prend effet : cela remplace la chaîne de connexion de ce tunnel, et l'interrupteur avertit avant le changement.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
