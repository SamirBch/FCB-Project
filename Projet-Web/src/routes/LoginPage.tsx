import { createSignal } from "solid-js";
import { useNavigate, redirect } from "@solidjs/router";

export default function LoginPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const navigate = useNavigate(); // Pour rediriger après connexion

  async function handleLogin(event: Event) {
    event.preventDefault();
    setError(""); // Reset les erreurs

    const formData = new FormData();
    formData.append("email", email());
    formData.append("password", password());

    const response = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });

    const result = await response.json(); 
    console.log(result);
    if (result.success) {
      // Rediriger en fonction du rôle
      if (result.role === "admin") {
        navigate("/AdminPage"); // Redirige vers la page admin
      } else {
        navigate("/UserPage"); // Redirige vers la page utilisateur
      }
    } else {
      setError(result.message || "Erreur lors de la connexion");
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-200">
      <form onSubmit={handleLogin} class="bg-white p-8 rounded-lg shadow-lg w-96 border border-gray-300">
        <h2 class="text-2xl font-bold mb-4 text-center text-gray-700">Connexion</h2>

        {error() && <p class="text-red-600 text-sm mb-3 text-center">{error()}</p>}

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            class="border border-gray-400 rounded-lg p-2 w-full bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            required
            />

        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            class="border border-gray-400 rounded-lg p-2 w-full bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            required
            />

        </div>

        <button
          type="submit"
          class="bg-blue-600 text-white py-2 px-4 w-full rounded-lg hover:bg-blue-800 transition font-semibold"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
