const express = require("express");
const router = express.Router();
const db = require("../models");
const UserService = require("../services/UserService");
const userService = new UserService(db);
const isAdmin = require("../middleware/isAdmin");
const isAuth = require("../middleware/isAuth");

router.get('/', isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/users'
        #swagger.tags = ['Users']
        #swagger.description = "Admin only endpoint."
    */
  try {
    const user = await userService.getUsers();

    if (!user) {
      throw new Error("User doesn't exist")
    }

    res.status(200).jsend.success({ statusCode: 200, message: "Users found", result: user });

  } catch (err) {
    res.status(500).jsend.error({ statusCode: 500, message: err.message });
  }
});

router.put("/:id/update", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/users/{id}/update'
        #swagger.tags = ['Users']
        #swagger.description = "UPDATE user if admin" 
		#swagger.parameters["body"] = {
			in: "body",
			description: "User information. Admin only endpoint.",
			required: true,
			schema: 
      { 
        "firstname": "Jane",
        "lastname": "Smith",
        "username": "janesmith",
        "email": "jane@test.no",
        "address": "Main street 3",
        "city": "Oslo",
        "phone": 87654321  
      }
		} 
    */
  try {

    const { id } = req.params;
    const { firstname, lastname, username, email, address, city, phone, role_id } = req.body

    const updatedUser = await userService.updateUser({ id, firstname, lastname, username, email, address, city, phone, role_id });

    return res.status(200).jsend.success({ statusCode: 200, message: "User updated", result: updatedUser })

  } catch (err) {
    return res.status(500).jsend.error({ statusCode: 500, message: err.message });
  }
})

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
    /* 
        #swagger.path = '/users/{id}'
        #swagger.tags = ['Users']
        #swagger.description = "Admin only endpoint."
    */
  try {
    const { id } = req.params;
    const user = await userService.getOneUser(id)

    await userService.deleteUser(id);

    return res.status(200).jsend.success({ statusCode: 200, message: "Account deleted.", result: user.username })

  } catch (err) {
    return res.status(500).jsend.error({ statusCode: 500, message: err.message });
  }
})

module.exports = router;
