import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Error from "./Error";

import { useLocation } from "react-router-dom";
import { VotingContext } from "../context/VotingContext";

import Styles from "../Stylesheets/Generation.module.css";

const Party = () => {
  const { getEthereumContract, connectedAccount, checkAdmin } =
    useContext(VotingContext);
  const [admin, setAdmin] = useState(0);
  const [partyName, setPartyName] = useState("");
  const [status, setStatus] = useState(-1);

  const contract = getEthereumContract();
  const location = useLocation();

  const partyNameChangeHandler = (event) => {
    setPartyName(event.target.value);
  };

  const addPartyHandler = async (event) => {
    event.preventDefault();
    await contract.addParties(partyName);
    const form = document.getElementById("party_form");
    form.reset();
  };

  useEffect(() => {
    const isAdmin = async () => {
      const status = await checkAdmin();
      setAdmin(status);
      console.log("yyy", status);
    };
    isAdmin();
  }, [checkAdmin]);

  useEffect(() => {
    const getStatus = async () => {
      if (connectedAccount) {
        const status = await contract.getStatus();
        setStatus(status);
      }
    };
    getStatus();
  });

  if (admin === 0) return null;

  if (admin === 2) {
    return (
      <Error msg='Sorry you are not Authorised to visit this page'></Error>
    );
  }

  if (location.state === null || location.state.UID === "") {
    return <Error />;
  }

  if (status === -1) return null;
  if (status !== 0) return <Error></Error>;

  return (
    <div>
      <h1 className={Styles.title}>Snarky Voting System</h1>
      <p className={Styles.para}>Add New Parties</p>
      <div className={`${Styles.formBody}`}>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/330px-Emblem_of_India.svg.png'
          alt=''
          className={Styles.emblem}
        />
        <form
          className={Styles.form}
          id='party_form'
          onSubmit={addPartyHandler}
        >
          <div className='mb-3'>
            <label className='form-label'>Name </label>
            <input
              type='text'
              className='form-control'
              required
              onChange={partyNameChangeHandler}
            ></input>
          </div>
          <input className='btn btn-outline-primary' type='submit'></input>
        </form>
      </div>
    </div>
  );
};

export default Party;
