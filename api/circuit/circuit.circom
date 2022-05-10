include "./circuits/comparators.circom"
include "./circuits/gates.circom"

template CreateProof() {
  signal input age;
  signal private input ocrName;
  signal private input ocrID;
  signal private input myAge;
  signal private input myName;
  signal input myID;

  signal output c;

  component NameVerifier = IsEqual();
  component IdVerifier = IsEqual();
  component AgeVerifier = GreaterEqThan(8);

  NameVerifier.in[0] <== ocrName;
  NameVerifier.in[1] <== myName;

  IdVerifier.in[0] <== ocrID;
  IdVerifier.in[1] <== myID;

  AgeVerifier.in[0] <== myAge;
  AgeVerifier.in[1] <== age;

  if(AgeVerifier.out == 1){
    if(NameVerifier.out == 1){
      if(IdVerifier.out == 1){
        c <-- 1;
      }
    }
  }
  c === 1;
}

component main = CreateProof();