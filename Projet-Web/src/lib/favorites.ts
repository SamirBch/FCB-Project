import { db } from "./db";
import { action, query} from '@solidjs/router';

// Récupère tous les favoris d'un utilisateur (avec les données vidéo associées)
export const getFavorites = query(async (userId: number) => {
  'use server'
  return await db.favorite.findMany({
    where: { userId },
    include: {
      video: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}, 'getFavorites');

export const getFavoritesAction = action(getFavorites)



// Ajoute une vidéo aux favoris
export async function addFavorite(userId: number, videoId: number) {
  'use server'
  return await db.favorite.create({
    data: {
      userId,
      videoId,
    },
  });
}

export const addFavoriteAction = action(addFavorite)

// Supprime une vidéo des favoris
export async function removeFavorite(userId: number, videoId: number) {
  'use server'
  return await db.favorite.deleteMany({
    where: {
      userId,
      videoId,
    },
  });
}

export const removeFavoriteAction = action(removeFavorite)