import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch } from "react-redux";
import { updateContact } from "../../redux/contacts/operations";
import styles from "./EditContactForm.module.css";

export default function EditContactForm({ contact, onClose }) {
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    dispatch(updateContact({ id: contact.id, updatedData: values }));
    onClose();
  };

  return (
    <Formik
      initialValues={{ name: contact.name, number: contact.number }}
      onSubmit={handleSubmit}
    >
      <Form className={styles.form}>
        <label className={styles.label}>
          Name
          <Field name="name" className={styles.input} />
          <ErrorMessage name="name" component="div" className={styles.error} />
        </label>

        <label className={styles.label}>
          Number
          <Field name="number" className={styles.input} />
          <ErrorMessage
            name="number"
            component="div"
            className={styles.error}
          />
        </label>

        <div className={styles.buttons}>
          <button type="submit" className={styles.saveButton}>
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}
