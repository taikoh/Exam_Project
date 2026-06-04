module.exports = (sequelize, Sequelize) => {
    const Brand = sequelize.define(
        "Brand",
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
            timestamps: true
        });

        Brand.associate = (models) => {
            Brand.hasMany(models.Product, {
                foreignKey: "brand_id"
            });
        }

        return Brand;
}