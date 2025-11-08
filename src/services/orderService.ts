import { Order, IOrder } from "../models/Order";
import { OrderItem, IOrderItem } from "../models/OrderItem";
import { Book, IBook } from "../models/Book";
import { OrderItemInput } from "../types/types";

const createOrder = async (
  userId: string,
  items: OrderItemInput[]
): Promise<{ order: IOrder; orderItems: IOrderItem[] }> => {
  let total = 0;

  const booksMap: Map<string, IBook> = new Map();

  // First, ensure that all books are valid and calculate the total (since we need it to create the Order, which muse be created before orderItems)
  await Promise.all(
    items.map(async (item) => {
      const book = await Book.findById(item.bookId);
      if (!book) {
        throw new Error(`Book with ID ${item.bookId} not found`);
      }
      booksMap.set(item.bookId, book);
      total += book.price * item.quantity;
    })
  );

  const order = await Order.create({
    userId,
    total,
  });

  const orderItems = await Promise.all(
    items.map(async (item) => {
      const book = booksMap.get(item.bookId);
      return await OrderItem.create({
        orderId: order.id,
        bookId: item.bookId,
        quantity: item.quantity,
        priceAtPurchase: book!.price,
      });
    })
  );

  return {
    order,
    orderItems,
  };
};

export const orderService = {
  createOrder,
};

export default orderService;
