import { Router, IRouter, Request, Response } from "express";
import { IUser } from "../models/User";
import orderService from "../services/orderService";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const orderRouter: IRouter = Router();

// POST /api/order - to place an order
// We need to be authenticated here - extractUserMiddleware will ensure it
// Takes - { items[]: [orderItems], discount?: number, total: number }
orderRouter.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    // We just extract the discount and total here, we wont be using it for anything, because dont trust user input
    // It would still be a good idea to send it to the backend despite us not using it, incase we have to deal with live price change, or other inconsistencies
    const { items, DANGEROUSdiscount, DANGEROUStotal } = req.body;
    if (!items || items.length === 0 || !DANGEROUStotal) {
      return res.status(400).json({ error: "Items and total are required" });
    }
    
    // Extra check to ensue we're authenticated
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "Please try logging in again" });
    }
    const userId = req.user.id;

    // Create the order
    const orderAndItems = await orderService.createOrder(userId, items);
    if (!orderAndItems || !orderAndItems.order || !orderAndItems.orderItems) {
      throw new Error("Order creation failed");
    }

    // If this user




  } catch (error) {
    const str = "Encountered an error While creating the order";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

export default orderRouter;
