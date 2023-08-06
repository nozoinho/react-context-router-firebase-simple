import { useState } from "react";
import { register } from "../config/firebase";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";
import { useUserContext } from "../context/UserContext";

import { Formik } from "formik";
import * as Yup from "yup";

import { Link } from "react-router-dom";

import { Box } from "@mui/system";
import { Avatar, Button, TextField, Typography } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { LoadingButton } from "@mui/lab";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user } = useUserContext();
  useRedirectActiveUser(user, "/dashboard");

  /*const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("me diste submit");
   
  };*/

  const onSubmit = async (
    { email, password },
    { setSubmitting, setErrors, ResetForm }
  ) => {
    try {
      const credentialUser = await register({ email, password });
      console.log(credentialUser);
      ResetForm();
    } catch (error) {
      console.log(error.code);
      console.log(error.message);
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "Email ya existe" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email no válido").required("Email requerido"),
    password: Yup.string()
      .trim()
      .min(6, "Mínimo 6 caracteres")
      .required("Password requerido"),
  });

  return (
    <Box
      sx={{ mt: "1rem", maxWidth: "400px", mx: "auto", textAlign: "center" }}
    >
      <Avatar sx={{ mx: "auto", bgcolor: "#111" }}>
        <AddAPhotoIcon />
      </Avatar>

      <Typography variant="h5" component="h1">
        {/* significa que tendrá los estilos de un h5 pero se renderizará como h1 */}
        Register
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
          isSubmitting,
        }) => (
          <Box onSubmit={handleSubmit} component="form">
            <TextField
              type="text"
              placeholder="email@example.com"
              value={values.email}
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              id="email"
              label="Ingrese email"
              fullWidth
              sx={{ mb: 3 }}
              error={errors.email && touched.email}
              helperText={errors.email && touched.email && errors.email}
            />

            <TextField
              type="password"
              placeholder="123123"
              value={values.password}
              name="password"
              onChange={handleChange}
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

            <LoadingButton
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="contained"
              fullWidth
              sx={{ mb: 3 }}
            >
              Regístrate
            </LoadingButton>

            <Button fullWidth component={Link} to="/">
              ¿Ya tienes cuenta? Ingresa
            </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
