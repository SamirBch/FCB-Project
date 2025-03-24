import { register } from "~/lib/Login";
import type { APIEvent } from "@solidjs/start/server";

export async function POST(event : APIEvent) {
  try {
    const formData = await event.request.formData();
    await register(formData);
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, message: errorMessage }), { status: 400 });
  }
}
