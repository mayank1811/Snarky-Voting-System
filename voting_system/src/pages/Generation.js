import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Styles from "../Stylesheets/Generation.module.css";

let constraints = require("../utils/constraint.json");

const Generation = () => {
  const [myName, setName] = useState("");
  const [myID, setID] = useState("");
  const [ocrData, setOCRData] = useState(null);
  const [hideMsg, setStatusmsg] = useState(true);
  const [UID, setUID] = useState(null);

  const [status, setStatus] = useState(null);
  const [proof, setProof] = useState();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleIDChange = (event) => {
    setID(event.target.value);
  };

  const handleOCRDataChange = (event) => {
    setOCRData(JSON.parse(event.target.value));
  };

  const hashData = (str) => {
    let hash = 0;
    let i = 0;
    let len = str.length;
    while (i < len) {
      hash = ((hash << 5) - hash + str.charCodeAt(i++)) << 0;
    }
    return hash;
  };

  const copyProof = () => {
    var copyText = document.getElementById("proof-text-area");
    navigator.clipboard.writeText(copyText.value);
    console.log("Copied");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatusmsg(true);
    setStatus(false);

    let input = {
      ...constraints,
      ...ocrData,
      myName: hashData(myName),
      myID: hashData(myID),
    };

    input.ocrName = hashData(input.ocrName);
    input.ocrID = hashData(input.ocrID);

    if (input.ocrID < 0) {
      input.ocrID *= -1;
    }

    if (input.myID < 0) {
      input.myID *= -1;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    };

    fetch("http://localhost:9000/getProof", requestOptions)
      .then((res) => res.json())
      .then((resBody) => {
        console.log(resBody);
        if (resBody.proof.verification === true) {
          setUID(resBody.proof.uniqueID);
          setProof(resBody.proof.proof);
          setStatus(true);
          setStatusmsg(false);
        } else {
          setUID(":-<<");
          setProof("Sorry, You are not eligible to vote :-(");
          setStatus(false);
          setStatusmsg(false);
        }
      });
  };

  return (
    <div>
      <h1 className={Styles.title}>Snarky Voting System</h1>
      <p className={Styles.para}>Enter Details and Generate Proof</p>
      <div className={`${Styles.formBody}`}>
        <img
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/330px-Emblem_of_India.svg.png'
          alt=''
          className={Styles.emblem}
        />
        <form className={Styles.form} onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label className='form-label'>Name </label>
            <input
              type='text'
              className='form-control'
              onChange={handleNameChange}
              required
            ></input>
          </div>
          <div className='mb-3'>
            <label className='form-label'>Aadhar Number </label>
            <input
              type='text'
              className='form-control'
              onChange={handleIDChange}
              required
            ></input>
          </div>
          <div className='mb-3'>
            <label className='form-label'>OCR Result </label>
            <input
              type='text'
              className='form-control'
              onChange={handleOCRDataChange}
              required
            ></input>
          </div>
          <input className='btn btn-outline-primary' type='submit'></input>
        </form>
      </div>
      <div className={Styles.proofBody}>
        {status === true && hideMsg === false && (
          <p className={Styles.goodStatus}>
            ✅ Yay!! Proof Generated Successfully
          </p>
        )}
        {status === false && hideMsg === false && (
          <p id='bad-status' className={Styles.badStatus}>
            ❌ Sorry!! You are not eligible to vote
          </p>
        )}

        {status === true && (
          <div className={Styles.formBody}>
            <div className={`mb-3 ${Styles.proofForm}`}>
              <label className='form-label'>Unique ID</label>
              <input
                type='text'
                className='form-control'
                readOnly
                value={UID}
              ></input>
              <div className={Styles.marginDiv}></div>
              <label className='form-label'>Proof</label>
              <textarea
                id='proof-text-area'
                className='form-control'
                rows='25'
                cols='40'
                value={JSON.stringify(proof)}
                readOnly
                style={{ padding: "15px" }}
              ></textarea>
            </div>
          </div>
        )}

        <h2 className={Styles.none}>Proof </h2>
        <textarea
          id='proof-text-area'
          className={Styles.none}
          rows='25'
          cols='50'
          value={JSON.stringify(proof)}
          readOnly
          style={{ padding: "20px" }}
        ></textarea>
        <button className={Styles.none} onClick={copyProof}>
          Copy Proof
        </button>
        <Link
          to='/'
          className={`btn btn-outline-secondary ${Styles.footerButton}`}
        >
          Home
        </Link>
        {status === true && (
          <Link
            className={`btn btn-outline-success ${Styles.footerButton}`}
            to='/verify'
          >
            Verify Proof
          </Link>
        )}
      </div>
    </div>
  );
};

export default Generation;
