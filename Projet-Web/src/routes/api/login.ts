import { login } from "~/lib/Login";
import type { APIEvent } from "@solidjs/start/server";



export async function POST(event: APIEvent) {
  const formData = await event.request.formData();
  try {
    const success: boolean = (await login(formData));
    console.log("Login success:", success); // 
    return new Response(JSON.stringify({ success }), { status: success ? 200 : 401 });
  } catch (error) {
    console.error("Login error:", error); 
    return new Response(JSON.stringify({ success: false, message: "Email ou mot de passe incorrect" }), { status: 401 });
  }
}