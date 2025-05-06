import { createSignal } from "solid-js";
import { redirect, useSubmission } from "@solidjs/router";
import { loginAction } from "~/lib/Login";

export default function LoginPage() {
  const submission = useSubmission(loginAction)
  

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-200">
      <form method="post" action={loginAction} class="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-300">
        <h2 class="text-2xl font-bold mb-4 text-center text-gray-700">Connexion</h2>

        {submission.error && <p class="text-red-600 text-sm mb-3 text-center">{submission.error}</p>}

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            class="border border-gray-400 rounded-lg p-2 w-full bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            
            required
            />

        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            name="password"
            type="password"
            class="border border-gray-400 rounded-lg p-2 w-full bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
           
            required
            />

        </div>

        <button
          disabled={submission.pending}
          type="submit"
          class="bg-blue-600 text-white py-2 px-4 w-full rounded-lg hover:bg-blue-800 transition font-semibold"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
