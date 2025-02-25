import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    fs: {
      allow: [
        '/Users/Samir/Desktop/ProjetWeb/solid-projectTest', // Ajoute ton projet
        '/Users/Samir/Desktop/FCB-Project'  // Ajoute ce chemin aussi
      ]
    }
  }
});
