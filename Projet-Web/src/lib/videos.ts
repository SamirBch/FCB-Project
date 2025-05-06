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

  id: z.number(),
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
  favorites: z.array(z.object({ userId: z.number() })).optional(), // Relation avec les favoris
  
});



// Le type vidéo qui correspond au schéma
export type Video = z.infer<typeof videoSchema>; // sa sert à obtenir la structure de "Video" à partir du schéma "videoSchema" afin de l'utilsier dans le signal dans ma UserPage. 
//C'est pour éviter de répéter la structure de la vidéo dans plusieurs endroits du code




// 📌 Ajouter une vidéo dans la base de données et sur le serveur
export const addVideo = async (formData: FormData) => {
    "use server"; 
    const title = formData.get("title") as string;
    const file = formData.get("video") as File | null;

    const now = new Date(); //Pour être sûr que le titre de la vidéo est unique
    const uniqueTitle = `${title}_${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`;

  
   console.log("📝 Ajout d'une nouvelle vidéo :", uniqueTitle);
  

    if (!file) {
      throw new Error("Aucune vidéo sélectionnée.");
    }

  
    // Vérifiez si une vidéo avec le même titre existe déjà
    const existingVideo = await db.video.findFirst({
      where: { title: uniqueTitle },
    });
  
    if (existingVideo) {
      throw new Error("Une vidéo avec ce titre existe déjà.");
    }



    const parsedData = videoSchema.parse({
      title: uniqueTitle,                   //pcq j'utilise la variable title plus haut déjà donc autant l'utiliser
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
      const video = await db.video.create({ 
        data: {
          ...parsedData,
          favorites: parsedData.favorites
            ? { create: parsedData.favorites }
            : undefined,
        },
      });
      console.log("✅ Vidéo ajoutée dans la base de données :", video);
      return video;
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de la vidéo dans la base de données :", error);
      throw error;
    }
  };




////QUERY très important pour récupérer les vidéos de la base de données de manière dynamique, car sa met en cache

export const getVideos = query(async (filter?: Partial<z.infer<typeof videoSchema>>) => { //car on veut qu'une partie de la structure de la vidéo
  "use server";
  if (!filter) {
    return db.video.findMany(); // Récupère toutes les vidéos qui sont enregistrées dans la db
  } else {
    filter = videoSchema.partial().parse(filter); // Valide les données du filtre
    return db.video.findMany({ 
        where: {
            ...filter,
            favorites: filter.favorites
                ? { some: { userId: { in: filter.favorites.map(fav => fav.userId) } } }
                : undefined,
        },
    });
  } // Récupère toutes les vidéos qui sont enregistrées dans la db
}, 'getVideos');




// 📌 Supprimer une vidéo de la base de données et du serveur
export const removeVideo = async (id: number) => {
    "use server";
  
    // Récupérer la vidéo depuis la base de données
    const video = await db.video.findUnique({
      where: { id: id }, // Vérifie bien que id est un nombre valide
      include: { favorites: true }, // Inclure les favoris associés
    });
  
    if (!video) {
      throw new Error("Vidéo non trouvée.");
    }

    // Supprimer les favoris associés
    await db.favorite.deleteMany({
    where: { videoId: id },
  });
  
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