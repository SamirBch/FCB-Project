import { createAsyncStore, useSubmissions, type RouteDefinition } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { addVideoAction, getVideos, removeVideoAction } from "~/lib/videos";
import { opponents, finishs, seasons, scorers, assists, competitions, teams } from "~/constants/formFields";


export const route = {
  preload() {
    getVideos();
  },
} satisfies RouteDefinition;

export default function AdminPage() {
  const videos = createAsyncStore(() => getVideos(), { initialValue: [] });
  const addingVideo = useSubmissions(addVideoAction);
  const removingVideo = useSubmissions(removeVideoAction);

  const filteredVideos = createMemo(() =>
    videos().filter((video) => !removingVideo.some((d) => Number(d.input[0]) === Number(video.id))
  ));

  console.log("État des vidéos:", videos());

  return (
    
      <div class="min-h-screen bg-gradient-to-b from-black-900 to-blue-700 text-white p-6">
        {/* Formulaire d’ajout de vidéo */}
        <form
          action={addVideoAction}
          method="post"
          enctype="multipart/form-data"
          class="bg-black-900 p-6 rounded-lg shadow-lg max-w-2xl mx-auto mb-8"
        >
          <h2 class="text-2xl font-bold text-yellow-400 mb-4">Ajouter une vidéo</h2>

          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-white">Titre de la vidéo</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Titre de la vidéo"
                required
                class="w-full p-2 rounded bg-white text-blue-900 placeholder-gray-500"
              />
            </div>

            <div>
              <label for="video" class="block text-sm font-medium text-white">Vidéo</label>
              <input
                type="file"
                name="video"
                id="video"
                accept="video/*"
                required
                class="w-full p-2 rounded bg-white text-blue-900"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="scorer" class="block text-sm font-medium text-white">Buteur</label>
                <select
                  name="scorer"
                  id="scorer"
                  required
                  class="w-full p-2 rounded bg-white text-blue-900"
                >
                  {scorers.map((scorer) => (
                    <option value={scorer}>{scorer}</option>
                  ))}
                </select>
              </div>

              <div>
                <label for="assist" class="block text-sm font-medium text-white">Passeur</label>
                <select
                  name="assist"
                  id="assist"
                  class="w-full p-2 rounded bg-white text-blue-900"
                >
                  {assists.map((assist) => (
                    <option value={assist}>{assist}</option>
                  ))}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="matchDate" class="block text-sm font-medium text-white">Date du match</label>
                <input
                  type="date"
                  name="matchDate"
                  id="matchDate"
                  required
                  class="w-full p-2 rounded bg-white text-blue-900"
                />
              </div>

              <div>
                <label for="competition" class="block text-sm font-medium text-white">Compétition</label>
                <select
                  name="competition"
                  id="competition"
                  required
                  class="w-full p-2 rounded bg-white text-blue-900"
                >
                  {competitions.map((competition) => (
                    <option value={competition}>{competition}</option>
                  ))}
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="team" class="block text-sm font-medium text-white">Équipe</label>
                <select
                  name="team"
                  id="team"
                  required
                  class="w-full p-2 rounded bg-white text-blue-900"
                >
                  {teams.map((team) => (
                    <option value={team}>{team}</option>
                  ))}
                </select>
              </div>

              <div>
                <label for="minute" class="block text-sm font-medium text-white">Minute</label>
                <input
                  type="number"
                  name="minute"
                  id="minute"
                  placeholder="Minute"
                  required
                  class="w-full p-2 rounded bg-white text-blue-900"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label for="opponent" class="block text-sm font-medium text-white">Adversaire</label>
                <select
                  name="opponent"
                  id="opponent"
                  required
                  class="w-full p-2 rounded bg-white text-blue-900"
                >
                  {opponents.map((opponent) => (
                    <option value={opponent}>{opponent}</option>
                  ))}
                </select>
              </div>

              <div>
                <label for="finish" class="block text-sm font-medium text-white">Finition</label>
                <select
                  name="finish"
                  id="finish"
                  required
                  class="w-full p-2 rounded bg-white text-blue-900"
                >
                  {finishs.map((finish) => (
                    <option value={finish}>{finish}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label for="season" class="block text-sm font-medium text-white">Saison</label>
              <select
                name="season"
                id="season"
                required
                class="w-full p-2 rounded bg-white text-blue-900"
              >
                {seasons.map((season) => (
                  <option value={season}>{season}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              class="w-full bg-yellow-400 text-blue-900 font-bold py-2 px-4 rounded hover:bg-yellow-500 transition-colors"
            >
              Ajouter
            </button>
          </div>
        </form>

        {/* Liste des vidéos */}
        <div class="max-w-4xl mx-auto">
          <h2 class="text-2xl font-bold text-yellow-400 mb-4">Liste des vidéos</h2>
          <ul class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <For each={filteredVideos()}>
              {(video) => (
                <li class="bg-white p-4 rounded-lg shadow-lg">
                  <h3 class="text-xl font-bold text-red-600">{video.title}</h3>
                  <video controls class="w-full aspect-video rounded-lg">
                    <source src={video.url} type="video/mp4" />
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                  <form method="post" class="text-center">
                    <input type="hidden" name="id" value={video.id} />
                    <button
                      formAction={removeVideoAction.with(Number(video.id))}
                      class="bg-black-75 text-black font-bold py-2 px-4 rounded hover:bg-black-75 transition-colors"
                    >
                      Supprimer
                    </button>
                  </form>
                </li>
              )}
            </For>

            {/* Affichage des vidéos en cours d'ajout */}
            <For each={addingVideo}>
              {(sub) => (
                <Show when={sub.pending}>
                  <li class="bg-yellow-400 text-blue-900 p-4 rounded-lg shadow-lg">
                    {String(sub.input[0].get("title"))} (En cours...)
                  </li>
                </Show>
              )}
            </For>
          </ul>
        </div>
      </div>
    
  );
}