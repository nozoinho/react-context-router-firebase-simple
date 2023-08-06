import { useState } from "react";
import { register } from "../config/firebase";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";
import { useUserContext } from "../context/UserContext";
import { Formik } from "formik";
import * as Yup from "yup";

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
    <>
      <h1>Register</h1>
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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ingrese email"
              value={values.email}
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email && errors.email}
            <input
              type="password"
              placeholder="Ingrese contraseña"
              value={values.password}
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password && errors.password}
            <button type="submit" disabled={isSubmitting}>
              Register
            </button>
          </form>
        )}
      </Formik>
    </>
  );
};

export default Register;
