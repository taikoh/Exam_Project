const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const token = req.session.token;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/brands", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.data.result);
        }

        const error = req.query.error

        return res.render("brands", { title: "Brands", brands: data.data.result, error });
        
    } catch (error) {
        return res.render("brands", { title: "Brands", brands: [], error: error.message})
    }
});

router.post("/create", async (req, res) => {
	try {
        const token = req.session.token;
        const { name } = req.body;

        if(!token) {
            return res.redirect("/")
        };
        
        const response = await fetch(process.env.API_URL + "/brands", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Create brand failed");
        }

        return res.redirect("/brands")
        
    } catch (error) {
        return res.redirect("/brands?error=" + encodeURIComponent(error.message));
    }
});

router.post("/:id/delete", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/brands/" + id, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message ||"Delete failed");
        }

        return res.redirect("/brands")
        
    } catch (error) {
        return res.redirect("/brands?error=" + encodeURIComponent(error.message));
    }
});

router.post("/:id/restore", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/brands/" + id + "/restore", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Restore failed");
        }

        return res.redirect("/brands")
        
    } catch (error) {
        return res.redirect("/brands?error=" + encodeURIComponent(error.message));
    }
});

router.post("/:id/update", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;
        const { name } = req.body;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/brands/" + id, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Update brand failed");
        }

        return res.redirect("/brands")
        
    } catch (error) {
        return res.redirect("/brands?error=" + encodeURIComponent(error.message));
    }
});

module.exports = router;
