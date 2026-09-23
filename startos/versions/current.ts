import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:11',
  releaseNotes: {
    en_US: `The instructions now cover choosing where a Holesail client listens, and which address to sign in to the StartOS UI from.`,
    es_ES: `Las instrucciones ahora explican cómo elegir dónde escucha un cliente de Holesail y desde qué dirección iniciar sesión en la interfaz de StartOS.`,
    de_DE: `Die Anleitung erklärt jetzt, wie du festlegst, wo ein Holesail-Client lauscht, und unter welcher Adresse du dich an der StartOS-Oberfläche anmeldest.`,
    pl_PL: `Instrukcja wyjaśnia teraz, jak wybrać, na jakim adresie nasłuchuje klient Holesail, i pod jakim adresem logować się do interfejsu StartOS.`,
    fr_FR: `Les instructions expliquent désormais comment choisir l'adresse d'écoute d'un client Holesail et depuis quelle adresse se connecter à l'interface de StartOS.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
