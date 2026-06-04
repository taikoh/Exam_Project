require("dotenv").config({ path: "../.env" });
const express = require("express");
const request = require("supertest");
const jsend = require("jsend");

const authRoutes = require("../routes/auth");
const productRoutes = require("../routes/products");
const brandRoutes = require("../routes/brands");
const categoryRoutes = require("../routes/categories");

const app = express();
app.use(express.json());
app.use(jsend.middleware);
app.use("/", authRoutes);
app.use("/products", productRoutes)
app.use("/categories", categoryRoutes);
app.use("/brands", brandRoutes);

describe("Testing auth, create/get/update brands and categories. create/get/delete product with brand and categories", () => {
    let token;
    let productId;
    let categoryId;
    let brandId;

    const user = {
        "email": "admin@noroff.no",
        "password": "P@ssword2023"
    };

    test("POST /login - success", async () => {
        const { body } = await request(app).post("/login").send(user);
        expect(body).toHaveProperty("status", "success");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toBe("Successfully logged in.");

        token = body.data.token;
        expect(token).toBeDefined;
    });

    test("POST /categories - success", async () => {
        const { body } = await request(app)
            .post("/categories")
            .set("Authorization", "Bearer " + token)
            .send({ name: "TEST_CATEGORY" });

        expect(body).toHaveProperty("status", "success");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toHaveProperty("id");
        expect(body.data.result.name).toBe("TEST_CATEGORY");

        categoryId = body.data.result.id;
    })

    test("POST /brands - success", async () => {
        const { body } = await request(app)
            .post("/brands")
            .set("Authorization", "Bearer " + token)
            .send({ name: "TEST_BRAND" });

        expect(body).toHaveProperty("status", "success");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toHaveProperty("id");
        expect(body.data.result.name).toBe("TEST_BRAND");

        brandId = body.data.result.id;
    })

    test("POST /products - success", async () => {
        const { body } = await request(app)
            .post("/products")
            .set("Authorization", "Bearer " + token)
            .send({
                name: "TEST_PRODUCT",
                description: "TEST_PRODUCT description",
                price: 99.99,
                quantity: 10,
                imgurl: "http://imgurl.com",
                date_added: "2026-05-24",
                category_id: categoryId,
                brand_id: brandId
            });

        expect(body).toHaveProperty("status", "success");
        expect(body.data).toHaveProperty("result");
        expect(body.data.result).toHaveProperty("id");
        expect(body.data.result.name).toBe("TEST_PRODUCT");

        productId = body.data.result.id;
    });

    test("GET /products/:id with full info and with brand and category name - success", async () => {
        const { body } = await request(app)
            .get("/products/" + productId)
            .set("Authorization", "Bearer " + token)

        expect(body).toHaveProperty("status", "success");
        expect(body.data.result.length).toBeGreaterThanOrEqual(1);

        const product = body.data.result.find(p => p.id === productId);
        expect(product).toBeDefined();
        expect(product.name).toBe("TEST_PRODUCT");
        expect(product.category_id).toBe(categoryId);
        expect(product.brand_id).toBe(brandId);
        expect(product.brand).toBe("TEST_BRAND");
        expect(product.category).toBe("TEST_CATEGORY");
    });

    test("PUT /categories/:id - success", async () => {
        const { body } = await request(app)
            .put("/categories/" + categoryId)
            .set("Authorization", "Bearer " + token)
            .send({ name: "TEST_CATEGORY2" })


        const category = body.data;
        expect(body).toHaveProperty("status", "success");
        expect(category.message).toBe("Category has been updated")
        expect(category.result.id).toBe(categoryId);
        expect(category.result.name).toBe("TEST_CATEGORY2");
    })
    
    test("PUT /brands/:id - success", async () => {
        const { body } = await request(app)
            .put("/brands/" + brandId)
            .set("Authorization", "Bearer " + token)
            .send({ name: "TEST_BRAND2" })


        const brand = body.data;
        expect(body).toHaveProperty("status", "success");
        expect(brand.message).toBe("Brand has been updated")
        expect(brand.result.id).toBe(brandId);
        expect(brand.result.name).toBe("TEST_BRAND2");
    })

    test("GET /products/:id with full info and with brand and category name - success", async () => {
        const { body } = await request(app)
            .get("/products/" + productId)
            .set("Authorization", "Bearer " + token)

        expect(body).toHaveProperty("status", "success");
        expect(body.data.result.length).toBeGreaterThanOrEqual(1);

        const product = body.data.result.find(p => p.id === productId);
        expect(product).toBeDefined();
        expect(product.name).toBe("TEST_PRODUCT");
        expect(product.category_id).toBe(categoryId);
        expect(product.brand_id).toBe(brandId);
        expect(product.brand).toBe("TEST_BRAND2");
        expect(product.category).toBe("TEST_CATEGORY2");
    });

    test("DELETE /products/:id", async () => {
        const { body } = await request(app)
            .delete("/products/" + productId)
            .set("Authorization", "Bearer " + token)

        const product = body.data.result;
        expect(body).toHaveProperty("status", "success");
        expect(body.data.message).toBe("Product removed");
        expect(product.name).toBe("TEST_PRODUCT");
        expect(product.is_deleted).toBe(true);
        expect(product.brand_id).toBe(brandId);
        expect(product.category_id).toBe(categoryId);
    })
})
