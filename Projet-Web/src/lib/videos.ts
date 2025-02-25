import fs from "fs/promises";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { db } from "./db"; 
import { z } from "zod";
import { action, query } from "@solidjs/router"; 
import { saveVideo } from "./storage";


// 📌 Schéma de validation des vidéos
//Va permettre de valider les données du formulaire avant de les parser donc avant de les envoyer à la base de données!!!!
const videoSchema = z.object({
  title: z.string(),
  url: z.string(),
  scorer: z.string(),
  assist: z.string(),
  matchDate: z.string(),
  competition: z.string(),
  season: z.string(),
  team: z.string(),
  minute: z.number(),
  opponent: z.string(),
  finish: z.string(),
});






// 📌 Ajouter une vidéo dans la base de données et sur le serveur
export const addVideo = async (formData: FormData) => {
    "use server"; 
    const title = formData.get("title") as string;
    const file = formData.get("video") as File | null;
  
    if (!file) {
      throw new Error("Aucune vidéo sélectionnée.");
    }
  
    // Vérifiez si une vidéo avec le même titre existe déjà
    const existingVideo = await db.video.findFirst({
      where: { title: title },
    });
  
    if (existingVideo) {
      throw new Error("Une vidéo avec ce titre existe déjà.");
    }



    const parsedData = videoSchema.parse({
      title: title,                   //pcq j'utilise la variable title plus haut déjà donc autant l'utiliser
      url: await saveVideo(file),
      scorer: formData.get("scorer") as string,
      assist: formData.get("assist") as string,
      matchDate: formData.get("matchDate") as string,
      competition: formData.get("competition") as string,
      season: formData.get("season") as string,
      team: formData.get("team") as string,
      minute: parseInt(formData.get("minute") as string, 10),
      opponent: formData.get("opponent") as string,
      finish: formData.get("finish") as string,
    });
  

    
    try {
      const video = await db.video.create({ data: parsedData });
      console.log("✅ Vidéo ajoutée dans la base de données :", video);
      return video;
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la vidéo dans la base de données :", error);
      throw error;
    }
  };




////QUERY très important pour récupérer les vidéos de la base de données de manière dynamique

export const getVideos = query(async () => {
  "use server";
  return db.video.findMany(); // Récupère toutes les vidéos qui sont enregistrées dans la db
}, 'getVideos');




// 📌 Supprimer une vidéo de la base de données et du serveur
export const removeVideo = async (id: number) => {
    "use server";
  
    // Récupérer la vidéo depuis la base de données
    const video = await db.video.findUnique({
      where: { id: id }, // Vérifie bien que id est un nombre valide
    });
  
    if (!video) {
      throw new Error("Vidéo non trouvée.");
    }
  
    // 📌 Supprimer le fichier vidéo du dossier
    const filePath = path.join(process.cwd(), "public", video.url); // Chemin absolu du fichier
    await fs.unlink(filePath); // Supprime le fichier vidéo
  
    // 📌 Supprimer l'entrée de la base de données
    return db.video.delete({ where: { id: id } }); // sa renvoie la db avec la vidéo supprimée
  };
  







  ////////Je ne comprends pas pourquoi on a besoin de cette fonction........

export const addVideoAction = action(async (formData: FormData) => {
    'use server'
    console.log("⚡ addVideoAction appelée avec les données du formulaire");
  
    try {
      console.log("En train d'ajouter la vidéo...");
      await addVideo(formData);
      console.log("Vidéo ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la vidéo :", error);
      throw error;
    }
  }, { name: "addVideoAction" });
  
  
  



// 📌 Action pour supprimer une vidéo
export const removeVideoAction = action(async (id: number) => {
  "use server";
  try {
    await removeVideo(id); // Appelle la fonction de suppression
  } catch (error) {
    console.error("Erreur lors de la suppression de la vidéo :", error);
    throw error;
  }
}, { name: "removeVideoAction" });