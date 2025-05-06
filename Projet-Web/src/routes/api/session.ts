import type { APIEvent } from "@solidjs/start/server";
import { getSession } from "~/lib/Login"; // Assurez-vous que le chemin est correct

// Exemple dans une API ou une route côté serveur
export async function GET(event: APIEvent) {
    const session = await getSession(); // Récupérer la session côté serveur
    return new Response(JSON.stringify(session.data), { status: 200 });
  }