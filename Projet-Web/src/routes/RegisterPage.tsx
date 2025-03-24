import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function RegisterPage() {
  const [email, setEmail] = createSignal("");
  const [login, setLogin] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");
  const navigate = useNavigate(); // Pour rediriger après inscription

  async function handleRegister(event: Event) {
    event.preventDefault();
    setError(""); 
    setSuccess("");

    const formData = new FormData();
    formData.append("email", email());
   
    formData.append("password", password());

    const response = await fetch("/api/register", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      setSuccess("Compte créé avec succès ! Redirection...");
      setTimeout(() => navigate("/LoginPage"), 2000); // Redirige vers login après 2s
    } else {
      setError(result.message);
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-200">
      <form onSubmit={handleRegister} class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Inscription</h2>

        {error() && <p class="text-red-500 text-sm mb-3">{error()}</p>}
        {success() && <p class="text-green-500 text-sm mb-3">{success()}</p>}

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            class="border border-gray-300 rounded-lg p-2 w-full bg-gray-50 text-gray-900 focus:ring focus:ring-blue-400 focus:border-blue-500"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            required
          />
        </div>


        <div class="mb-4">
          <label class="block text-sm font-medium mb-1 text-gray-700">Mot de passe</label>
          <input
            type="password"
            class="border border-gray-300 rounded-lg p-2 w-full bg-gray-50 text-gray-900 focus:ring focus:ring-blue-400 focus:border-blue-500"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            required
          />
        </div>

        <button type="submit" class="bg-blue-600 text-white py-2 px-4 w-full rounded-lg hover:bg-blue-800 transition">
          S'inscrire
        </button>
      </form>
    </div>
  );
}
