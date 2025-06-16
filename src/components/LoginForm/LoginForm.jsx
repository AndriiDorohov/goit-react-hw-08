import { Formik, Form, Field, ErrorMessage } from "formik";
import { string, object } from "yup";
import { useDispatch } from "react-redux";
import { login } from "../../redux/auth/operations";
import toast from "react-hot-toast";
import Button from "../Button/Button";
import styles from "./LoginForm.module.css";

const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string().min(7, "Min 7 characters").required("Required"),
});

export default function LoginForm() {
  const dispatch = useDispatch();

  const handleSubmit = async (values, actions) => {
    try {
      await dispatch(login(values)).unwrap();
      toast.success("Login successful!");
      actions.resetForm();
    } catch (error) {
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Log In</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        <Form>
          <Field
            className={styles.input}
            name="email"
            type="email"
            placeholder="Email"
          />
          <ErrorMessage name="email" component="div" className={styles.error} />

          <Field
            className={styles.input}
            name="password"
            type="password"
            placeholder="Password"
          />
          <ErrorMessage
            name="password"
            component="div"
            className={styles.error}
          />

          <Button type="submit" variant="login">
            Log In
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
