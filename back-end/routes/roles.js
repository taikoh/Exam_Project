const express = require("express");
const router = express.Router();
const db = require("../models");
const RoleService = require("../services/RoleService");
const roleService = new RoleService(db)
const isAdmin = require("../middleware/isAdmin");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/roles'
        #swagger.tags = ['Roles']
        #swagger.description = "Admin only endpoint."
    */
    try {
        const roles = await roleService.getAllRoles()

        return res.status(200).jsend.success({ statusCode: 200, result: roles });

    } catch (err) {
        return res.status(500).jsend.error({ statusCode: 500, message: err.message });
    }
})

module.exports = router;