const snarkjs = require("snarkjs");

export const getVerificationKey = async () => {
  return await fetch("../../../proof/verification_key.json").then((res) => {
    return res.json();
  });
};

export const calculateProof = async (input) => {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    "../../../proof/circuit.wasm",
    "../../../proof/circuit_final.zkey"
  );

  console.log("Proof : ");
  console.log(JSON.stringify(proof, null, 1));
  return proof;
};
