import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-hot-toast";
import { addContact } from "../../redux/contacts/operations";
import { contactSchema } from "../../utils/contactSchema";
import Button from "../Button/Button";
import styles from "./ContactForm.module.css";

export default function ContactForm() {
  const dispatch = useDispatch();

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await dispatch(
        addContact({ name: values.name, number: values.number }),
      ).unwrap();
      toast.success("Contact added successfully!");
      resetForm();
    } catch {
      toast.error("Failed to add contact.");
    }
  };

  return (
    <div className="card">
      <Formik
        initialValues={{ name: "", number: "" }}
        validationSchema={contactSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className={styles.form}>
            <label className={styles.label}>
              Name
              <Field
                className={styles.input}
                name="name"
                placeholder="Max Payn"
              />
              <ErrorMessage
                name="name"
                component="div"
                className={styles.error}
              />
            </label>

            <label className={styles.label}>
              Number
              <Field
                className={styles.input}
                name="number"
                placeholder="+11 123 456 789"
              />
              <ErrorMessage
                name="number"
                component="div"
                className={styles.error}
              />
            </label>

            <Button type="submit" variant="formSubmit">
              Add Contact
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
