const jwt = require("jsonwebtoken");

// Checks is user is authenticated, continues regardless. Used for what items to display to different user roles.
function tryAuth(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next();
    }

    try { 
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = decoded;
        
        next()
        
    } catch (err) {
        return res.status(401).jsend.fail({ statusCode: 401, error: "Invalid token" });
    }
}

module.exports = tryAuth;