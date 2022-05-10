import React from "react";
import { Link } from "react-router-dom";
import styles from "../Stylesheets/Home.module.css";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <main>
        <h1 className={styles.welcome}>Snarky Voting System</h1>
        <p className={styles.welcomePara}>
          Zero-Knowledge Voting System using zk-SNARKS
        </p>
        <div className={styles.homeGrid}>
          <Link className={styles.homeCard} to='./getProof'>
            <h2>Generate Proof &rarr;</h2>
            <p>Generate Proof to cast your Vote</p>
          </Link>
          <Link className={styles.homeCard} to='./verify'>
            <h2>Verify Proof &rarr;</h2>
            <p>Verify your eligibility and cast Vote</p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Home;
