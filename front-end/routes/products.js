const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
	try {
        const token = req.session.token;

        if(!token) {
            return res.redirect("/")
        };

        const products = await fetch(process.env.API_URL + "/products", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        const brands = await fetch(process.env.API_URL + "/brands", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        

        const categories = await fetch(process.env.API_URL + "/categories", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!products.ok || !brands.ok || !categories.ok) {
            throw new Error(data.data.result);
        }
        
        const productData = await products.json();
        const brandData = await brands.json();
        const categoryData = await categories.json();

        const error = req.query.error;

        return res.render("products", { title: "Products", products: productData.data.result, brands: brandData.data.result, categories: categoryData.data.result, error });
        
    } catch (error) {
        return res.render("products", { title: "Products", products: [], error: error.message})
    }
});

router.post("/create", async (req, res) => {
	try {
        const token = req.session.token;
        const { name, description, price, quantity, imgurl, date_added, category_id, brand_id } = req.body;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/products", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Create product failed");
        }

        return res.redirect("/products")
        
    } catch (error) {
        return res.redirect("/products?error=" + encodeURIComponent(error.message));
    }
});

router.post("/:id/delete", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/products/" + id, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Delete failed");
        }

        return res.redirect("/products")
        
    } catch (error) {
        return res.redirect("/products?error=" + encodeURIComponent(error.message));
    }
});

router.post("/:id/restore", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/products/" + id + "/restore", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Restore failed");
        }

        return res.redirect("/products")
        
    } catch (error) {
        return res.redirect("/products?error=" + encodeURIComponent(error.message));
    }
});

router.post("/:id/update", async (req, res) => {
	try {
        const token = req.session.token;
        const { id } = req.params;
        const { name, description, price, quantity, imgurl } = req.body;

        if(!token) {
            return res.redirect("/")
        };

        const response = await fetch(process.env.API_URL + "/products/" + id, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.data.message || "Update product failed");
        }

        return res.redirect("/products")
        
    } catch (error) {
        return res.redirect("/products?error=" + encodeURIComponent(error.message));
    }
});

router.post("/search", async (req, res) => {
    try {
        const token = req.session.token;
        const { name, brandId, categoryId } = req.body;

        if(!token) {
            return res.redirect("/")
        };

        const products = await fetch(process.env.API_URL + "/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(req.body)
        });

        const brands = await fetch(process.env.API_URL + "/brands", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });
        

        const categories = await fetch(process.env.API_URL + "/categories", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        });

        if (!products.ok || !brands.ok || !categories.ok) {
            throw new Error(data.data.result);
        }
        
        const productData = await products.json();
        const brandData = await brands.json();
        const categoryData = await categories.json();

        const error = req.query.error;

        return res.render("products", { title: "Products", products: productData.data.result, brands: brandData.data.result, categories: categoryData.data.result, error });
        
    } catch (error) {
        return res.render("products", { title: "Products", products: [], error: error.message})
    }
});


module.exports = router;
