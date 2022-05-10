import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SiEthereum } from "react-icons/si";
import { BsInfoCircle } from "react-icons/bs";
import "bootstrap/dist/css/bootstrap.min.css";

import { VotingContext } from "../context/VotingContext";

import { Link } from "react-router-dom";

import Styles from "../Stylesheets/Vote.module.css";

import Error from "./Error";

const Vote = (props) => {
  const { getEthereumContract, connectWallet, connectedAccount } =
    useContext(VotingContext);
  const [isAdmin, setAdmin] = useState(false);
  const [parties, setParties] = useState([]);
  const [status, setStatus] = useState(-1);

  const contract = getEthereumContract();

  const navigate = useNavigate();

  const checkAdmin = async () => {
    const contract = getEthereumContract();
    const admin = await contract.checkAdmin();

    setAdmin(admin);
  };

  const shortenAddress = (address) => {
    if (address === null) return null;
    return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`;
  };

  const handleVoteSubmit = async (uid, pid) => {
    try {
      if (connectedAccount) {
        const id = parseInt(pid._hex.toString(16), 16) - 1;
        console.log(id);
        const status = await contract.vote(pid, id);
        console.log(status);
      } else {
        alert("Please Connect to a Ethereum Wallet and then proceed to vote.");
      }
    } catch (error) {
      alert(error.error.message);
    }
  };

  const adminClickHandler = async () => {
    const contract = getEthereumContract();
    const stat = await contract.getStatus();
    navigate("/admin", { state: { stat: stat, UID: UID } });
  };

  const resultHandler = () => {
    navigate("/result", { state: { UID: UID } });
  };

  useEffect(() => {
    checkAdmin();
  });

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

  return (
    <div>
      <h1 className={Styles.title}>Snarky Voting System</h1>
      <p className={Styles.para}>
        Welcome to Ethereum Blockchain based Voting System
      </p>
      <div className={Styles.walletBody}>
        <div
          className={`p-3 flex justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full ${Styles.ethCard} ${Styles.whiteGlassmorphism}`}
        >
          <div className='flex justify-between flex-col w-full h-full'>
            <div className='flex justify-between items-start'>
              <div className='w-10 h-10 rounded-full border-2 border-white flex justify-center items-center'>
                <SiEthereum fontSize={21} color='#fff'></SiEthereum>
              </div>
              <BsInfoCircle fontSize={17} color='#fff' />
            </div>
            <div>
              {connectedAccount && (
                <p
                  className={`text-white font-light text-sm ${Styles.address}`}
                >
                  {shortenAddress(connectedAccount)}
                </p>
              )}
              <p
                className={`text-white font-semibold text-lg mt-1 ${Styles.eth}`}
              >
                Ethereum
              </p>
            </div>
          </div>
        </div>
        {!connectedAccount && (
          <button
            className={`btn btn-outline-danger ${Styles.walletbtn}`}
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
      {status === 0 && (
        <div className={Styles.resultBtn}>
          <button onClick={resultHandler} className='btn btn-lg btn-danger'>
            View Result
          </button>
        </div>
      )}
      {status === 1 && (
        <div className={Styles.partyBody}>
          <div className={`row ${Styles.parties}`}>
            {parties.map((party) => {
              return (
                <div
                  className={`col-lg-3 col-md-4 col-sm-12 box card ${Styles.party}`}
                >
                  <h4 className={Styles.partyname}>{party.name}</h4>
                  <button
                    onClick={() => {
                      console.log(party.id);
                      handleVoteSubmit(UID, party.id);
                    }}
                    className={`btn btn-sm btn-primary ${Styles.votebtn}`}
                  >
                    Vote
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isAdmin === true && (
        <button
          className={`btn btn-outline-success ${Styles.footerButton}`}
          to='/admin'
          state={{ UID }}
          onClick={adminClickHandler}
        >
          Admin
        </button>
      )}
    </div>
  );
};

export default Vote;
