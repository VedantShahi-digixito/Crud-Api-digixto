"use strict";

const app = require("express");

const router = app.Router();

router.get("/test", (req, res) => {
    console.log('----------------------------------');
    console.log('***********',req.body);
});

module.exports = router;
