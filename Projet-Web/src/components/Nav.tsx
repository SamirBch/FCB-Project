import { useLocation } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export default function Nav() {
  const location = useLocation();
  const [role, setRole] = createSignal("user"); // Par défaut, utilisateur normal

  // Fonction pour déterminer la classe active
  const active = (path: string) =>
    path == location.pathname
      ? "border-b-4 border-yellow-400"
      : "border-b-4 border-transparent hover:border-yellow-300 transition duration-300";

  // Récupérer le rôle de l'utilisateur au chargement
  onMount(async () => {
    try {
      const response = await fetch("/api/checkRole");
      if (response.ok) {
        const userRole = await response.text();
        setRole(userRole); // Mettre à jour le rôle (admin ou user)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du rôle :", error);
    }
  });

  return (
    <nav class="bg-gradient-to-r from-sky-900 to-sky-700 shadow-lg">
      <ul class="container mx-auto flex justify-center items-center p-4 text-white space-x-8 text-lg font-semibold">
        {/* Lien Home dynamique */}
        <li class={`${active("/")} pb-2`}>
          <a href={role() === "admin" ? "/AdminPage" : "/UserPage"} class="px-4 py-2">🏠 Home</a>
        </li>
        {/* Lien Stats */}
        <li class={`${active("/stats")} pb-2`}>
          <a href="/stats" class="px-4 py-2">📊 Stats</a>
        </li>
      </ul>
    </nav>
  );
}