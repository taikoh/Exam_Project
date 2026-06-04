const express = require("express");
const router = express.Router();
const db = require("../models");
const CategoryService = require("../services/CategoryService");
const categoryService = new CategoryService(db);
const isAdmin = require("../middleware/isAdmin");
const isAuth = require("../middleware/isAuth");
const tryAuth = require("../middleware/tryAuth")


// GET all categories if admin, GET all categories that are not deleted if user.
router.get("/", tryAuth, async (req, res) => {
    /* 
        #swagger.path = '/categories'
        #swagger.tags = ['Categories']
        #swagger.description = "Category information."
    */
    try { 
        const adminUser = req.user?.role === "Admin";
        const categories = await categoryService.getAllCategories(adminUser);

        if (categories.length <= 0) {
            return res.status(404).jsend.error({ statusCode: 404, message: "No categories found", result: categories })
        }

        return  res.status(200).jsend.success({ statusCode: 200, result: categories });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
});

// GET category by id if admin, GET category by id that are not deleted if user.
router.get("/:id", tryAuth, async (req, res) => {
    /* 
        #swagger.path = '/categories/{id}'
        #swagger.tags = ['Categories']
        #swagger.description = "Category information."
    */
    try {

        const { id }= req.params;
        const adminUser = req.user?.role === "Admin";
        const category = await categoryService.getCategoryById(id, adminUser);

        if (category.length <= 0) {
            return res.status(404).jsend.error({ statusCode: 404, message: "No category found", result: category })
        }

        return res.status(200).jsend.success({ statusCode: 200, message: "Category found", result: category });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message })
    }
})

// CREATE category
router.post("/", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/categories'
        #swagger.tags = ['Categories']
        #swagger.description = "CREATE category if admin"
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Category information. Admin only endpoint.',
            required: true,
            schema: { "name": "TV" }
            } 
    */
    try {
        const { name } = req.body;

        if (!name) {
            throw new Error("Name is required")
        }

        const category = await categoryService.createCategory(name);

        return res.status(201).jsend.success({ statusCode: 201, message: "Category created", result: category });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// UPDATE category
router.put("/:id", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/categories/{id}'
        #swagger.tags = ['Categories']
        #swagger.description = "UPDATE category if admin" 
		#swagger.parameters["body"] = {
			in: "body",
			description: "Category information. Admin only endpoint.",
			required: true,
			schema: { "name": "New category name" }
		} 
    */
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            throw new Error("Name is required")
        }

        const updatedCategory = await categoryService.updateCategory(id, name);

        return res.status(200).jsend.success({ statusCode: 200, message: "Category has been updated", result: updatedCategory });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// DELETE category
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/categories/{id}'
        #swagger.tags = ['Categories']
        #swagger.description = "DELETE category if admin (soft delete)"
    */
    try {
        const { id } = req.params;
        const deletedCategory = await categoryService.deleteCategory(id);

        return res.status(200).jsend.success({ statusCode: 200, message: "Category deleted", result: deletedCategory });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// RESTORE category
router.put("/:id/restore", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/categories/{id}/restore'
        #swagger.tags = ['Categories']
        #swagger.description = "RESTORE category if soft deleted"
    */
    try {
        const { id } = req.params;
        const restoreCategory = await categoryService.restoreDeletedCategory(id);

        return res.status(200).jsend.success({ statusCode: 200, message: "Category restored", result: restoreCategory });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

module.exports = router;