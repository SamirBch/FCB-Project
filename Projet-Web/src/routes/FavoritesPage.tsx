import { createResource, Show, For } from "solid-js";
import { getFavorites } from "~/lib/favorites"; // Fonction pour récupérer les favoris côté serveur
import { getUser } from "~/lib/Login"; // Fonction pour récupérer l'utilisateur connecté

export default function FavoritesPage() {
  // Fonction pour récupérer les favoris
  const fetchFavorites = async () => {
    const user = await getUser(); // Assurez-vous que l'utilisateur est authentifié
    if (!user) throw new Error("Non authentifié");
    return await getFavorites(user.id); // Récupérer les favoris de l'utilisateur
  };

  // Utilisation de createResource pour gérer les favoris
  const [favorites] = createResource(fetchFavorites);

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-4">Mes Favoris</h1>

      {/* Chargement */}
      <Show when={favorites.loading}>
        <p>Chargement...</p>
      </Show>

      {/* Erreur */}
      <Show when={favorites.error}>
        <p class="text-red-500">Erreur : {favorites.error.message}</p>
      </Show>

      {/* Aucun favori */}
      <Show when={!favorites.loading && !favorites.error && favorites()?.length === 0}>
        <p class="text-gray-500">Vous n'avez pas encore ajouté de vidéos à vos favoris.</p>
      </Show>

      {/* Liste des favoris */}
      <Show when={!favorites.loading && !favorites.error && (favorites() ?? []).length > 0}>
        <ul>
          <For each={favorites()}>
            {(fav) => (
              <li class="border p-4 mb-4">
                <h2 class="font-bold">{fav.video.title}</h2>
                <video controls class="w-full rounded-lg shadow-lg">
                  <source src={fav.video.url} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
                <div class="mt-4 text-gray-900 space-y-2">
                  <p>⚽ <b>Buteur :</b> {fav.video.scorer}</p>
                  <p>🆚 <b>Adversaire :</b> {fav.video.opponent}</p>
                  <p>🏆 <b>Compétition :</b> {fav.video.competition}</p>
                  <p>📅 <b>Date :</b> {fav.video.matchDate}</p>
                </div>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}