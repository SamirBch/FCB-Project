import { APIEvent, json } from "solid-start/api";
import { getUser } from "~/lib/Login";
import { getFavorites, addFavorite, removeFavorite } from "~/lib/favorites";

export async function GET({ request }: APIEvent) {
  const user = await getUser();
  if (!user) return json({ error: "Non authentifié" }, { status: 401 });

  const favorites = await getFavorites(user.id);
  return json(favorites);
}

export async function POST({ request }: APIEvent) {
  const user = await getUser();
  if (!user) return json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();
  const { videoId } = body;

  if (!videoId) return json({ error: "ID de la vidéo manquant" }, { status: 400 });

  const result = await addFavorite(user.id, Number(videoId));
  return json(result);
}

export async function DELETE({ request }: APIEvent) {
  const user = await getUser();
  if (!user) return json({ error: "Non authentifié" }, { status: 401 });

  const body = await request.json();
  const { videoId } = body;

  if (!videoId) return json({ error: "ID de la vidéo manquant" }, { status: 400 });

  await removeFavorite(user.id, Number(videoId));
  return json({ success: true });
}




