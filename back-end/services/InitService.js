const axios = require("axios");
const crypto = require("crypto");
class InitService {
    constructor(db) {
        this.client = db.sequelize;
        this.Role = db.Role;
        this.Membership = db.Membership;
        this.User = db.User;
        this.Category = db.Category;
        this.Brand = db.Brand;
        this.Product = db.Product;

        this.categoryMap = new Map();
        this.brandMap = new Map();
    }

    async initializeDB() {
        const existingProduct = await this.Product.findOne();

        if (existingProduct) {
            throw new Error("Database already initialized.");
        }

        await this.createRoles();
        await this.createMemberships();
        await this.createAdmin();

        const fetchAPI = await this.fetchProducts();

        await this.createCategories(fetchAPI);
        await this.createBrands(fetchAPI);
        await this.createProducts(fetchAPI);

        return "Database initialized";
    }

    async createRoles() {
        return await this.Role.bulkCreate([
            { id: 1, name: "Admin"},
            { id: 2, name: "User"}
        ]);
    }

    async createMemberships() {
        return await this.Membership.bulkCreate([
            { id: 1, name: "Bronze", min_items: 0, max_items: 14, discount: 0 },
            { id: 2, name: "Silver", min_items: 15, max_items: 29, discount: 15 },
            { id: 3, name: "Gold", min_items: 30, max_items: null, discount: 30 }
        ]);
    }

    async createAdmin() {
        const salt = crypto.randomBytes(16);

        const hashedPassword = await new Promise((resolve, reject) => {
            crypto.pbkdf2(
                "P@ssword2023",
                salt,
                310000,
                32,
                "sha256",
                (err, hash) => {
                    if (err) return reject(err);
                    resolve(hash);
                }
            );
        });

        return await this.User.create({
            firstname: "Admin",
            lastname: "Support",
            username: "Admin",
            email: "admin@noroff.no",
            address: "Online",
            city: "Internet",
            phone: "911",
            encrypted_password: hashedPassword,
            salt: salt,
            role_id: 1,
            membership_id: 1
        });
    }

    async fetchProducts() {
        const response = await axios.get("http://backend.restapi.co.za/items/products");

        return response.data.data;
    }

    async createCategories(fetchAPI) {
        let categoryId = 1;

        fetchAPI.forEach(product => {
            if (!this.categoryMap.has(product.category)) {

                this.categoryMap.set(product.category, {
                    id: categoryId++,
                    name: product.category
                })
            }
        });

        return await this.Category.bulkCreate([...this.categoryMap.values()]);
    }

    async createBrands(fetchAPI) {
        let brandId = 1;

        fetchAPI.forEach(product => {
            if (!this.brandMap.has(product.brand)) {

                this.brandMap.set(product.brand, {
                    id: brandId++,
                    name: product.brand
                });
            }
        });

        return await this.Brand.bulkCreate([...this.brandMap.values()]);
    }

    async createProducts(fetchAPI) {
        const products = fetchAPI.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            imgurl: product.imgurl,
            date_added: product.date_added,
            brand_id: this.brandMap.get(product.brand).id,
            category_id: this.categoryMap.get(product.category).id
        }));

        return await this.Product.bulkCreate(products);
    }

}


module.exports = InitService;