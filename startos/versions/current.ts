import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:8',
  releaseNotes: {
    en_US: `Updated to the StartOS 2.0 SDK (requires StartOS 0.4.0-beta.10). Tunnels now reach their target service over the internal LXC bridge instead of deprecated container hostnames, and the StartOS admin UI is addressed as a regular service. Adding or removing a tunnel no longer restarts the others. If you had a tunnel to the StartOS UI, re-add it from Manage Tunnels.`,
    es_ES: `Actualizado al SDK 2.0 de StartOS (requiere StartOS 0.4.0-beta.10). Los túneles ahora alcanzan su servicio de destino a través del puente LXC interno en lugar de nombres de host de contenedor obsoletos, y la interfaz de administración de StartOS se direcciona como un servicio normal. Añadir o quitar un túnel ya no reinicia los demás. Si tenías un túnel a la interfaz de StartOS, vuelve a añadirlo desde Gestionar túneles.`,
    de_DE: `Auf das StartOS-2.0-SDK aktualisiert (erfordert StartOS 0.4.0-beta.10). Tunnel erreichen ihren Zieldienst jetzt über die interne LXC-Bridge statt über veraltete Container-Hostnamen, und die StartOS-Verwaltungsoberfläche wird als regulärer Dienst adressiert. Das Hinzufügen oder Entfernen eines Tunnels startet die anderen nicht mehr neu. Falls du einen Tunnel zur StartOS-Oberfläche hattest, füge ihn über „Tunnel verwalten" erneut hinzu.`,
    pl_PL: `Zaktualizowano do SDK StartOS 2.0 (wymaga StartOS 0.4.0-beta.10). Tunele docierają teraz do docelowej usługi przez wewnętrzny mostek LXC zamiast przestarzałych nazw hostów kontenerów, a interfejs administracyjny StartOS jest adresowany jak zwykła usługa. Dodanie lub usunięcie tunelu nie restartuje już pozostałych. Jeśli miałeś tunel do interfejsu StartOS, dodaj go ponownie w sekcji Zarządzaj tunelami.`,
    fr_FR: `Mise à jour vers le SDK StartOS 2.0 (nécessite StartOS 0.4.0-beta.10). Les tunnels atteignent désormais leur service cible via le pont LXC interne au lieu de noms d'hôtes de conteneurs obsolètes, et l'interface d'administration de StartOS est adressée comme un service ordinaire. Ajouter ou supprimer un tunnel ne redémarre plus les autres. Si vous aviez un tunnel vers l'interface de StartOS, rajoutez-le depuis Gérer les tunnels.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
