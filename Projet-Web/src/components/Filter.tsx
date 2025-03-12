import { createSignal } from "solid-js";
import { scorers, opponents, finishs, seasons, competitions } from "~/constants/formFields";

interface FiltersProps {
  setSelectedScorer: (value: string | null) => void;
  setSelectedOpponent: (value: string | null) => void;
  setSelectedFinish: (value: string | null) => void;
  setSelectedSeason: (value: string | null) => void;
  setSelectedCompetition: (value: string | null) => void;
  resetFilters: () => void;
}

export default function Filters(props: FiltersProps) {
  return (
    <div class="absolute top-14 right-4 bg-white text-black p-4 rounded-lg shadow-xl">
      <h3 class="text-xl font-bold mb-4">Filtres</h3>

      {/* Génération des filtres dynamiquement */}
      {[
        { label: "Buteur", options: scorers, onChange: props.setSelectedScorer },
        { label: "Adversaire", options: opponents, onChange: props.setSelectedOpponent },
        { label: "Finition", options: finishs, onChange: props.setSelectedFinish },
        { label: "Saison", options: seasons, onChange: props.setSelectedSeason },
        { label: "Compétition", options: competitions, onChange: props.setSelectedCompetition },
      ].map(({ label, options, onChange }) => (
        <div class="mb-4">
          <label class="block mb-2">{label}</label>
          <select onChange={(e) => onChange(e.target.value || null)} class="border rounded-lg p-2 w-full">
            <option value="">Tous</option>
            {options.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
      ))}

      <button
        onClick={props.resetFilters}
        class="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
