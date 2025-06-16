import RegistrationForm from "../components/RegistrationForm/RegistrationForm";
import styles from "./RegistrationPage.module.css";

export default function RegistrationPage() {
  return (
    <div className={styles.pageWrapper}>
      <RegistrationForm />
    </div>
  );
}
