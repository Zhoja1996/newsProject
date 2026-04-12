import React from "react";
import styles from "./styles.module.css";

interface Props {
  children: React.ReactElement;
  isDarkMode?: boolean;
}

const Slider = ({ children, isDarkMode }: Props) => {
  return (
    <div className={`${styles.slider} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />
      {children}
    </div>
  );
};

export default Slider;