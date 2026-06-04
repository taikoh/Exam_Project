module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define(
        "Role",
        {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true
            },
            name: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        }, {
            timestamps: true
        });

        Role.associate = (models) => {
            Role.hasMany(models.User, {
                foreignKey: "role_id"
            });
        };

        return Role;
}