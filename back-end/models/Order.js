module.exports = (sequelize, Sequelize) => {
    const Order = sequelize.define(
        "Order",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            order_number: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            cart_total: {
                type: Sequelize.DataTypes.DECIMAL(10,2),
                allowNull: false
            },
            discount_amount: {
                type: Sequelize.DataTypes.DECIMAL(10,2),
                defaultValue: 0
            },
            final_total: {
                type: Sequelize.DataTypes.DECIMAL(10,2),
                allowNull: false
            },
            membership_name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            membership_discount: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: Sequelize.DataTypes.STRING,
                defaultValue: "In progress"
            }
        }, {
            timestamps: true
        });

        Order.associate = (models) => {
            Order.belongsTo(models.User, {
                foreignKey: "user_id"
            });
            
            Order.hasMany(models.OrderItem, {
                foreignKey: "order_id"
            });
        };

        return Order;
}