require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.1",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/f4s3H_5fMKHhrtO1e3zPmK-kQlTOyuCb",
      accounts: [
        "8363daa128648300e5724c285f2e71ea41735bbac0605a27eb10de23bab375d8",
      ],
    },
  },
};
