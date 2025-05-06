import { useSubmission } from "@solidjs/router";
import { registerAction } from "~/lib/Login";

export default function RegisterPage() {
  const submission = useSubmission(registerAction)

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        method="post"
        action={registerAction}
        class="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Inscription</h2>

        {submission.error && (
          <p class="text-red-500 text-sm mb-3">{submission.error.message}</p>
        )}

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            class="border border-gray-300 rounded-lg p-2 w-full bg-gray-50 text-gray-900 focus:ring focus:ring-blue-400 focus:border-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1 text-gray-700">Mot de passe</label>
          <input
            type="password"
            name="password"
            class="border border-gray-300 rounded-lg p-2 w-full bg-gray-50 text-gray-900 focus:ring focus:ring-blue-400 focus:border-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1 text-gray-700">Clé admin (optionnel)</label>
          <input
            type="text"
            name="adminKey"
            class="border border-gray-300 rounded-lg p-2 w-full bg-gray-50 text-gray-900 focus:ring focus:ring-blue-400 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={submission.pending}
          class="bg-blue-600 text-white py-2 px-4 w-full rounded-lg hover:bg-blue-800 transition"
        >
          {submission.pending ? "Chargement..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}