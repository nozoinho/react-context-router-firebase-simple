import { useEffect, useState } from "react";
import { login } from "../config/firebase";
import { Form, useNavigate, Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";

import { Formik } from "formik";

import * as Yup from "yup"; // realiza validaciones de los campos

import { Box } from "@mui/system";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { LoadingButton } from "@mui/lab";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user } = useUserContext();
  useRedirectActiveUser(user, "/dashboard");

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
    // prop sx permite escribir css directamente
    <Box
      sx={{ mt: "1rem", maxWidth: "400px", mx: "auto", textAlign: "center" }}
    >
      <Avatar sx={{ mx: "auto", bgcolor: "#111" }}>
        <AddAPhotoIcon />
      </Avatar>

      <Typography variant="h5" component="h1">
        {/* significa que tendrá los estilos de un h5 pero se renderizará como h1 */}
        Login
      </Typography>

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
          <Box onSubmit={handleSubmit} sx={{ mt: 1 }} component="form">
            {/* reemplazamos form por Box 
            el prop component de Box indica como se renderizará y comportará el componente
            en este caso mantenemos el form*/}

            <TextField
              type="text"
              placeholder="Ingrese email"
              value={values.email}
              onChange={handleChange}
              name="email"
              onBlur={handleBlur}
              // se agregan estos props a diferencia de input
              id="email"
              label="Ingrese Email"
              fullWidth
              sx={{ mb: 3 }}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email && errors.email}
            />
            {/* <input
              type="text"
              placeholder="email@example.com"
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
            } */}

            <TextField
              type="password"
              placeholder="123123"
              value={values.password}
              onChange={handleChange}
              name="password"
              onBlur={handleBlur}
              id="password"
              label="Ingrese contraseña"
              fullWidth
              sx={{ mb: 3 }}
              error={errors.password && touched.password}
              helperText={
                errors.password && touched.password && errors.password
              }
            />
            {/* <input
              type="password"
              placeholder="Ingrese contraseña"
              value={values.password}
              onChange={handleChange}
              name="password"
              onBlur={handleBlur}
            />
            {errors.password && touched.password && errors.password} */}

            <LoadingButton
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting} // produce efecto de carga, en este caso cuando este procesando el submit
              variant="contained"
              fullWidth
              sx={{ mb: 3 }}
            >
              Acceder
            </LoadingButton>

            {/* <button type="submit" disabled={isSubmitting}>
              Login
            </button> */}

            <Button
              fullWidth
              component={Link} // component no necesariamente puede ser una etiqueta semantica
              // en este caso usamos el componente Link de React Router
              to="/register" // tambien podemos usar los props de Link
            >
              ¿No tienes cuenta? Regístrate
            </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
