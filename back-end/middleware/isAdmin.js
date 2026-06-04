function isAdmin (req, res, next) {
    if (!req.user || req.user.role !== "Admin") {
        return res.status(403).jsend.fail({ statusCode: 403, error: "Admin role required." })
    }

    next();
}

module.exports = isAdmin;