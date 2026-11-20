import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:13',
  releaseNotes: {
    en_US: `Requires StartOS 0.4.2 or later. Every install of this version runs the same verified build of Holesail 2.4.1.`,
    es_ES: `Requiere StartOS 0.4.2 o posterior. Todas las instalaciones de esta versión ejecutan la misma compilación verificada de Holesail 2.4.1.`,
    de_DE: `Erfordert StartOS 0.4.2 oder neuer. Jede Installation dieser Version führt denselben verifizierten Build von Holesail 2.4.1 aus.`,
    pl_PL: `Wymaga StartOS 0.4.2 lub nowszego. Każda instalacja tej wersji uruchamia tę samą zweryfikowaną kompilację Holesail 2.4.1.`,
    fr_FR: `Nécessite StartOS 0.4.2 ou ultérieur. Chaque installation de cette version exécute la même version vérifiée de Holesail 2.4.1.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
