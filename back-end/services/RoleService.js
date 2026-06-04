class RoleService {
	constructor(db) {
		this.client = db.sequelize;
		this.Role = db.Role;
	}

    async getAllRoles() {
        return await this.Role.findAll();
    }

    async getRolesById(id) {
        return await this.Role.findByPk(id);
    }

}

module.exports = RoleService;