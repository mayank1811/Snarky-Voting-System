import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import { VotingContext } from "../context/VotingContext";

import Styles from "../Stylesheets/Result.module.css";

import Error from "./Error";

const Result = (props) => {
  const { getEthereumContract, connectedAccount } = useContext(VotingContext);
  const [parties, setParties] = useState([]);
  const [status, setStatus] = useState(-1);

  const contract = getEthereumContract();
  const navigate = useNavigate();

  const backClickHandler = () => {
    navigate("/vote", { state: { UID: UID } });
  };

  useEffect(() => {
    const getParties = async () => {
      if (connectedAccount) {
        const parties = await contract.getParties();
        setParties(parties);
      }
    };
    getParties();
  });

  useEffect(() => {
    const getStatus = async () => {
      if (connectedAccount) {
        const status = await contract.getStatus();
        setStatus(status);
      }
    };
    getStatus();
  });

  const location = useLocation();
  if (location.state === null || location.state.UID === "") {
    return <Error />;
  }

  const UID = location.state.UID;

  if (status === -1) {
    return null;
  }

  if (status === 1) {
    return <Error />;
  }

  return (
    <div>
      <h1 className={Styles.title}>Snarky Voting System</h1>
      <p className={Styles.para}>
        Welcome to Ethereum Blockchain based Voting System
      </p>
      {status === 0 && (
        <div className={Styles.partyBody}>
          <div className={`row ${Styles.parties}`}>
            {parties.map((party) => {
              return (
                <div
                  className={`col-lg-3 col-md-4 col-sm-12 box card ${Styles.party}`}
                >
                  <h4 className={Styles.partyname}>{party.name}</h4>
                  <button
                    className={`btn btn-sm btn-primary ${Styles.votebtn}`}
                  >
                    {parseInt(party.voteCount._hex.toString(16), 16)}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <button
        className={`btn btn-outline-success ${Styles.footerButton}`}
        onClick={backClickHandler}
      >
        Back
      </button>
    </div>
  );
};

export default Result;
