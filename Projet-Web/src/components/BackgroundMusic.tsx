import { createSignal, onMount } from "solid-js";
import { Play, Pause } from "lucide-solid"; // Icônes modernes

function BackgroundMusic() {
    let audioRef: HTMLAudioElement | null = null;
    const [isPlaying, setIsPlaying] = createSignal(false);

    onMount(() => {
        audioRef?.play().then(() => setIsPlaying(true)).catch((error) => {
            console.error("La lecture automatique a été bloquée :", error);
        });
    });

    const togglePlay = () => {
        if (audioRef) {
            if (isPlaying()) {
                audioRef.pause();
            } else {
                audioRef.play();
            }
            setIsPlaying(!isPlaying());
        }
    };

    return (
        <div class="fixed bottom-4 right-4 bg-black-700 p-3 rounded-lg shadow-md flex items-center space-x-3 z-50">
            <audio ref={(el) => (audioRef = el)} loop>
                <source src="/SongBarca/Hymne FC Barcelone - Paroles et traduction.mp3" type="audio/mpeg" />
                Votre navigateur ne supporte pas l'élément audio.
            </audio>
            
            <button
                class="flex items-center bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                onclick={togglePlay}
            >
                {isPlaying() ? <Pause size={20} /> : <Play size={20} />}
                <span class="ml-2">{isPlaying() ? "Pause" : "Jouer"}</span>
            </button>
        </div>
    );
}

export default BackgroundMusic;
