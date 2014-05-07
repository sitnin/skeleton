var express = require('express');
var debug = require("debug")("app:index");
var router = express.Router();

router.get("/", function (req, res) {
    res.render("index.html");
});

module.exports = router;
