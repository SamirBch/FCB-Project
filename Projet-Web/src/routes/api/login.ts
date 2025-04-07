import { login } from "~/lib/Login";
import type { APIEvent } from "@solidjs/start/server";

export async function POST(event: APIEvent) {
  const formData = await event.request.formData();
  try {
    // Appeler la fonction login pour vérifier les identifiants
    const { success, role } = await login(formData); // Récupérer le rôle en plus du succès

    if (success) {
      console.log("Login success:", success, "Role:", role);

      // Retourner le succès et le rôle
      return new Response(JSON.stringify({ success, role }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, message: "Email ou mot de passe incorrect" }), { status: 401 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ success: false, message: "Erreur lors de la connexion" }), { status: 500 });
  }
}