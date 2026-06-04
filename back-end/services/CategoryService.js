const { Op } = require("sequelize");

class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
        this.Product = db.Product;
    }

    async getAllCategories(adminUser) {
        if (!adminUser) {
            return await this.Category.findAll({
                where: { is_deleted: false }
            });
        } else {
            return await this.Category.findAll()
        }
    }

    async getCategoryById(id, adminUser) {
        if (!adminUser) {
            return await this.Category.findOne({
                where: { id, is_deleted: false }
            });
        } else {
            return await this.Category.findByPk(id)
        }
    }

    async createCategory(name) {
        const existingCategory = await this.Category.findOne({
            where: { name }
        });

        if (existingCategory) {
            throw new Error("Category with that name already exists")
        }

        return this.Category.create({ name })
    }

    async updateCategory(id, name) {
        const category = await this.Category.findByPk(id);

        const existingCategory = await this.Category.findOne({
            where: { 
                name,
                id: { [Op.ne]: id } 
            }
        });

        if (existingCategory) {
            throw new Error("Category with that name already exists")
        }
        
        const updatedCategory = await this.Category.update(
            { name },
            { where: { id }
        });

        if (updatedCategory[0] === 0) {
            throw new Error("Category not found")
        }

        category.name = name;
        await category.save();

        return category;
    }

    async deleteCategory(id) {
        const category = await this.Category.findByPk(id);

        if (!category) {
            throw new Error("Category not found")
        }

        if (category.is_deleted) {
            throw new Error("Category is already set as deleted")
        }

        const productExists = await this.Product.findOne({
            where: { category_id: id }
        });

        if (productExists) {
            throw new Error("Unable to delete category when assigned to a product")
        }

        category.is_deleted = true;
        await category.save();

        return category;
    }

    async restoreDeletedCategory(id) {
        const category = await this.Category.findByPk(id);

        if (!category) {
            throw new Error("Category not found")
        }

        if (!category.is_deleted) {
            throw new Error("Category is already set as not deleted")
        }

        category.is_deleted = false;
        await category.save();

        return category;
    }
}

module.exports = CategoryService;