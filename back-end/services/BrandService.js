const { Op } = require("sequelize");

class BrandService {
    constructor(db) {
        this.client = db.sequelize;
        this.Brand = db.Brand;
        this.Product = db.Product;
    }

    async getAllBrands(adminUser) {
        if (!adminUser) {
            return await this.Brand.findAll({
                where: { is_deleted: false }
            });
        } else {
            return await this.Brand.findAll()
        }
    }

    async getBrandById(id, adminUser) {
        if (!adminUser) {
            return await this.Brand.findOne({
                where: { id, is_deleted: false }
            });
        } else {
            return await this.Brand.findByPk(id)
        }
    }

    async createBrand(name) {
        const existingBrand = await this.Brand.findOne({
            where: { name }
        });

        if (existingBrand) {
            throw new Error("Brand with that name already exists.")
        }

        return this.Brand.create({ name })
    }

    async updateBrand(id, name) {
        const brand = await this.Brand.findByPk(id);

        const existingBrand = await this.Brand.findOne({
            where: { 
                name,
                id: { [Op.ne]: id } 
            }
        });

        if (existingBrand) {
            throw new Error("Brand with that name already exists.")
        }
        const updatedBrand = await this.Brand.update(
            { name },
            { where: { id }
        });

        if (updatedBrand[0] === 0) {
            throw new Error("Brand not found.")
        }

        brand.name = name;
        await brand.save();

        return brand;
    }

    async deleteBrand(id) {
        const brand = await this.Brand.findByPk(id);

        if (!brand) {
            throw new Error("Brand not found.")
        }

        if (brand.is_deleted) {
            throw new Error("Brand is already set as deleted")
        }

        const productExists = await this.Product.findOne({
            where: { brand_id: id }
        });

        if (productExists) {
            throw new Error("Unable to delete Brand when assigned to a product.")
        }

        brand.is_deleted = true;
        await brand.save();

        return brand;
    }

    async restoreDeletedBrand(id) {
        const brand = await this.Brand.findByPk(id);

        if (!brand) {
            throw new Error("Brand not found.")
        }

        if (!brand.is_deleted) {
            throw new Error("Brand is already set as not deleted")
        }

        brand.is_deleted = false;
        await brand.save();

        return brand;
    }
}

module.exports = BrandService;