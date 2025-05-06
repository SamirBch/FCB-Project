import { getUser } from "~/lib/Login";

export async function GET() {
  const user = await getUser();

  if (!user) {
    console.log("Session vide ou utilisateur non connecté.");
    return new Response(JSON.stringify({ error: "Utilisateur non connecté" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("Utilisateur récupéré :", user);
  return new Response(JSON.stringify({ user }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}