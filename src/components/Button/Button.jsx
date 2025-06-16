import clsx from "clsx";
import styles from "./Button.module.css";

export default function Button({
  children,
  onClick,
  type = "button",
  variant,
  icon = false,
  title,
  size = "md",
  ...props
}) {
  const autoVariant = !variant && icon ? "icon" : "default";
  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        styles.button,
        styles[variant || autoVariant],
        icon && styles.iconButton,
        styles[size],
      )}
      title={title}
      {...props}
    >
      {children}
    </button>
  );
}
