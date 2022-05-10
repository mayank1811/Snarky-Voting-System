import React, { useState } from "react";
import { Link } from "react-router-dom";
import Styles from "../Stylesheets/Verification.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Verification = () => {
  const [uniqueID, setUID] = useState("");
  const [proof, setProof] = useState("");

  const [status, setStatus] = useState(false);
  const [hideMsg, sethideMsg] = useState(true);

  const handleIDChange = (event) => {
    setUID(event.target.value);
  };

  const handleProofChange = (event) => {
    setProof(event.target.value);
  };

  const handleProofSubmit = (event) => {
    event.preventDefault();

    let inputProof = JSON.parse(proof);
    setStatus(false);
    sethideMsg(true);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof: inputProof, id: uniqueID }),
    };

    console.log(requestOptions.body);

    fetch("http://localhost:9000/verifyProof", requestOptions)
      .then((res) => res.json())
      .then((res) => {
        sethideMsg(false);
        setStatus(res.result);
        console.log(status);
      });
  };

  return (
    <div style={{ marginLeft: "20px" }}>
      <h1 className={Styles.title}>Snarky Voting System</h1>
      <p className={Styles.para}>Enter Details and Verify Proof</p>
      <div className={Styles.formBody}>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/330px-Emblem_of_India.svg.png'
          alt=''
          className={Styles.emblem}
        />
        <form className={Styles.form} onSubmit={handleProofSubmit}>
          <div className='mb-3'>
            <label className='form-label'>Unique ID </label>
            <input
              className='form-control'
              type='text'
              onChange={handleIDChange}
              required
            ></input>
          </div>
          <div className='mb-3'>
            <label className='form-label'>Proof --> </label>
            <textarea
              className='form-control'
              id='verify-proof-textarea'
              rows='10'
              cols='50'
              style={{ padding: "15px" }}
              onChange={handleProofChange}
              required
            ></textarea>
          </div>
          <input
            className='btn btn-outline-primary'
            type='submit'
            value='Submit'
          ></input>
        </form>
      </div>

      {status === true && hideMsg === false && (
        <p className={Styles.goodStatus}>
          ✅ Yay!! Proof Verified Successfully
        </p>
      )}
      {status === false && hideMsg === false && (
        <p id='bad-status' className={Styles.badStatus}>
          ❌ Sorry!! Invalid Proof
        </p>
      )}

      <Link
        to='/'
        className={`btn btn-outline-secondary ${Styles.footerButton} ${Styles.verifyBTN}`}
      >
        Home
      </Link>
      {status === false && (
        <Link
          to='/getProof'
          className={`btn btn-outline-success ${Styles.footerButton}`}
        >
          Generate Proof
        </Link>
      )}
      {status === true && (
        <Link
          to='/vote'
          className={`btn btn-outline-danger ${Styles.footerButton} ${Styles.verifyBTN}`}
          state={{ UID: uniqueID }}
        >
          Continue to Vote
        </Link>
      )}
    </div>
  );
};

export default Verification;
