module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define(
        "User", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            firstname: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            lastname: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            username: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            encrypted_password: {
                type: Sequelize.DataTypes.BLOB,
                allowNull: false
            },
            salt: {
                type: Sequelize.DataTypes.BLOB,
                allowNull: false
            },
            address: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            city: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            phone: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            total_items_purchased: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: 0
            }
        }, {
            timestamps: true
        });

        User.associate = (models) => {
            User.belongsTo(models.Role, {
                foreignKey: "role_id"
            });

            User.belongsTo(models.Membership, {
                foreignKey: "membership_id"
            });

            User.hasMany(models.Order, {
                foreignKey: "user_id"
            });

            User.hasOne(models.Cart, {
                foreignKey: "user_id"
            });
        };

        return User;
}