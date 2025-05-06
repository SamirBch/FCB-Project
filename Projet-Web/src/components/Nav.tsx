import { createAsync, useLocation } from "@solidjs/router";
import { createResource } from "solid-js";
import { getSession, getUser } from "~/lib/Login";
import {db} from "~/lib/db"; 

export default function Nav() {
  const location = useLocation();

  // Utilisation de createResource pour gérer le rôle
  const user = createAsync(() => getUser());

  // Fonction pour déterminer la classe active
  const active = (path: string) =>
    path == location.pathname
      ? "border-b-4 border-yellow-400"
      : "border-b-4 border-transparent hover:border-yellow-300 transition duration-300";

  return (
    <nav class="bg-gradient-to-r from-sky-900 to-sky-700 shadow-lg">
      <ul class="container mx-auto flex justify-center items-center p-4 text-white space-x-8 text-lg font-semibold">
        {/* Lien Home dynamique */}
        <li class={`${active("/")} pb-2`}>
          <a href={user()?.role === "admin" ? "/AdminPage" : "/UserPage"} class="px-4 py-2">🏠 Home</a>
        </li>
        {/* Lien Stats */}
        <li class={`${active("/stats")} pb-2`}>
          <a href="/stats" class="px-4 py-2">📊 Stats</a>
        </li>

        <li class={`${active("/FavoritesPage")} pb-2`}>
          <a href="/FavoritesPage" class="px-4 py-2">⭐ Favorites</a>
        </li>

        <li class={`${active("/UserPage")} pb-2`}>
          <a href="/UserPage" class="px-4 py-2">🎥 Videos</a>
        </li>
      </ul>
    </nav>
  );
}