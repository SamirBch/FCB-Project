// src/components/GoalsPerMatchChart.tsx
import { onMount, onCleanup, createEffect } from "solid-js";
import { LinearScale } from "chart.js";
import { Chart as ChartJS, registerables } from "chart.js";

// Enregistrez l'échelle linear
ChartJS.register(...registerables, LinearScale);

type MatchData = {
    matchDate: string; // Date du match
    opponent: string; // Nom de l'adversaire
    goals: number; // Nombre de buts
};

type GoalsPerMatchChartProps = {
    data: MatchData[];
};

function GoalsPerMatchChart(props: GoalsPerMatchChartProps) {
    let chartRef: HTMLCanvasElement | null = null;
    let chartInstance: ChartJS | null = null;

    // Fonction pour créer le graphique
    const createChart = () => {
        if (chartInstance) {
            chartInstance.destroy(); // Détruire l'ancien graphique
        }
        if (props.data.length === 0) {
            return; // Ne rien faire si aucune donnée n'est disponible
        }
        if (chartRef) {
            chartInstance = new ChartJS(chartRef, {
                type: "bar",
                data: {
                    labels: props.data.map((d) => `${d.matchDate} vs ${d.opponent}`), // Combinez la date et l'adversaire
                    datasets: [
                        {
                            label: "Nombre de buts",
                            data: props.data.map((d) => d.goals), // Nombre de buts
                            backgroundColor: "rgba(136, 132, 216, 0.6)", // Couleur des barres
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            type: "linear", // Définissez explicitement l'échelle
                            beginAtZero: true,
                            ticks: {
                                color: "#FFFF00", // Couleur jaune vif pour les labels de l'axe Y
                            },
                            grid: {
                                color: "rgba(255, 255, 255, 0.1)", // Couleur des grilles de l'axe Y
                            },
                        },
                        x: {
                            ticks: {
                                color: "#FFFF00", // Couleur jaune vif pour les labels de l'axe X
                            },
                            grid: {
                                color: "rgba(255, 255, 255, 0.1)", // Couleur des grilles de l'axe X
                            },
                        },
                    },
                },
            });
        }
    };

    // Créer le graphique au montage
    onMount(() => {
        createChart();
    });

    // Détruire le graphique au démontage
    onCleanup(() => {
        if (chartInstance) {
            chartInstance.destroy();
        }
    });

    // Recréer le graphique lorsque les données changent
    createEffect(() => {
        createChart();
    });

    return (
        <div>
            {props.data.length === 0 ? (
                <p class="text-yellow-400">Aucune donnée disponible pour cette saison.</p>
            ) : (
                <canvas ref={(el) => (chartRef = el)} />
            )}
        </div>
    );
}

export default GoalsPerMatchChart;