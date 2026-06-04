const express = require("express");
const router = express.Router();
const db = require("../models");
const SearchService = require("../services/SearchService");
const searchService = new SearchService(db);
const isAdmin = require("../middleware/isAdmin");
const isAuth = require("../middleware/isAuth");

router.post("/", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/search'
        #swagger.tags = ['Search']
        #swagger.description = "Search for products using string, brands and categories are searched by using id"
            #swagger.parameters['body'] = {
            in: 'body',
            description: 'Admin only endpoint.',
            required: true,
            schema: 
                { 
                    "name": "tv",
                    "brandId": 3,
                    "categoryId": 2
                }
            } 
    */
    try {
        const { name, brandId, categoryId } = req.body;
        const search = await searchService.searchProducts(name, brandId, categoryId);

        const records = search.length;

        return res.status(201).jsend.success({ statusCode: 201, count: records, result: search });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message })
    }

})

module.exports = router;