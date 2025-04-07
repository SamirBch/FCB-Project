import { register } from "~/lib/Login";
import type { APIEvent } from "@solidjs/start/server";

const ADMIN_KEY = process.env.ADMIN_KEY; // Charger la clé depuis le fichier .env

export async function POST(event : APIEvent) {
  try {
    const formData = await event.request.formData();

    // Récupérer la clé admin depuis le formulaire
    const adminKey = formData.get("adminKey") as string;

    // Déterminer le rôle en fonction de la clé admin
    const role = adminKey === ADMIN_KEY ? "admin" : "user";

    // Ajouter le rôle aux données du formulaire
    formData.append("role", role);


    await register(formData);
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, message: errorMessage }), { status: 400 });
  }
}
