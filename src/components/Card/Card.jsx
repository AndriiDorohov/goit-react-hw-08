import clsx from "clsx";
import styles from "./Card.module.css";

export default function Card({ children, className = "", ...props }) {
  return (
    <div className={clsx(styles.card, className)} {...props}>
      {children}
    </div>
  );
}
