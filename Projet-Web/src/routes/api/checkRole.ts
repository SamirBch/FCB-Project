import type { APIEvent } from "@solidjs/start/server";

export async function GET(event: APIEvent) {
    console.log("Session actuelle :", event.locals.session); // Log pour vérifier la session
    const role = event.locals.session?.get("role"); // Récupérer le rôle depuis la session
    console.log("Rôle récupéré :", role); // Log pour vérifier le rôle

    if (role) {
        return new Response(role, { status: 200 }); // Retourner le rôle si l'utilisateur est connecté
    } else {
        console.log("Utilisateur non authentifié");
        return new Response("Non authentifié", { status: 401 }); // Retourner une erreur si non connecté
    }
}