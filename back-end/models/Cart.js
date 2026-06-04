module.exports = (sequelize, Sequelize) => {
    const Cart = sequelize.define(
        "Cart", 
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: Sequelize.DataTypes.INTEGER,
                unique: true
            }
        }, {
            timestamps: true
        });

        Cart.associate = (models) => {
            Cart.belongsTo(models.User, {
                foreignKey: "user_id"
            });

            Cart.hasMany(models.CartItem, {
                foreignKey: "cart_id",
                onDelete: "CASCADE"
            });
        };

        return Cart;
}