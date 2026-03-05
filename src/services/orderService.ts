import { prisma } from "../lib/prisma";

class OrderService {
  /* ================= CREATE ORDER ================= */
  async createOrder(
    userId: string,
    payment_method: string,
    expected_delivery: Date
  ) {
    // Fetch user's cart with product details
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    // Calculate total order amount
  const totalAmount = cart.items.reduce(
  (acc: number, item: typeof cart.items[number]) => acc + item.totalPrice,
  0
);

    // Create the order with items
    const order = await prisma.order.create({
      data: {
        userId,
        payment_method,
        expected_delivery,
        total_amount: totalAmount,
        items: {
          create: cart.items.map(
            (item: typeof cart.items[number]) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })
          ),
        },
      },
      include: { items: { include: { product: true } } },
    });

    // Clear the cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }

  /* ================= GET USER ORDERS ================= */
  async getUserOrders(userId: string) {
    return await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    });
  }

  /* ================= GET SINGLE ORDER ================= */
  async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: { include: { product: true } } },
    });

    if (!order) throw new Error("Order not found");

    return order;
  }
}

export default new OrderService();