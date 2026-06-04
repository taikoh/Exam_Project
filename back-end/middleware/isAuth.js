const jwt = require("jsonwebtoken");

// Middleware function to determine if the API endpoint request is from an authenticated user
function isAuth(req, res, next) {
	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).jsend.fail({ statusCode: 401, error: "Token missing" });
	}

	try { 
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = decoded;
		
		next()
		
	} catch (err) {
		return res.status(401).jsend.fail({ statusCode: 401, error: "Invalid token" });
	}
}

module.exports = isAuth;