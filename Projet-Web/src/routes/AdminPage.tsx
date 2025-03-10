// AdminPage.tsx
import { createAsyncStore, useSubmissions, type RouteDefinition } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { addVideoAction, getVideos, removeVideoAction } from "~/lib/videos";
import { opponents, finishs, seasons, scorers, assists, competitions, teams } from "~/constants/formFields";
import FormField from "~/components/formFields";

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
    videos().filter((video) => !removingVideo.some((d) => Number(d.input[0]) === Number(video.id)))
  );

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
          <FormField label="Titre de la vidéo" name="title" id="title" type="text" required placeholder="Titre de la vidéo" />
          <FormField label="Vidéo" name="video" id="video" type="file" required />
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Buteur" name="scorer" id="scorer" type="select" options={scorers} required />
            <FormField label="Passeur" name="assist" id="assist" type="select" options={assists} />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Date du match" name="matchDate" id="matchDate" type="date" required />
            <FormField label="Compétition" name="competition" id="competition" type="select" options={competitions} required />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Équipe" name="team" id="team" type="select" options={teams} required />
            <FormField label="Minute" name="minute" id="minute" type="number" required placeholder="Minute" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Adversaire" name="opponent" id="opponent" type="select" options={opponents} required />
            <FormField label="Finition" name="finish" id="finish" type="select" options={finishs} required />
          </div>
          <FormField label="Saison" name="season" id="season" type="select" options={seasons} required />

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
