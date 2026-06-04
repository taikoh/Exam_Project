module.exports = (sequelize, Sequelize) => {
    const Category = sequelize.define(
        "Category",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            is_deleted: {
                type: Sequelize.DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            tableName: "Categories",
            timestamps: true
        });

        Category.associate = (models) => {
            Category.hasMany(models.Product, {
                foreignKey: "category_id"
            });
        }

        return Category;
}