class ProductService {
	constructor(db) {
		this.client = db.sequelize;
		this.Product = db.Product;
		this.Brand = db.Brand;
		this.Category = db.Category;
	}

	async getAllProducts(adminUser) {
		let userQuery = `SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.price, 
            p.date_added, 
            p.imgurl, 
            p.quantity, 
            p.createdAt, 
            p.updatedAt, 
            b.id AS BrandId, 
            c.id AS CategoryId, 
            b.name AS brand, 
            c.name AS category 
                FROM Products p 
                JOIN Brands b ON p.brand_id = b.id 
                JOIN Categories c ON p.category_id = c.id
                WHERE p.is_deleted = 0
                ORDER BY p.id ASC`;

		let adminQuery = `SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.price, 
            p.date_added, 
            p.imgurl, 
            p.quantity,
            p.createdAt, 
            p.updatedAt,
            p.is_deleted, 
            b.id AS BrandId, 
            c.id AS CategoryId, 
            b.name AS brand, 
            c.name AS category 
                FROM Products p 
                JOIN Brands b ON p.brand_id = b.id 
                JOIN Categories c ON p.category_id = c.id
                ORDER BY p.id ASC`;

		if (!adminUser) {
			return await this.client.query(userQuery, {
				type: this.client.QueryTypes.SELECT,
			});
		} else {
			return await this.client.query(adminQuery, {
				type: this.client.QueryTypes.SELECT,
			});
		}
	}

	async getProductById(id, adminUser) {
		let userQuery = `SELECT
            p.*,
            b.name AS brand,
            c.name AS category
                FROM Products p
                JOIN Brands b ON p.brand_id = b.id
                JOIN Categories c ON p.category_id = c.id
                WHERE p.id = ${id}
                    AND p.is_deleted = 0`;

		let adminQuery = `SELECT
            p.*,
            b.name AS brand,
            c.name AS category
                FROM Products p
                JOIN Brands b ON p.brand_id = b.id
                JOIN Categories c ON p.category_id = c.id
                WHERE p.id = ${id}`;

		if (!adminUser) {
			return await this.client.query(userQuery, {
				type: this.client.QueryTypes.SELECT,
			});
		} else {
			return await this.client.query(adminQuery, {
				type: this.client.QueryTypes.SELECT,
			});
		}
	}

	async createProduct(data) {
		const {
			name,
			description,
			price,
			quantity,
			imgurl,
			date_added,
			category_id,
			brand_id,
		} = data;

		if (
			name == null ||
			description == null ||
			price == null ||
			quantity == null ||
			imgurl == null ||
			category_id == null ||
			brand_id == null
		) {
			throw new Error("Missing required fields");
		}

		const imgURLRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i;

		if (imgurl && !imgURLRegex.test(imgurl)) {
			throw new Error("Invalid image URL");
		}

		return this.Product.create({
			name,
			description,
			price,
			quantity,
			imgurl,
			date_added,
			category_id,
			brand_id,
		});
	}

	async updateProduct(id, name, description, price, quantity, imgurl) {
		const updatedProduct = await this.Product.update(
			{
				name,
				description,
				price,
				quantity,
				imgurl,
			},
			{ where: { id } },
		);

		if (updatedProduct[0] === 0) {
			throw new Error("Product not found.");
		}

		return await this.Product.findByPk(id);
	}

	async deleteProduct(id) {
		const product = await this.Product.findByPk(id);

		if (!product) {
			throw new Error("Product not found");
		}

		if (product.is_deleted) {
			throw new Error("Product already set as deleted.");
		}

		product.is_deleted = true;
		await product.save();

		return product;
	}

	async restoreDeletedProduct(id) {
		const product = await this.Product.findByPk(id);

		if (!product) {
			throw new Error("Product not found");
		}

		if (!product.is_deleted) {
			throw new Error("Product already set as not deleted.");
		}

		product.is_deleted = false;
		await product.save();

		return product;
	}
}

module.exports = ProductService;
