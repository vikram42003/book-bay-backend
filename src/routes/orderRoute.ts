import { Router, IRouter, Request, Response } from "express";
import { IUser } from "../models/User";
import orderService from "../services/orderService";
import referralService from "../services/referralService";

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

const orderRouter: IRouter = Router();

// GET /api/orders - get current users all orders
// We need to be authenticated here - extractUserMiddleware will ensure it
orderRouter.get("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "Please try logging in again" });
    }
    const user = req.user;

    const allOrders = await orderService.getAllOrders(user.id);
    res.json(allOrders);
  } catch (error) {
    const str = "Encountered an error While fetching orders";
    console.error(str, "\n", error);
    return res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

// POST /api/order - to place an order
// We need to be authenticated here - extractUserMiddleware will ensure it
// Takes - { items[]: [orderItems], discount?: number, total: number }
orderRouter.post("/", async (req: AuthenticatedRequest, res: Response) => {
  try {
    // We just extract the discount and total here, we wont be using it for anything, because dont trust user input
    // It would still be a good idea to send it to the backend despite us not using it, incase we have to deal with live price change, or other inconsistencies
    const { items, total } = req.body;
    if (!items || items.length === 0 || !total) {
      return res.status(400).json({ error: "Items and total are required" });
    }

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized", message: "Please try logging in again" });
    }
    const user = req.user;

    // Create the order
    const orderAndItems = await orderService.createOrder(user.id, items);
    if (!orderAndItems || !orderAndItems.order || !orderAndItems.orderItems) {
      throw new Error("Order creation failed");
    }

    // If this user hasnt claimed their referral credits then do the crediting
    let referral;
    if (user.referralStatus && user.referralStatus === "PENDING") {
      referral = await referralService.claimReferral(user);
    }

    const orderToReturn = {
      ...orderAndItems.order.toJSON(),
      orderItems: orderAndItems.orderItems,
    };

    res.status(201).json({
      order: orderToReturn,
      referral,
    });
  } catch (error) {
    const str = "Encountered an error While creating the order";
    console.error(str, "\n", error);
    res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

export default orderRouter;
