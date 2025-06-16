import Lottie from "lottie-react";
import animationData from "../assets/animations/business-call-street-neon.json";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <div className={styles.pageWrapper}>
      <Lottie
        animationData={animationData}
        loop
        className={styles.lottieAnimation}
      />
    </div>
  );
}
