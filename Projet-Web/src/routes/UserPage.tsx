import { createAsyncStore } from "@solidjs/router";
import { createSignal, Show, For } from "solid-js";
import { getVideos } from "~/lib/videos";
import { Video } from "~/lib/videos";
import Filters from "~/components/Filter";

export default function UserPage() {
  const videos = createAsyncStore(() => getVideos(), { initialValue: [] });

  // États pour les filtres
  const [selectedScorer, setSelectedScorer] = createSignal<string | null>(null);
  const [selectedOpponent, setSelectedOpponent] = createSignal<string | null>(null);
  const [selectedFinish, setSelectedFinish] = createSignal<string | null>(null);
  const [selectedSeason, setSelectedSeason] = createSignal<string | null>(null);
  const [selectedCompetition, setSelectedCompetition] = createSignal<string | null>(null);
  const [showFilters, setShowFilters] = createSignal(false);

  // Filtrer les vidéos en fonction des filtres sélectionnés
  const filteredVideos = () => {
    return videos().filter(video => {
      return (
        (!selectedScorer() || video.scorer === selectedScorer()) &&
        (!selectedOpponent() || video.opponent === selectedOpponent()) &&
        (!selectedFinish() || video.finish === selectedFinish()) &&
        (!selectedSeason() || video.season === selectedSeason()) &&
        (!selectedCompetition() || video.competition === selectedCompetition())
      );
    });
  };

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSelectedScorer(null);
    setSelectedOpponent(null);
    setSelectedFinish(null);
    setSelectedSeason(null);
    setSelectedCompetition(null);
  };

  // État pour la vidéo sélectionnée
  const [selectedVideo, setSelectedVideo] = createSignal<Video | null>(null);

  return (
    <div class="min-h-screen bg-gradient-to-b from-black-900 to-blue-700 text-white p-6 relative">
      <Show when={selectedVideo()}>
        <div class="fixed inset-0 backdrop-blur-md transition-opacity duration-300"></div>
      </Show>

      <button
        onClick={() => setShowFilters(!showFilters())}
        class="absolute top-4 right-4 bg-black text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition"
      >
        {showFilters() ? "Masquer les filtres" : "Afficher les filtres"}
      </button>

      <Show when={showFilters()}>
        <Filters
          setSelectedScorer={setSelectedScorer}
          setSelectedOpponent={setSelectedOpponent}
          setSelectedFinish={setSelectedFinish}
          setSelectedSeason={setSelectedSeason}
          setSelectedCompetition={setSelectedCompetition}
          resetFilters={resetFilters}
        />
      </Show>

      <div class="max-w-5xl mx-auto">
        <h2 class="text-4xl font-extrabold text-yellow-400 mb-6 text-center">📹 Vidéos des Buts</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <For each={filteredVideos()}>
            {(video) => (
              <li
                class="bg-white p-5 rounded-xl shadow-xl cursor-pointer hover:scale-105 transition-all duration-300 border border-gray-300 hover:border-red-600 hover:shadow-2xl flex justify-between items-center"
                onClick={() => setSelectedVideo(video)}
              >
                <div class="flex flex-col space-y-2">
                  <h3 class="text-lg font-semibold text-black mb-2">{video.title}</h3>
                  <p class="text-gray-700">⚽ <b>Buteur :</b> {video.scorer}</p>
                  <p class="text-gray-700">🆚 <b>Adversaire :</b> {video.opponent}</p>
                  <p class="text-gray-700">🏆 <b>Compétition :</b> {video.competition}</p>
                  <p class="text-gray-700">📅 <b>Date :</b> {video.matchDate}</p>
                </div>
                <img src="/ImageBarca/LogoFCB.svg.png" alt="FC Barcelona" class="w-20 h-20" />
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
}
