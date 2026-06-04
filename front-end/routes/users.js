const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const token = req.session.token;

        if(!token) {
            return res.redirect("/")
        };

        const users = await fetch(process.env.API_URL + "/users", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        const roles = await fetch(process.env.API_URL + "/roles", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        
        const userData = await users.json();
        const roleData = await roles.json();

        if (!users.ok || !roles.ok) {
            throw new Error(data.data.result);
        }

        return res.render("users", { title: "Users", users: userData.data.result, roles: roleData.data.result, error: null });
        
    } catch (error) {
        return res.render("users", { title: "Users", users: [], error: error.message})
    }
});

router.post("/:id/update", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;
        const { firstname, lastname, username, email, address, city, phone, role_id } = req.body;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/users/" + id + "/update", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.data.message || "Update user failed");
        }

        return res.redirect("/users")
        
    } catch (error) {
        return res.redirect("/users?error=" + encodeURIComponent(error.message));
    }
});

module.exports = router;
