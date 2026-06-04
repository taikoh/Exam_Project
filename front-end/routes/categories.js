const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const token = req.session.token;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/categories", {
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

        return res.render("categories", { title: "Categories", categories: data.data.result, error });
        
    } catch (error) {
        return res.render("categories", { title: "Categories", categories: [], error: error.message})
    }
});

router.post("/create", async (req, res) => {
	try {
        const token = req.session.token;
        const { name } = req.body;

        if(!token) {
            return res.redirect("/")
        };
        
        const response = await fetch(process.env.API_URL + "/categories", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Create category failed");
        }

        return res.redirect("/categories")
        
    } catch (error) {
        return res.redirect("/categories?error=" + encodeURIComponent(error.message));
    }
});

router.post("/:id/delete", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/categories/" + id, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message ||"Delete failed");
        }

        return res.redirect("/categories")
        
    } catch (error) {
        return res.redirect("/categories?error=" + encodeURIComponent(error.message));
    }
});

router.post("/:id/restore", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/categories/" + id + "/restore", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Restore failed");
        }

        return res.redirect("/categories")
        
    } catch (error) {
        return res.redirect("/categories?error=" + encodeURIComponent(error.message));
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

        const response = await fetch(process.env.API_URL + "/categories/" + id, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.data.message || "Update category failed");
        }

        return res.redirect("/categories")
        
    } catch (error) {
        return res.redirect("/categories?error=" + encodeURIComponent(error.message));
    }
});

module.exports = router;
