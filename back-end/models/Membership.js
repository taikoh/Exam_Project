module.exports = (sequelize, Sequelize) => {
    const Membership = sequelize.define(
        "Membership", 
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
            },
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            min_items: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            max_items: {
                type: Sequelize.DataTypes.INTEGER
            },
            discount: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            }
        }, {
            timestamps: true
        })

        Membership.associate = (models) => {
            Membership.hasMany(models.User, {
                foreignKey: "membership_id"
            });
        }

        return Membership;
}