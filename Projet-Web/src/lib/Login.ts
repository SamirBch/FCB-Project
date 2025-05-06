import { useSession } from 'vinxi/http'
import bcrypt from 'bcryptjs'
import { z } from "zod";
import { db } from "./db";
import { action, query, redirect } from '@solidjs/router';





type SessionData = {
  email?: string
}


export function getSession() {
  'use server'
  return useSession<SessionData>({
    password: import.meta.env.VITE_SESSION_SECRET,
    

  })
}


export const getUser = query(async () => {
  'use server';
  try {
    const session = await getSession();
    console.log("Session data dans getUser :", session.data);

    if (!session.data.email) {
      return null; // Aucun utilisateur connecté
    }

    // Rechercher l'utilisateur dans la base de données
    return await db.user.findUniqueOrThrow({
      where: { email: session.data.email },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null; // Retourner null en cas d'erreur
  }
}, 'getUser'); 



export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})


export async function register(form: FormData) {
  'use server';
  console.log("Données reçues pour l'inscription :", form);

  const user = userSchema.parse({
    email: form.get('email'),
    password: form.get('password'),
  });

  const role = form.get('role') as string || 'user';
  console.log("Rôle attribué :", role);

  user.password = await bcrypt.hash(user.password, 10);

  await db.user.create({
    data: {
      email: user.email,
      password: user.password,
      role,
    },
  
    
  
  });

  console.log("Utilisateur créé avec succès :", user.email);
}

export const registerAction = action(async (formData: FormData) => {
  'use server';
  try {
    console.log("Données reçues dans registerAction :", formData);
    await register(formData); // Appelle la fonction d'inscription
    console.log("Inscription réussie !");
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
  }
  throw redirect('/LoginPage'); // Redirige vers la page de connexion après l'inscription réussie
});


export async function login(form: FormData) {
  'use server';
  const { email, password } = userSchema.parse({
    email: form.get('email'),
    password: form.get('password'),
  });

  const record = await db.user.findUniqueOrThrow({ where: { email } });

  // Vérifier le mot de passe
  const loggedIn = await bcrypt.compare(password, record.password);
  if (!loggedIn) {
    throw new Error("Mot de passe incorrect");
  }
  console.log("loggedIN", loggedIn);

  const session = await getSession();
  console.log("Session avant mise à jour:", JSON.stringify(session.data));
  await session.update({ email });
  console.log("Session après mise à jour:", JSON.stringify(session.data));



  if (record.role === 'admin') {
    console.log("redirection Admin")

    throw redirect('/AdminPage');

  } else if (record.role === 'user') {
    console.log("redirection User")

    throw redirect('/UserPage');
  }
}

export const loginAction = action(login)



//les actions ne fonctionnent pas dans les routes API...
//Pour sa qu'on met les 2 types de fonctions avec et sans action  
