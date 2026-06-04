const express = require("express");
const router = express.Router();
const db = require("../models");
const OrderService = require("../services/OrderService");
const orderService = new OrderService(db);
const isAdmin = require("../middleware/isAdmin");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, async (req, res) => {
    /* 
        #swagger.path = '/orders'
        #swagger.tags = ['Orders']
        #swagger.description = "Order information."
    */
    try {
        const userId = req.user.id;
        const adminUser = req.user?.role === "Admin"

        const orders = await orderService.getOrders(userId, adminUser)

        return res.status(200).jsend.success({ statusCode: 200, message: "Orders retrieved.", result: orders });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
});

router.get("/:id", isAuth, async (req, res) => {
    /* 
        #swagger.path = '/orders/{id}'
        #swagger.tags = ['Orders']
        #swagger.description = "Order information."
    */
    try {
        const userId = req.user.id;
        const orderId = req.params.id;
        const adminUser = req.user?.role === "Admin"

        const order = await orderService.getOrderById(orderId, userId, adminUser)

        return res.status(200).jsend.success({ statusCode: 200, message: "Order retrieved.", result: order });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
});

router.put("/:id", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/orders/{id}/'
        #swagger.tags = ['Orders']
        #swagger.description = "UPDATE order status"
		#swagger.parameters["body"] = {
			in: "body",
			description: "Order information. Admin only endpoint.",
			required: true,
			schema: 
            { 
                "status": "In Progress"
            }
		} 
    */
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        const updateOrder = await orderService.updateStatus(orderId, status);

        return res.status(200).jsend.success({ statusCode: 200, message: "Order status updated", result: updateOrder });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
});

module.exports = router;
