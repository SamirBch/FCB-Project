import { createAsyncStore } from "@solidjs/router";
import { createSignal, Show, For } from "solid-js";
import { getVideos } from "~/lib/videos";

export default function UserPage() {
  const videos = createAsyncStore(() => getVideos(), { initialValue: [] });

  // État pour la vidéo sélectionnée
  const [selectedVideo, setSelectedVideo] = createSignal<{
    id: number;
    title: string;
    url: string;
    scorer: string;
    assist: string;
    matchDate: string;
    competition: string;
    season: string;
    team: string;
    minute: number;
    opponent: string;
    finish: string;
  } | null>(null);

  return (
    <div class="min-h-screen bg-gradient-to-b from-black-900 to-blue-700 text-white p-6">
      {/* Liste des vidéos */}
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-extrabold text-yellow-400 mb-6 text-center">📹 Vidéos des Buts</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <For each={videos()}>
            {(video) => (
              <li
                class="bg-white p-5 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-200 hover:border-blue-500"
                onClick={() => setSelectedVideo(video)}
              >
                <h3 class="text-lg font-semibold text-black mb-2">{video.title}</h3>
                <p class="text-gray-700">⚽ <b>Buteur :</b> {video.scorer}</p>
                <p class="text-gray-700">🆚 <b>Adversaire :</b> {video.opponent}</p>
                <p class="text-gray-700">🏆 <b>Compétition :</b> {video.competition}</p>
                <p class="text-gray-700">📅 <b>Date :</b> {video.matchDate}</p>
              </li>
            )}
          </For>
        </ul>
      </div>

      {/* Onglet latéral pour afficher la vidéo sélectionnée */}
      <Show when={selectedVideo()}>
        <div 
          class="fixed top-0 left-0 w-96 h-full bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300"
          classList={{ "-translate-x-full": !selectedVideo(), "translate-x-0": !selectedVideo() }}
        >
          {/* Bouton fermer */}
          <button
            class="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
            onClick={() => setSelectedVideo(null)}
          >
            ❌
          </button>

          {/* Titre de la vidéo */}
          <h3 class="text-2xl font-bold text-black mb-4">{selectedVideo()?.title}</h3>

          {/* Affichage de la vidéo */}
          <video controls class="w-full rounded-lg shadow-lg">
            <source src={selectedVideo()?.url} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>

          {/* Détails de la vidéo */}
          <div class="mt-4 text-gray-900 space-y-2">
            <p>⚽ <b>Buteur :</b> {selectedVideo()?.scorer}</p>
            <p>🅰️ <b>Passeur :</b> {selectedVideo()?.assist}</p>
            <p>🆚 <b>Adversaire :</b> {selectedVideo()?.opponent}</p>
            <p>🏆 <b>Compétition :</b> {selectedVideo()?.competition}</p>
            <p>📅 <b>Date :</b> {selectedVideo()?.matchDate}</p>
            <p>⏱️ <b>Minute :</b> {selectedVideo()?.minute}</p>
            <p>🥅 <b>Finition :</b> {selectedVideo()?.finish}</p>
            <p>📅 <b>Saison :</b> {selectedVideo()?.season}</p>
          </div>
        </div>
      </Show>
    </div>
  );
}
