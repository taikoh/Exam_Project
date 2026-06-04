const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        version: "1.0.0",
        title: "Exam project",
        description: "Documentation for the Noroff Exam Project.",
    },
    host: "localhost:3000",
    schemes: ["http"],
    tags: [
        {
            name: "Initialization",
            Description: "Database initialization"
        },
        {
            name: "Authentication",
            description: "User authentication"
        },
        {
            name: "Users",
            description: "User management"
        },
        {
            name: "Roles",
            description: "Role Management"
        },
        {
            name: "Products",
            description: "Product management"
        },
        {
            name: "Categories",
            description: "Category management"
        },
        {
            name: "Brands",
            description: "Brand management"
        },
        {
            name: "Cart",
            description: "Cart management"
        }
    ],
    definitions: {
        User: {
            firstname: "John",
            lastname: "Doe",
            username: "johndoe",
            email: "test@test.no",
            password: "0000",
            address: "Street street 123",
            city: "Stavanger",
            phone: 12345678
        },
        Login: {
            email: "test@test.no",
            password: "password"
        },
        Brands: {
            name: "Product brands"
        },
        Categories: {
            name: "Product categories"
        },
        Products: {
            name: "product name",
            description: "product description",
            price: 199.99,
            quantity: 1,
            imgurl: "http://imgurl.com",
            date_added: "2026-05-10",
            category_id: 1,
            brand_id: 1
        },
    },
    securityDefinitions: {
        Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header",
            description: "Enter your bearer token in the format **Bearer -yourtoken-**"
        }
    },
    security: [{ Bearer: [] }]
};


const outputFile = "./swagger-output.json"
const endpointsFile = [
    "./routes/auth.js",
    "./routes/brands.js",
    "./routes/categories.js",
    "./routes/products.js",
    "./routes/init.js",
    "./routes/carts.js",
    "./routes/orders.js",
    "./routes/search.js",
    "./routes/users.js",
    "./routes/roles.js"
];


swaggerAutogen(outputFile, endpointsFile, doc).then(() => {
    require("./bin/www")
});
