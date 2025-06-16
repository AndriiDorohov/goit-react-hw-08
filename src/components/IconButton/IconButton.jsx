import { motion } from "framer-motion";
import clsx from "clsx";
import styles from "./IconButton.module.css";

export default function IconButton({
  children,
  onClick,
  title,
  ariaLabel,
  variant = "default",
  ...props
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      className={clsx(styles.iconButton, styles[variant])}
      {...props}
    >
      {children}
    </motion.button>
  );
}
