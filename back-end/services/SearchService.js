class SearchService {
    constructor(db) {
        this.client = db.sequelize,
        this.Product = db.Product,
        this.Brand = db.Brand,
        this.Category = db.Category
    }

    async searchProducts(name, brandId, categoryId) {
        let querySearch = `SELECT
                p.*,
                b.name AS brand,
                b.is_deleted AS brand_deleted,
                c.name AS category,
                c.is_deleted AS category_deleted
                    FROM Products p
                    LEFT JOIN Brands b
                        ON p.brand_id = b.id
                    LEFT JOIN Categories c
                        ON p.category_id = c.id`

        if (!name && !brandId && !categoryId) {
            return [];
        }

        const searchParameters = [];
        const replacementSearch = {};

        if (name) {
            searchParameters.push("p.name LIKE :name");
            replacementSearch.name = `%${name}%`;
        }

        if (brandId) {
            searchParameters.push("p.brand_id = :brandId");
            replacementSearch.brandId = brandId;
        }

        if (categoryId) {
            searchParameters.push("p.category_id = :categoryId");
            replacementSearch.categoryId = categoryId;
        }

        if (searchParameters.length > 0) {
            querySearch += ` WHERE ${searchParameters.join(" AND ")}`;
        }

        return await this.client.query(querySearch, {
            replacements: replacementSearch,
            type: this.client.QueryTypes.SELECT
        });
    }
}

module.exports = SearchService;