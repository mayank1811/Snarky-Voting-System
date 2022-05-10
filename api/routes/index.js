let express = require("express");
let router = express.Router();
let fs = require("fs");
let snarkjs = require("snarkjs");

async function genProof(inputData) {
  console.log(inputData);
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    inputData,
    "./circuit/circuit.wasm",
    "./circuit/circuit_final.zkey"
  );
  console.log(typeof proof);
  const res = await checkProof(proof, publicSignals);

  return {
    uniqueID: inputData.ocrID,
    proof: proof,
    publicSignals: publicSignals,
    verification: res,
  };
}

const getVerificationKey = async () => {
  verificationKey = await JSON.parse(
    fs.readFileSync("./circuit/verification_key.json")
  );
  return verificationKey;
};

const checkProof = async (proof, publicSignals) => {
  const vKey = await getVerificationKey();

  const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);
  return res;
};

const getPublicSignals = () => {
  const constraints = JSON.parse(
    fs.readFileSync("../voting-system/src/utils/constraint.json")
  );
  const age = constraints.age;

  const publicSignals = ["1", age.toString()];

  return publicSignals;
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

// Generate proof
router.post("/getProof", async (req, res, next) => {
  const input = req.body;

  let proof = await genProof(req.body);

  return res.status(200).json({
    msg: "success",
    proof: proof,
  });
});

// Verify proof
router.post("/verifyProof", async (req, res, next) => {
  const proof = req.body.proof;
  const id = req.body.id;

  console.log(req.body);

  let signals = getPublicSignals();

  const publicSignals = [...signals, id];

  const result = await checkProof(proof, publicSignals);
  return res.status(200).json({
    msg: "success",
    result: result,
  });
});

module.exports = router;
