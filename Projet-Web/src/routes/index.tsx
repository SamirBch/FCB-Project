import { createAsyncStore, useSubmissions, type RouteDefinition } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { addVideoAction, getVideos, removeVideoAction } from "~/lib/videos";
import {opponents,finishs, seasons, scorers, assists, competitions, teams} from "~/constants/formFields";

export const route = {
  preload() {
    getVideos();
  },
} satisfies RouteDefinition;


export default function VideoPage() {
  const videos = createAsyncStore(() => getVideos(), { initialValue: [] });
  const addingVideo = useSubmissions(addVideoAction);
  const removingVideo = useSubmissions(removeVideoAction);

  const filteredVideos = createMemo(() =>
    videos().filter((video) => !removingVideo.some((d) => Number(d.input[0]) === Number(video.id)))
  );

  console.log("État des vidéos:", videos());

  
  return (
    <>
      {/* Formulaire d’ajout de vidéo */}
      <form action={addVideoAction} method="post" enctype="multipart/form-data">
        <input type="text" name="title" placeholder="Titre de la vidéo" required /> {/* le name c'est pour la clé de la data */}
        <input type="file" name="video" accept="video/*" required />



        {/*<input name="scorer" type="text" placeholder="Buteur" required />*/}
        <label for="scorer">Buteur</label>
        <select name="scorer" id="scorer" required>
          {scorers.map((scorer) => (
            <option value={scorer}>{scorer}</option>
          ))}
        </select>



        {/*<input name="assist" type="text" placeholder="Passeur" />*/}
        <label for="assist">Passeur</label>
        <select name="assist" id="assist">
          {assists.map((assist) => (
            <option value={assist}>{assist}</option>
          ))}
        </select>



        <input name="matchDate" type="date" required />



        {/*<input name="competition" type="text" placeholder="Compétition" required />*/}
        <label for="competition">Compétition</label>
        <select name="competition" id="competition" required>
          {competitions.map((competition) => (
            <option value={competition}>{competition}</option>
          ))}
        </select>




        {/*<input name="team" type="text" placeholder="Team" required />*/}
        <label for="team">Team</label>
        <select name="team" id="team" required>
          {teams.map((team) => (
            <option value={team}>{team}</option>
          ))}
        </select>



        <input name="minute" type="number" placeholder="Minute" required />




        {/*<input name="opponent" type="text" placeholder="Adversaire" required />*/}
        <label for="opponent">Adversaire</label> {/* for fait le lien avec le id de la balise */}
        <select name="opponent" id="opponent" required>
          {opponents.map((opponent) => (
            <option value={opponent}>{opponent}</option>
          ))}
        </select>


        


        {/*<input name="finish" type="text" placeholder="Finition" required />*/}
        <label for="finish">Finition</label>
        <select name="finish" id="finish" required>
          {finishs.map((finish)=>(
            <option value={finish}>{finish}</option>
          ))}
        </select>



        {/*<input name="season" type="text" placeholder="Saison" required />*/}
        <label for="season">Saison</label>
        <select name="season" id="season" required>
          {seasons.map((season)=>(
            <option value={season}>{season}</option>
          ))}
        </select>



        <button type="submit">Ajouter</button>
      </form>



      {/* Liste des vidéos */}
      <ul>
        <For each={filteredVideos()}>
          {(video) => (
            <li>
              <h3>{video.title}</h3>
              <video controls width="320">
                <source src={video.url} type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              <form method="post">
                <input type="hidden" name="id" value={video.id} />
                <button formAction={removeVideoAction.with(Number(video.id))}>Supprimer</button>
              </form>
            </li>
          )}
        </For>

        {/* Affichage des vidéos en cours d'ajout */}
        <For each={addingVideo}>
          {(sub) => (
            <Show when={sub.pending}>
              <li>{String(sub.input[0].get("title"))} (En cours...)</li>
            </Show>
          )}
        </For>
      </ul>
    </>
  );
}