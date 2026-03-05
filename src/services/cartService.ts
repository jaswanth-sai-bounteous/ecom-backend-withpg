import { prisma } from "../lib/prisma";

class CartService {
  /* ================= GET CART ================= */

  async getCart(userId: string) {
    return await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  /* ================= ADD TO CART ================= */

  async addToCart(
    userId: string,
    productId: string,
    quantity: number
  ) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    const itemTotal = product.price * quantity;

    // If cart doesn't exist → create new cart
    if (!cart) {
      return await prisma.cart.create({
        data: {
          userId,
          items: {
            create: {
              productId,
              quantity,
              totalPrice: itemTotal,
            },
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    }

    // Find existing item safely (typed)
    const existingItem = cart.items.find(
      (item: (typeof cart.items)[number]) =>
        item.productId === productId
    );

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
          totalPrice:
            (existingItem.quantity + quantity) * product.price,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          totalPrice: itemTotal,
        },
      });
    }

    return await this.getCart(userId);
  }

  /* ================= REMOVE FROM CART ================= */

  async removeFromCart(userId: string, productId: string) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find(
      (item: (typeof cart.items)[number]) =>
        item.productId === productId
    );

    if (!item) throw new Error("Item not in cart");

    await prisma.cartItem.delete({
      where: { id: item.id },
    });

    return await this.getCart(userId);
  }

  /* ================= UPDATE QUANTITY ================= */

  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number
  ) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) throw new Error("Cart not found");

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new Error("Product not found");

    const item = cart.items.find(
      (item: (typeof cart.items)[number]) =>
        item.productId === productId
    );

    if (!item) throw new Error("Item not in cart");

    await prisma.cartItem.update({
      where: { id: item.id },
      data: {
        quantity,
        totalPrice: quantity * product.price,
      },
    });

    return await this.getCart(userId);
  }
}

export default new CartService();