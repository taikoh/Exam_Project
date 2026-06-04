class UserService {
	constructor(db) {
		this.client = db.sequelize;
		this.User = db.User;
		this.Role = db.Role;
		this.Membership = db.Membership;
	}

	async getUsers() {
		return this.User.findAll({
			attributes: [
				"id",
				"firstname",
				"lastname",
				"username",
				"email",
				"address",
				"city",
				"phone",
				"role_id"
			],
			
			include: [
				{
					model: this.Role,
					attributes: [
						"name"
					]
				},
				{
					model: this.Membership,
					attributes: [
						"name",
						"discount"
					]
				}
			]
		});
	}

    async updateUser({ id, firstname, lastname, username, email, address, city, phone, role_id }) {
        const updatedUser = await this.User.update(
			{
				firstname,
				lastname,
				username,
				email,
				address,
				city,
				phone,
				role_id
		},
		{
			where: { id }
		});

        if (updatedUser[0] === 0) {
            throw new Error("User not found.");
        }

        return await this.User.findByPk(id, {
			attributes: [
				"id",
				"firstname",
				"lastname",
				"username",
				"email",
				"address",
				"city",
				"phone"
			],

			include: [
				{
					model: this.Role,
					attributes: [
						"name"
					]
				},
				{
					model: this.Membership,
					attributes: [
						"name",
						"discount"
					]
				}
			]
		})
    }

	async deleteUser(id) {
		return this.User.destroy({
			where: { id },
		});
	}
}

module.exports = UserService;
