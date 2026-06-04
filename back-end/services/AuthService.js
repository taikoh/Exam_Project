class AuthService {
	constructor(db) {
		this.client = db.sequelize;
		this.User = db.User;
		this.Role = db.Role;
		this.Membership = db.Membership;
	}

	async getOne(email) {
		return this.User.findOne({
			where: { email },
			include: this.Role,
		});
	}

	async create(userData) {
        const existingUser = await this.User.findOne({ where: { email: userData.email } })

        if (existingUser) {
            throw new Error ("User already exists.")
        }

		return this.User.create({
			...userData,
			role_id: 2,
			membership_id: 1,
		});
	}
}

module.exports = AuthService;