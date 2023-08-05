import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(false);

  // cada vez que se cree el userContextProvider
  // firebase detecta si el usuario tiene sesion activa
  // devuelve el usuario y lo enviamos al useState
  //como el estado ya existe, se puede ingresar a la ruta protegida
  useEffect(() => {
    console.log("useEffect en acción");
    // metodo de firebase onAuthStateChanged pregunta a firebase
    //si el usuario ya hizo login en la aplicacion
    // recibe una función de callback que trae al objeto usuario
    // onAuthStateChanged no devuelve una promesa
    // por eso hay que simular una espera
    //  user tiene tres estados= false, null o user con información
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
      setUser(user);
    });
    // como onAuthStateChanged puede accidentalmente ejecutarse varias veces en la aplicacion
    // trae un destructor de ese observable, normalmente se le denomina "unsuscribe"
    // useEffect destruye el metodo cuando se coloca en el return
    return () => unsuscribe(); // tambien se puede escribir return unsuscribe;
  }, []);

  // false es el valor inicial y no demora
  if (user === false) return <p>Loading app...</p>;

  // el loading app es una espera hasta que se obtenga
  // uno de los otros valores de firebase, null o el objeto user

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
