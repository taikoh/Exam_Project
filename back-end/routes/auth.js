var express = require("express");
var router = express.Router();
const db = require("../models");
const crypto = require("crypto");
const validateUserCreate = require("../middleware/validateUserCreate")
const AuthService = require("../services/AuthService");
const authService = new AuthService(db);
const jwt = require("jsonwebtoken");

// Post for registered users to be able to login
router.post("/login", async (req, res, next) => {
	/* 
		#swagger.path = '/auth/login'
		#swagger.tags = ["Authentication"]
		#swagger.description = "Logs the user to the application. Both email and password must be correct. 
			JWT token is returned after successful login. Use it later in Authorization header to access certain endpoints.   "
		#swagger.parameters["body"] = {
			in: "body",
			description: "Login endpoint",
			required: true,
			schema: { $ref: "#/definitions/Login" }
		} 
	*/

	const { email, password } = req.body;

	if (!email) {
		return res.status(400).jsend.fail(
			{ statusCode: 400, result: "Email is required." }
		);
	}

	if (!password) {
		return res.status(400).jsend.fail(
			{ statusCode: 400, result: "Password is required." }
		);
	}

	try {
		const user = await authService.getOne(email)
			
		if (!user) {
				return res.status(400).jsend.fail(
				{ statusCode: 400, result: "Incorrect email or password." }
			);
			}
			crypto.pbkdf2(
				password,
				user.salt,
				310000,
				32,
				"sha256",
				(err, hashedPassword) => {
					if (err) {
						return res.jsend.error("Password verification failed.");
					}

					if (!crypto.timingSafeEqual(user.encrypted_password, hashedPassword)) {
						return res.status(400).jsend.fail({
								statusCode: 400,
								result: "Incorrect email or password.",
							});
					}

					const token = jwt.sign(
						{ id: user.id, email: user.email, role: user.Role.name },
						process.env.TOKEN_SECRET,
						{ expiresIn: "2h" },
					);

					return res.status(201).jsend.success({
						statusCode: 201,
						result: "Successfully logged in.",
						id: user.id,
						email: user.email,
						token,
					});
				},
			);

	} catch (err) {
		return res.status(500).jsend.error({ statusCode: 500, message: err })
	}
});

// Post for new users to register / signup
router.post("/register", validateUserCreate, async (req, res, next) => {
	/* 
		#swagger.path = '/auth/register'
		#swagger.tags = ["Authentication"]
		#swagger.description = "Create a new user account"
		#swagger.parameters["body"] = {
			in: "body",
			description: "Register endpoint",
			required: true,
			schema: { $ref: "#/definitions/User" }
		} 
	*/
	try {
		const { firstname, lastname, username, email, address, city, phone, password } = req.body;

		const salt = crypto.randomBytes(16);
		crypto.pbkdf2(
			password,
			salt,
			310000,
			32,
			"sha256",
			async (err, hashedPassword) => {
				
				if (err) { 
					return next(err); 
				}

				try {
					await authService.create({firstname, lastname, username, email, phone, address, city, encrypted_password: hashedPassword, salt});
					
					res.status(201).jsend.success({
						statusCode: 201,
						result: "Account has been created!",
					});
				} catch (err) {
					return res.status(500).jsend.error({ statusCode: 500, message: err.message });
				}
		});

	} catch (err) {
		return res.status(500).jsend.error({ statusCode: 500, message: err.message });
	}
});

module.exports = router;