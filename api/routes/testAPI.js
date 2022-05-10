var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.send("APU is working fine");
});

module.exports = router;
