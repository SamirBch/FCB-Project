import { addVideo, getVideos, removeVideo } from "~/lib/videos";
//import { saveVideo } from "~/lib/storage"; 
import type { APIEvent } from "@solidjs/start/server";
import GetStats from "~/lib/stats";





export async function GET(event: APIEvent) {
  const url = new URL(event.request.url);
  const season = url.searchParams.get("season") || "2024-2025"; // Saison par défaut

  const [videos, stats] = await Promise.all([getVideos(), GetStats(season)]); // Passer la saison
  return new Response(JSON.stringify({ videos, stats }), { status: 200 });
}// A la base je retournais juste les vidéos mais j'ai ajouté les stats aussi car qud je faisais dans un autre fichier api sa marchait pas
//J'ai rajouté APIEvent et URL pour la selection de la saison





export async function POST(event: APIEvent) {
    const formData = await event.request.formData(); // A chaque Post on récupère les données du formulaire
    const file = formData.get("video") as File;
  
    if (!file) {
      throw new Error("Aucune vidéo sélectionnée.");
    }
  
    //const videoUrl = await saveVideo(file); // Sauvegarde du fichier côté serveur mais on l'utilise pas pour l'instant
  
    await addVideo(formData); //Ici on ajoute la vidéo dans la base de données avec les données du formulaire
  
    return new Response("Vidéo ajoutée avec succès", { status: 200 });
  }
  






  export async function DELETE(event: APIEvent) {
    const formData = await event.request.formData();
    const idValue = formData.get("id"); // Récupère l'ID de la vidéo à supprimer
    const id = idValue ? parseInt(idValue as string, 10) : NaN;  // Convertit l'ID en nombre car de base c'est une string car c'est un formulaire
   
  
    if (isNaN(id)) {
      throw new Error("ID invalide");
    }
  
    await removeVideo(id); // Appelle la fonction de suppression avec l'ID correct
    return new Response("Vidéo supprimée avec succès", { status: 200 });
  }
  