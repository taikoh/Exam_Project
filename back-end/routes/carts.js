const express = require("express");
const router = express.Router();
const db = require("../models");
const CartService = require("../services/CartService");
const cartService = new CartService(db);
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, async (req, res) => {
    /* 
        #swagger.path = '/cart'
        #swagger.tags = ['Cart']
        #swagger.description = "Cart information. "
    */
    try {
        const userId = req.user.id;
        const cart = await cartService.getCart(userId);

        return res.status(200).jsend.success({ statusCode: 200, message: "Cart retrieved.", result: cart });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
});

router.post("/", isAuth, async (req, res) => {
    /* 
        #swagger.path = '/cart'
        #swagger.tags = ['Cart']
        #swagger.description = "ADD item to cart"
            #swagger.parameters['body'] = {
            in: 'body',
            description: 'Cart information',
            required: true,
            schema: 
                { 
                    "product_id": 1 
                }
            } 
    */
    try {
        const { product_id } = req.body;
        const userId = req.user.id;
        const cart = await cartService.addToCart(userId, product_id);

        return res.status(201).jsend.success({ statusCode: 200, message: "Product added to cart.", result: cart });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message })
    }
})

router.post("/checkout/now", isAuth, async (req, res) => {
    /* 
        #swagger.path = '/cart/checkout/now'
        #swagger.tags = ['Cart']
        #swagger.description = "Cart information. "
    */
    try {
        const userId = req.user.id;
        const order = await cartService.checkoutCart(userId);

        return res.status(201).jsend.success({ statusCode: 201, message: "Checkout successful", result: order });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
});

module.exports = router;