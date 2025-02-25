import fs from "fs";
import path from "path";

export async function saveVideo(file: File): Promise<string> { //renvoie une promesse de string en prenant un file de type File en paramètre
  const uploadsDir = path.join(process.cwd(), "public/uploads"); //définit le chemin du dossier uploads en partant du dossier courant

  if (!fs.existsSync(uploadsDir)) { //si le dossier n'existe pas
    fs.mkdirSync(uploadsDir, { recursive: true }); //crée le dossier
  }

  const filePath = path.join(uploadsDir, file.name); //définit le chemin du fichier en partant du dossier uploads
  const buffer = Buffer.from(await file.arrayBuffer()); //crée un buffer à partir du contenu du fichier
  fs.writeFileSync(filePath, buffer); //écrit le contenu du buffer dans le fichier

  return `/uploads/${file.name}`; //renvoie le chemin du fichier
}
