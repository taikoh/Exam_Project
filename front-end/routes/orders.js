const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const token = req.session.token;

        const response = await fetch(process.env.API_URL + "/orders", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if(!token) {
            return res.redirect("/")
        };
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.data.result);
        }

        return res.render("orders", { title: "Orders", orders: data.data.result, error: null });
        
    } catch (error) {
        return res.render("orders", { title: "Orders", orders: [], error: error.message})
    }
});

router.post("/:id/update", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;
        const { status } = req.body;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/orders/" + id, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Update order failed");
        }

        return res.redirect("/orders")
        
    } catch (error) {
        return res.redirect("/orders?error=" + encodeURIComponent(error.message));
    }
});

module.exports = router;
