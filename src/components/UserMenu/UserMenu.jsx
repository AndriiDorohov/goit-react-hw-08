import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import { logout } from "../../redux/auth/operations";
import Button from "../Button/Button";
import styles from "./UserMenu.module.css";

export default function UserMenu() {
  const dispatch = useDispatch();
  const { email } = useSelector(selectUser);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className={styles.userMenu}>
      <p className={styles.email}>{email}</p>
      <Button variant="link" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
