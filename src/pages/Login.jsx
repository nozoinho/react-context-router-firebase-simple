import { useEffect, useState } from "react";
import { login } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";
import { Formik } from "formik";
import * as Yup from "yup"; // realiza validaciones de los campos

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // esta logica la tenemos el archivo useRedirectActiveUser.js en la carpeta hooks
  // para hacerla reutilizable
  /*const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);*/

  const { user } = useUserContext();
  useRedirectActiveUser(user, "/dashboard");

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("me diste submit");
  };*/
  /*el {handleSubmit} es parte de Formik
  luego de terminar sus validaciones, ingresa a {onSubmit} del Formik */

  const onSubmit = async (
    { email, password },
    { setSubmitting, setErrors, resetForm }
  ) => {
    console.log({ email, password });
    try {
      const credentialUser = await login({ email, password });
      console.log(credentialUser);
      resetForm();
    } catch (error) {
      console.log(error.code);
      console.log(error.message);
      if (error.code === "auth/user-not-found") {
        return setErrors({ email: "Usuario no registrado" }); // colocamos campo y mensaje a mostrar
      }
      if (error.code === "auth/wrong-password") {
        return setErrors({ password: "Password incorrecto" }); // colocamos campo y mensaje a mostrar
      }
    } finally {
      setSubmitting(false); // cuando finalice la operacion pase a false
      // esto permite la deshabilitacion del boton de login mientras se realice la validacion del usuario con Firebase
    }
  };

  // lo usual con Yup es hacer un esquema para las validaciones
  // no necesitamos escribir expresiones regulares o inventando validaciones
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email no válido").required("Email requerido"),
    password: Yup.string()
      .trim()
      .min(6, "Mínimo 6 caracteres")
      .required("Password requerido"),
  });

  return (
    <>
      <h1>Login</h1>

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {({
          values,
          handleSubmit,
          handleChange,
          errors,
          touched,
          handleBlur,
          isSubmitting, // va de la mano con setSubmitting
        }) => (
          //handleBlur detecta cuando el usuario ha escapado del input
          // realiza las validaciones sin presionar el boton login
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ingrese email"
              value={values.email}
              onChange={handleChange}
              name="email"
              onBlur={handleBlur}
            />
            {
              errors.email && touched.email && errors.email
              // si hay errores en el input email y está dentro del input email
              // emtonces pintará los errores de email,
              //en este caso se configuraron 2 errores: Email no válido e Email requerido
            }
            <input
              type="password"
              placeholder="Ingrese contraseña"
              value={values.password}
              onChange={handleChange}
              name="password"
              onBlur={handleBlur}
            />
            {errors.password && touched.password && errors.password}
            <button type="submit" disabled={isSubmitting}>
              Login
            </button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Login;
