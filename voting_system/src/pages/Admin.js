import React, { useContext, useEffect, useState } from "react";
import styles from "../Stylesheets/Admin.module.css";
import Error from "./Error";
import { VotingContext } from "../context/VotingContext";

import { useLocation, useNavigate } from "react-router-dom";

const Admin = (props) => {
  const { getEthereumContract, connectedAccount, checkAdmin } =
    useContext(VotingContext);

  const navigate = useNavigate();

  const contract = getEthereumContract();

  const [admin, setAdmin] = useState(0);
  const [status, setStatus] = useState(0);
  const startClickHandler = async () => {
    const contract = getEthereumContract();
    contract.startElection();
    let status = 0;
    while (status !== 1) {
      status = await contract.getStatus();
    }
    console.log("abc--->", status);
    setStatus(status);
  };

  const endClickHandler = async () => {
    const contract = getEthereumContract();
    contract.endElection();
    let status = 1;
    while (status !== 0) {
      status = await contract.getStatus();
    }
    console.log("def--->", status);
    setStatus(status);
  };

  const addPartyHandler = () => {
    navigate("/party", { state: { UID } });
  };

  const backClickHandler = () => {
    navigate("/vote", { state: { UID: UID } });
  };

  useEffect(() => {
    const isAdmin = async () => {
      if (connectedAccount) {
        const status = await checkAdmin();
        setAdmin(status);
        console.log("yyy", status);
      }
    };
    isAdmin();
  }, [checkAdmin, connectedAccount]);

  useEffect(() => {
    const getStatus = async () => {
      if (connectedAccount) {
        const status = await contract.getStatus();
        console.log("xxx", status);
        setStatus(status);
      }
    };
    getStatus();
  }, [status, contract, connectedAccount]);

  const location = useLocation();
  if (location.state === null || location.state.UID === "") {
    return <Error />;
  }

  const UID = location.state.UID;

  if (admin === 0) return null;

  if (admin === 2) {
    return <Error />;
  }

  return (
    <div className={styles.homeContainer}>
      <main>
        <h1 className={styles.welcome}>Snarky Voting System</h1>
        <p className={styles.welcomePara}>Welcome to Admin Section</p>
        <div className={styles.homeGrid}>
          {status === 0 && (
            <button
              className={styles.homeCard}
              to='/party'
              onClick={addPartyHandler}
            >
              <h2>Add Parties</h2>
            </button>
          )}
          {status === 0 && (
            <button className={styles.homeCard} onClick={startClickHandler}>
              <h2>Start Election</h2>
            </button>
          )}
          {status === 1 && (
            <button
              className={styles.homeCard}
              to='./verify'
              onClick={endClickHandler}
            >
              <h2>End Election</h2>
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
