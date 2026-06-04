module.exports = (sequelize, Sequelize) => {
    const OrderItem = sequelize.define(
        "OrderItem",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            product_name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            quantity: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            price: {
                type: Sequelize.DataTypes.DECIMAL(10,2),
                allowNull: false
            }
        }, {
            timestamps: true
        });

        OrderItem.associate = (models) => {
            OrderItem.belongsTo(models.Order, {
                foreignKey: "order_id"
            });

            OrderItem.belongsTo(models.Product, {
                foreignKey: "product_id"
            });
        }

        return OrderItem;
}