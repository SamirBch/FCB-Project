import type { APIEvent } from "@solidjs/start/server";


export async function GET(event: APIEvent) {
    const role = event.locals.session?.get("role"); // Récupérer le rôle depuis la session
    if (role) {
      return new Response(role, { status: 200 }); // Retourner le rôle si l'utilisateur est connecté
    } else {
      return new Response("Non authentifié", { status: 401 }); // Retourner une erreur si non connecté
    }
  }