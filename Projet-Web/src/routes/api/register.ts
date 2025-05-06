import { register } from "~/lib/Login";
import type { APIEvent } from "@solidjs/start/server";

const ADMIN_KEY = process.env.ADMIN_KEY; // Charger la clé depuis le fichier .env

export async function POST(event: APIEvent) {
  try {
    const formData = await event.request.formData();

    const adminKey = formData.get("adminKey") as string;
    const role = adminKey === process.env.ADMIN_KEY ? "admin" : "user";

    formData.append("role", role);

    await register(formData);

    const session = event.locals.session;
    console.log("Session avant mise à jour :", session.data);

    session.set("email", formData.get("email"));
    session.set("role", role); // Ajoutez le rôle à la session

    console.log("Session après mise à jour :", session.data);

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, message: errorMessage }), { status: 400 });
  }
}