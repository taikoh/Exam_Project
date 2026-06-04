module.exports = (sequelize, Sequelize) => {
    const CartItem = sequelize.define(
        "CartItem",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            price: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ["cart_id", "product_id"]
                }
            ]
        });

        CartItem.associate = (models) => {
            CartItem.belongsTo(models.Cart, {
                foreignKey: "cart_id"
            });

            CartItem.belongsTo(models.Product, {
                foreignKey: "product_id"
            });
        };

        return CartItem;
}