import styles from "./styles.module.css";
import LatestNews from "../../components/LatestNews/LatestNews";
import NewsByFilters from "../../components/NewsByFilters/NewsByFilters";
import React from "react";

interface Props {
    isDarkMode: boolean;
}

const Main = () => {
    return (
        <main className={styles.main}>
        <LatestNews />

        <NewsByFilters/>
        </main>
    );
};

export default Main;