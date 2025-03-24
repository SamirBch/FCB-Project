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
    'use server'
    const user = userSchema.parse({
      email: form.get('email'),
      password: form.get('password'),
    })
    user.password = await bcrypt.hash(user.password, 10)

    await db.user.create({ data: user })   
  }


export async function login(form: FormData) : Promise<boolean> {
    'use server';
    const { email, password } = userSchema.parse({
      email: form.get('email'),
      password: form.get('password'),
    });
  
    try {
      const record = await db.user.findUniqueOrThrow({ where: { email }});
      const loggedIn = await bcrypt.compare(password, record.password);
      console.log("loggedIN", loggedIn);
      if (loggedIn) {
  

        const session = await getSession();

        await session.update({ email });
  
        return true; // ✅ Connexion réussie
      }
    } catch {
      return false; // ❌ Connexion échouée
    }
    return false; // ❌ Connexion échouée
  }
  
  
  
  
  