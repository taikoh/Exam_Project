const express = require("express");
const router = express.Router();
const db = require("../models");
const BrandService = require("../services/BrandService");
const brandService = new BrandService(db);
const isAdmin = require("../middleware/isAdmin");
const isAuth = require("../middleware/isAuth");
const tryAuth = require("../middleware/tryAuth")


// GET all brands if admin, GET all brands that are not deleted if user.
router.get("/", tryAuth, async (req, res) => {
    /* 
        #swagger.path = '/brands'
        #swagger.tags = ['Brands']
        #swagger.description = "Brand information."
    */
    try { 
        const adminUser = req.user?.role === "Admin";
        const brands = await brandService.getAllBrands(adminUser);

        if (brands.length <= 0) {
            return res.status(404).jsend.error({ statusCode: 404, message: "No brands found", result: brands })
        }

        return  res.status(200).jsend.success({ statusCode: 200, result: brands });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
});

// GET brand by id if admin, GET brand by id that are not deleted if user.
router.get("/:id", tryAuth, async (req, res) => {
    /* 
        #swagger.path = '/brands/{id}'
        #swagger.tags = ['Brands']
        #swagger.description = "Brand information."
    */
    try {

        const { id }= req.params;
        const adminUser = req.user?.role === "Admin";
        const brand = await brandService.getBrandById(id, adminUser);

        if (brand.length <= 0) {
            return res.status(404).jsend.error({ statusCode: 404, message: "No brand found", result: brand })
        }

        return res.status(200).jsend.success({ statusCode: 200, message: "Brand found", result: brand });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message })
    }
})

// CREATE brand
router.post("/", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/brands'
        #swagger.tags = ['Brands']
        #swagger.description = "CREATE brand if admin"
        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Brand information. Admin only endpoint.',
            required: true,
            schema: { "name": "Brand name" }
            } 
    */
    try {
        const { name } = req.body;

        if (!name) {
            throw new Error("Name is required")
        }

        const brand = await brandService.createBrand(name);

        return res.status(201).jsend.success({ statusCode: 201, message: "Brand created", result: brand });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// UPDATE brand
router.put("/:id", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/brands/{id}'
        #swagger.tags = ['Brands']
        #swagger.description = "UPDATE brand if admin"
		#swagger.parameters["body"] = {
			in: "body",
			description: "Brand information. Admin only endpoint.",
			required: true,
			schema: { "name": "New brand name" }
		} 
    */
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            throw new Error("Name is required")
        }

        const updatedBrand = await brandService.updateBrand(id, name);

        return res.status(200).jsend.success({ statusCode: 200, message: "Brand has been updated", result: updatedBrand });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// DELETE brand
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/brands/{id}'
        #swagger.tags = ['Brands']
        #swagger.description = "DELETE brand if admin (soft delete)"
    */
    try {
        const { id } = req.params;
        const deletedBrand = await brandService.deleteBrand(id);

        return res.status(200).jsend.success({ statusCode: 200, message: "Brand deleted", result: deletedBrand });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

// RESTORE brand
router.put("/:id/restore", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/brand/{id}/restore'
        #swagger.tags = ['Brands']
        #swagger.description = "RESTORE brand if soft deleted"
    */
    try {
        const { id } = req.params;
        const restoreBrand = await brandService.restoreDeletedBrand(id);

        return res.status(200).jsend.success({ statusCode: 200, message: "Brand restored", result: restoreBrand });

    } catch(err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

module.exports = router;