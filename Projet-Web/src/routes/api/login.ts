import { getUser, login } from "~/lib/Login";
import type { APIEvent } from "@solidjs/start/server";

export async function POST(event: APIEvent) {
  const formData = await event.request.formData();
  try {
    
    await login(formData);
    const user = await getUser()
    return user
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ success: false, message: "Erreur lors de la connexion" }), { status: 500 });
  }
}