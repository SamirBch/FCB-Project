import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname ? "border-b-4 border-yellow-400" : "border-b-4 border-transparent hover:border-yellow-300 transition duration-300";

  return (
    <nav class="bg-gradient-to-r from-sky-900 to-sky-700 shadow-lg">
      <ul class="container mx-auto flex justify-center items-center p-4 text-white space-x-8 text-lg font-semibold">
        <li class={`${active("/")} pb-2`}>
          <a href="/" class="px-4 py-2">🏠 Home</a>
        </li>
        <li class={`${active("/stats")} pb-2`}>
          <a href="/stats" class="px-4 py-2">📊 Stats</a>
        </li>
      </ul>
    </nav>
  );
}
