const express = require("express");
const router = express.Router();
const db = require("../models");
const ProductService = require("../services/ProductService");
const productService = new ProductService(db);
const isAdmin = require("../middleware/isAdmin");
const isAuth = require("../middleware/isAuth");
const tryAuth = require("../middleware/tryAuth")
const validateProductUpdate = require("../middleware/validateProductUpdate");

// GET all products if admin, GET all products that are not deleted if user.
router.get("/", tryAuth, async (req, res) => {
    /* 
        #swagger.path = '/products'
        #swagger.tags = ['Products']
        #swagger.description = "Product information."
    */
    try {

        const adminUser = req.user?.role === "Admin";
        const products = await productService.getAllProducts(adminUser);

        if (products.length <= 0) {
            return res.status(404).jsend.fail({ statusCode: 404, message: "No products found", result: products });
        }

        return res.status(200).jsend.success({ statusCode: 200, message: "Products found", result: products });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
});

// GET product by id if admin, GET product by id that are not deleted if user.
router.get("/:id", tryAuth, async (req,res) => {
    /* 
        #swagger.path = '/products/{id}'
        #swagger.tags = ['Products']
        #swagger.description = "Product information. "
    */
    try {

        const { id } = req.params;
        const adminUser = req.user?.role === "Admin";
        const product = await productService.getProductById(id, adminUser);

        if (product.length <= 0) {
            return res.status(404).jsend.fail({ statusCode: 404, message: "No product found", result: products });
        }

        return res.status(200).jsend.success({ statusCode: 200, message: "Product found", result: product });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// CREATE product
router.post("/", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/products'
        #swagger.tags = ['Products']
        #swagger.description = "CREATE product if admin"
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Product information. Admin only endpoint.',
            required: true,
            schema: { $ref: "#/definitions/Products" }
            } 
    */
    try {
        const { name, description, price, quantity, imgurl, date_added, category_id, brand_id } = req.body;

        const product = await productService.createProduct({ name, description, price, quantity, imgurl, date_added, category_id, brand_id });

        return res.status(201).jsend.success({ statusCode: 201, message: "Product created", result: product });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// UPDATE product
router.put("/:id", isAuth, isAdmin, validateProductUpdate, async (req, res) => {
    /* 
        #swagger.path = '/products/{id}'
        #swagger.tags = ['Products']
        #swagger.description = "UPDATE product if admin" 
		#swagger.parameters["body"] = {
			in: "body",
			description: "Product information. Admin only endpoint.",
			required: true,
			schema: { "name": "Something else" }
		} 
    */
    try { 
        const { id } = req.params;
        const { name, description, price, quantity, imgurl } = req.body;

        const updatedProduct = await productService.updateProduct(id, name, description, price, quantity, imgurl);

        return res.status(200).jsend.success({ statusCode: 200, message: "Product updated", result: updatedProduct });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// DELETE product
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/products/{id}'
        #swagger.tags = ['Products']
        #swagger.description = "DELETE product if admin (soft delete)"
    */
    try {
        const { id } = req.params;

        const deletedProduct = await productService.deleteProduct(id);

        return res.status(200).jsend.success({ statusCode: 200, message: "Product removed", result: deletedProduct });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// RESTORE product
router.put("/:id/restore", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/products/{id}/restore'
        #swagger.tags = ['Products']
        #swagger.description = "RESTORE product if soft deleted"
    */
    try {
        const { id } = req.params;

        const restoredProduct = await productService.restoreDeletedProduct(id);

        return res.status(200).jsend.success({ statusCode: 200, message: "Product restored", result: restoredProduct });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

module.exports = router;