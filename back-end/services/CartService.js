const crypto = require("crypto");

class CartService {
    constructor(db) {
        this.client = db.sequelize;
        this.Cart = db.Cart;
        this.Product = db.Product;
        this.CartItem = db.CartItem;
        this.Order = db.Order;
        this.OrderItem = db.OrderItem;
        this.User = db.User;
        this.Membership = db.Membership;
    }

    async addToCart(userId, product_id) {
        let cart = await this.Cart.findOne({ where: { user_id: userId } });

        if (!cart) {
            cart = await this.Cart.create({ user_id: userId });
        }

        const product = await this.Product.findByPk(product_id)

        if (!product) {
            throw new Error("Product not found.");
        }

        const item = await this.CartItem.findOne({
            where: { cart_id: cart.id, product_id }
        });

        if (item) {

            const newCartQuantity = item.quantity + 1;

            if (newCartQuantity > product.quantity) {
                throw new Error("Not enough products in stock.")
            }

            item.quantity = newCartQuantity;
            await item.save();

            return item;
        }

        if (product.quantity < 1) {
            throw new Error("Product out of stock.");
        }

        const newItem = await this.CartItem.create({
            cart_id: cart.id,
            product_id,
            quantity: 1,
            price: product.price
        });

        return newItem;
    }

    async getCart(userId) {
        const cart = await this.Cart.findOne({ 
            where: { user_id: userId },
            include: [
                {
                    model: this.CartItem,
                    include: [this.Product]
                }
            ]
        });

        if (!cart) {
            return {
                cart_id: null,
                items: [],
                cart_total: 0
            };
        };

        let cartTotal = 0;

        const items = cart.CartItems.map(i => {
            const total = i.quantity * i.price;
            cartTotal += total;

            return {
                product_id: i.product_id,
                name: i.Product.name,
                price: i.price,
                quantity: i.quantity,
                total
            };
        });

        return {
            cart_id: cart.id,
            items,
            cart_total: cartTotal
        }
    }

    async checkoutCart(userId) {
        const transaction = await this.client.transaction();

        try {
            const cart = await this.Cart.findOne({
                where: { user_id: userId },
                include: [
                    {
                        model: this.CartItem,
                        include: [this.Product]
                    }
                ],
                transaction
            });

            if (!cart || cart.CartItems.length === 0) {
                throw new Error("Cart not found or it is empty.")
            };

            let totalQuantity = 0;

            for (const item of cart.CartItems) {
                if (item.quantity > item.Product.quantity) {
                    throw new Error("Not enough stock: " + item.Product.name)
                }
            }

            const user = await this.User.findByPk(userId, {
                include: [this.Membership],
                transaction
            });

            const discount = await this.calculateDiscount(user, cart);
            const orderNum = crypto.randomBytes(4).toString("hex");

            const order = await this.Order.create({
                user_id: userId,
                status: "In Progress",
                order_number: orderNum,
                membership_name: user.Membership.name,
                membership_discount: user.Membership.discount,

                cart_total: discount.cartTotal,
                discount_amount: discount.discountAmount,
                final_total: discount.finalTotal
            }, { transaction });

            for (const item of cart.CartItems) {

                await this.OrderItem.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    product_name: item.Product.name,
                    quantity: item.quantity,
                    price: item.price
                }, { transaction });

                item.Product.quantity -= item.quantity;
                totalQuantity += item.quantity;

                await item.Product.save({
                    transaction
                });
            }

            user.total_items_purchased += totalQuantity;

            await this.updateMembership(user, transaction);

            await this.CartItem.destroy({
                where: { cart_id: cart.id },
                transaction
            });

            await this.Cart.destroy({
                where: { id: cart.id },
                transaction
            });

            await transaction.commit();

            return order;

        } catch(err) {
            
            await transaction.rollback();
            throw err;
        }
    }

    async calculateDiscount(user, cart) {
        let cartTotal = 0;

        for (const item of cart.CartItems) {
            cartTotal += item.price * item.quantity

        }

        let discountPercentage = 0;

        if (user.membership_id === 2) {
            discountPercentage = 15;
            
        } else if (user.membership_id === 3) {
            discountPercentage = 30;
        }

        const discountAmount = (cartTotal * discountPercentage) / 100;

        return {
            cartTotal,
            discountPercentage,
            discountAmount,
            finalTotal: cartTotal- discountAmount
        };
    }

    async updateMembership(user, transaction) {
        const upgradeBronze = 14;
        const upgradeSilver = 29;
        
        if (user.total_items_purchased > upgradeSilver) {
            user.membership_id = 3;

        } else if (user.total_items_purchased > upgradeBronze) {
            user.membership_id = 2;
        }

        await user.save({ transaction })

    }
}

module.exports = CartService;