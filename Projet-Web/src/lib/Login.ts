import { useSession } from 'vinxi/http'
import bcrypt from 'bcryptjs'
import { z } from "zod";
import { db } from "./db";



type SessionData = {
  email?: string
}


export function getSession() {
  'use server'
  return useSession<SessionData>({
    password: import.meta.env.VITE_SESSION_SECRET,
  })
}

export const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  

  
  export async function register(form: FormData) {
    'use server';
    const user = userSchema.parse({
      email: form.get('email'),
      password: form.get('password'),
    });
  
    // Récupérer le rôle depuis le formulaire
    const role = form.get('role') as string || 'user'; // Par défaut, le rôle est 'user'
  
    // Hacher le mot de passe avant de l'enregistrer
    user.password = await bcrypt.hash(user.password, 10);
  
    // Créer l'utilisateur dans la base de données avec le rôle
    await db.user.create({
      data: {
        email: user.email,
        password: user.password,
        role, // Enregistrer le rôle (admin ou user)
      },
    });
  }


  export async function login(form: FormData): Promise<{ success: boolean; role?: string }> {
    'use server';
    const { email, password } = userSchema.parse({
      email: form.get('email'),
      password: form.get('password'),
    });
  
    try {
      // Rechercher l'utilisateur dans la base de données
      const record = await db.user.findUniqueOrThrow({ where: { email } });
  
      // Vérifier le mot de passe
      const loggedIn = await bcrypt.compare(password, record.password);
      console.log("loggedIN", loggedIn);
  
      if (loggedIn) {
        // Mettre à jour la session avec l'email de l'utilisateur
        const session = await getSession();
        await session.update({ email });
  
        // Retourner le succès et le rôle de l'utilisateur
        return { success: true, role: record.role }; // Inclure le rôle (admin ou user)
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return { success: false }; // ❌ Connexion échouée
    }
  
    return { success: false }; // ❌ Connexion échouée
  }
  
  
  
  
  