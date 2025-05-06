import { createAsync } from "@solidjs/router";
import { createResource } from "solid-js";
import { getUser } from "~/lib/Login";

export default function HeaderMail() {
  const user = createAsync(() => getUser()); // Utilisation de createResource pour rendre le composant réactif

  return (
    <header style={{ position: "absolute", top: 0, left: 0, padding: "10px" }}>
      {user() ? (
        <p>Connecté en tant que : {user()!.email}</p>
      ) : (
        <p>Non connecté</p>
      )}
    </header>
  );
}