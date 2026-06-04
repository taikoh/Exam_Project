class OrderService {
    constructor(db) {
        this.client = db.sequelize;
        this.Order = db.Order;
        this.OrderItem = db.OrderItem;
        this.Product = db.Product;
    }

    async getOrders(userId, adminUser) {
        // Admins can see all orders while users can only see their own.
        const adminOrUser = adminUser ? {} : { user_id: userId };

            const orders = await this.Order.findAll({
                where: adminOrUser,
                attributes: [
                    "id",
                    "order_number",
                    "status",
                    "discount_amount",
                    "final_total"
                ],

                include: [
                    {
                        model: this.OrderItem,
                        attributes: [
                            "quantity",
                            "price"
                        ],

                        include: [
                            {
                                model: this.Product,
                                attributes: [
                                    "name"
                                ]
                            }
                        ]
                    }
                ]
            });

        if (!orders) {
            throw new Error("No orders found.")
        }

        return orders;
    }

    async getOrderById(orderId, userId, adminUser) {
        // Admins can see all orders while users can only see their own.
        const adminOrUser = adminUser ? { id: orderId } : { user_id: userId, id: orderId };

        const order = await this.Order.findOne( {
            where: adminOrUser,
                attributes: [
                    "id",
                    "order_number",
                    "status",
                    "final_total"
                ],

                include: [
                    {
                        model: this.OrderItem,
                        attributes: [
                            "quantity",
                            "price"
                        ],

                        include: [
                            {
                                model: this.Product,
                                attributes: [
                                    "name"
                                ]
                            }
                        ]
                    }
                ]
        });

        if (!order) {
            throw new Error("Order not found.")
        }

        return order;
    }

    async updateStatus(orderId, status) {
        const statuses = [
            "Ordered",
            "In Progress",
            "Completed"
        ];

        if (!statuses.includes(status)) {
            throw new Error("Order status is invalid.")
        }

        const order = await this.Order.findByPk(orderId)

        if (!order) {
            throw new Error("Order does not exist.")
        }

        order.status = status;
        await order.save();

        return order;
    }
}

module.exports = OrderService;