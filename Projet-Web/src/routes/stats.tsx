import { createResource, createSignal } from 'solid-js';
import { seasons } from '~/constants/formFields';


type Scorer ={           
    scorer: string;
    _count: {
      scorer: number;
    };
  }
  
type Assist = {
    assist: string;
    _count: {
      assist: number;
    };
  }
  


const fetchStats = async (season: string) => {
  const response = await fetch(`/api/videos?season=${season}`); // Ajout du paramètre saison
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.stats.body;
};

function Stats() {
  const [selectedSeason, setSelectedSeason] = createSignal(seasons[0]); // Saison par défaut
  const [stats] = createResource(selectedSeason, fetchStats); // Re-fetch à chaque changement de saison

  return (
    <div class="min-h-screen bg-gradient-to-b from-black-900 to-blue-700 text-white p-8">
      <div class="max-w-4xl mx-auto bg-black-900 p-6 rounded-lg shadow-xl">
        
        {/* Sélecteur de saison */}
        <div class="mb-6">
          <label for="season" class="text-yellow-400 font-bold">Choisir une saison :</label>
          <select 
            id="season"
            class="ml-4 bg-black-700 text-white p-2 rounded-lg"
            value={selectedSeason()}
            onInput={(e) => setSelectedSeason(e.currentTarget.value)}
          >
            {seasons.map(season => (
              <option value={season}>{season}</option>
            ))}
          </select>
        </div>

        <h2 class="text-3xl font-bold text-yellow-400 mb-6">Top 5 Buteurs ({selectedSeason()})</h2>
        {stats.loading && <p class="text-center text-yellow-400">Chargement...</p>}
        {stats.error && <p class="text-center text-red-500">Erreur: {stats.error.message}</p>}
        {stats() && (
          <ul class="space-y-4">
            {stats().topScorers.map((scorer: Scorer) => ( // Ajout du type Scorer, si on met pas le type, on aura une erreur, dcp definir le type avant puis faire ... : le type implémenter
              <li id={scorer.scorer} class="flex justify-between items-center bg-black-700 p-4 rounded-lg shadow-md">
                <span class="text-lg">{scorer.scorer}</span>
                <span class="text-yellow-400 font-bold">{scorer._count.scorer} buts</span>
              </li>
            ))}
          </ul>
        )}

        <h2 class="text-3xl font-bold text-yellow-400 mt-8 mb-6">Top 5 Passeurs ({selectedSeason()})</h2>
        {stats.loading && <p class="text-center text-yellow-400">Chargement...</p>}
        {stats.error && <p class="text-center text-red-500">Erreur: {stats.error.message}</p>}
        {stats() && (
          <ul class="space-y-4">
            {stats().topAssists.map((assist: Assist) => (
              <li id={assist.assist} class="flex justify-between items-center bg-black-700 p-4 rounded-lg shadow-md">
                <span class="text-lg">{assist.assist}</span>
                <span class="text-yellow-400 font-bold">{assist._count.assist} passes</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Stats;
