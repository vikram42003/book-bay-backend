import { Router, IRouter, Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string; username: string };
}

const orderRouter: IRouter = Router();

// POST /api/order - to place an order
// We need to be authenticated here - extractUserMiddleware will ensure it
// Takes - { items[]: [orderItems], discount?: number, total: number }
orderRouter.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, discount, total } = req.body;
    if (!items || items.length === 0 || !total) {
      return res.status(400).json({ error: "Items and total are required" });
    }
    
    // Extra check to ensue we're authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "Please try logging in again" });
    }
    const userId = req.user.id;

    const order = await orderService.createOrder(userId, items, discount, total);







  } catch (error) {
    const str = "Encountered an error While creating the order";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

export default orderRouter;
