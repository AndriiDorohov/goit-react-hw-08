import { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { string, object } from "yup";
import { register } from "../../redux/auth/operations";
import Button from "../Button/Button";
import styles from "./RegistrationForm.module.css";
import { FiEye, FiEyeOff } from "react-icons/fi";

const validationSchema = object({
  name: string().min(2, "Too short").required("Required"),
  email: string().email("Invalid email").required("Required"),
  password: string().min(7, "Minimum 7 characters").required("Required"),
});

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values, actions) => {
    dispatch(register(values));
    actions.resetForm();
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Register</h2>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Field
            type="text"
            name="name"
            placeholder="Name"
            className={styles.input}
          />
          <ErrorMessage name="name" component="div" className={styles.error} />

          <Field
            type="email"
            name="email"
            placeholder="Email"
            className={styles.input}
          />
          <ErrorMessage name="email" component="div" className={styles.error} />

          <div className={styles.passwordWrapper}>
            <Field
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={styles.input}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          <ErrorMessage
            name="password"
            component="div"
            className={styles.error}
          />

          <Button type="submit" variant="register">
            Register
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
