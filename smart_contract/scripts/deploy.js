const main = async () => {
  const VotingContract = await hre.ethers.getContractFactory("Voting");
  const votingContract = await VotingContract.deploy();

  await votingContract.deployed();

  console.log("Contract deployed to:", votingContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
