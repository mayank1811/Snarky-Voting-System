import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const VotingContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const votingContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return votingContract;
};

export const VotingProvider = ({ children }) => {
  const [connectedAccount, setConnectedAccount] = useState();
  const [votingStatus, setVotingStatus] = useState(0);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please Install Metamask");
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length) {
        setConnectedAccount(accounts[0]);
      } else {
        console.log("No accounts found");
      }

      console.log(accounts);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please Install Metamask");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectedAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkAdmin = async () => {
    const contract = getEthereumContract();
    const isAdmin = await contract.checkAdmin();
    if (isAdmin === true) return 1;
    return 2;
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <VotingContext.Provider
      value={{
        connectWallet,
        connectedAccount,
        checkAdmin,
        getEthereumContract,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
