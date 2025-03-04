// src/routes/stats.tsx
import { createResource, createSignal, For } from "solid-js";
import { seasons } from "~/constants/formFields";
import GoalsPerMatchChart from "~/components/GoalsPerMatchChart";

type Scorer = {
    scorer: string;
    _count: {
        scorer: number;
    };
};

type Assist = {
    assist: string;
    _count: {
        assist: number;
    };
};

type Match = { 
    matchDate: string;
    opponent: string; 
    _count: { id: number } 
};



const fetchStats = async (season: string) => {
    let url: string;
    if (typeof window !== "undefined") {
        // Côté client
        url = new URL(`/api/videos?season=${season}`, window.location.origin).toString();
    } else {
        // Côté serveur
        const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"; // Utilisez la variable d'environnement ou une valeur par défaut
        url = new URL(`/api/videos?season=${season}`, baseUrl).toString();
    }
    //console.log("URL utilisée :", url); // Log pour vérifier l'URL
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.stats.body;
};

function Stats() {
    const [selectedSeason, setSelectedSeason] = createSignal(seasons[0]);
    const [stats] = createResource(selectedSeason, fetchStats);

    return (
        <div class="min-h-screen bg-gradient-to-b from-black-900 to-blue-700 text-white p-8">
            <div class="max-w-4xl mx-auto bg-black-900 p-6 rounded-lg shadow-xl">
                {/* Sélecteur de saison */}
                <div class="mb-6">
                    <label for="season" class="text-yellow-400 font-bold">
                        Choisir une saison :
                    </label>
                    <select
                        id="season"
                        class="ml-4 bg-black-700 text-white p-2 rounded-lg"
                        value={selectedSeason()}
                        onInput={(e) => setSelectedSeason(e.currentTarget.value)}
                    >
                        <For each={seasons}>{(season) => <option value={season}>{season}</option>}</For>
                    </select>
                </div>

                <h2 class="text-3xl font-bold text-yellow-400 mb-6">Top 5 Buteurs ({selectedSeason()})</h2>
                {stats.loading && <p class="text-center text-yellow-400">Chargement...</p>}
                {stats.error && <p class="text-center text-red-500">Erreur: {stats.error.message}</p>}
                {stats() && (
                    <ul class="space-y-4">
                        <For each={stats().topScorers}>
                            {(scorer: Scorer) => (
                                <li id={scorer.scorer} class="flex justify-between items-center bg-black-700 p-4 rounded-lg shadow-md">
                                    <span class="text-lg">{scorer.scorer}</span>
                                    <span class="text-yellow-400 font-bold">{scorer._count.scorer} buts</span>
                                </li>
                            )}
                        </For>
                    </ul>
                )}

                <h2 class="text-3xl font-bold text-yellow-400 mt-8 mb-6">Top 5 Passeurs ({selectedSeason()})</h2>
                {stats.loading && <p class="text-center text-yellow-400">Chargement...</p>}
                {stats.error && <p class="text-center text-red-500">Erreur: {stats.error.message}</p>}
                {stats() && (
                    <ul class="space-y-4">
                        <For each={stats().topAssists}>
                            {(assist: Assist) => (
                                <li id={assist.assist} class="flex justify-between items-center bg-black-700 p-4 rounded-lg shadow-md">
                                    <span class="text-lg">{assist.assist}</span>
                                    <span class="text-yellow-400 font-bold">{assist._count.assist} passes</span>
                                </li>
                            )}
                        </For>
                    </ul>
                )}

                {/* Graphique des buts par match */}
                <h2 class="text-3xl font-bold text-yellow-400 mt-8 mb-6">Buts par match ({selectedSeason()})</h2>
                {stats.loading && <p class="text-center text-yellow-400">Chargement...</p>}
                {stats.error && <p class="text-center text-red-500">Erreur: {stats.error.message}</p>}
                {stats() && (
                    <GoalsPerMatchChart
                        data={stats().goalsPerMatch.map((match: Match ) => ({
                            matchDate: new Date(match.matchDate).toLocaleDateString(),
                            opponent: match.opponent,
                            goals: match._count.id,
                        }))}
                    />
                )}
            </div>
        </div>
    );
}

export default Stats;