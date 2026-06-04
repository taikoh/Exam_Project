const express = require("express");
const router = express.Router();
const db = require("../models");
const InitService = require("../services/InitService");
const initService = new InitService(db);

// Initializes database from /init endpoint.
router.post("/", async (req, res) => {
    /* 
        #swagger.path = '/init'
        #swagger.tags = ['Initialization']
        #swagger.description = "Initializes the database."
    */
    try {
        const result = await initService.initializeDB();

        return res.status(201).jsend.success({ statusCode: 201, result });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
});

module.exports = router;