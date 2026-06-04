module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define(
        "Product",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: false
            },
            price: {
                type: Sequelize.DataTypes.DECIMAL(10,2),
                allowNull: false
            },
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: 0
            },
            imgurl: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            date_added: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            },
            is_deleted: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            timestamps: true,
        });

        Product.associate = (models) => {
            Product.belongsTo(models.Category, {
                foreignKey: "category_id"
            });

            Product.belongsTo(models.Brand, {
                foreignKey: "brand_id"
            });

            Product.hasMany(models.CartItem, {
                foreignKey: "product_id"
            });

            Product.hasMany(models.OrderItem, {
                foreignKey: "product_id"
            });
        };

        return Product;
}