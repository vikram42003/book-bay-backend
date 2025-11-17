import { Router, IRouter, Request, Response } from "express";
import referralService from "../services/referralService";

const referralRouter: IRouter = Router();

// GET /api/referrals/stats/:id - returns the total referred users and total converted users
referralRouter.get("/stats/:id", async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const id = req.params.id;
    const allReferrals = await referralService.getAllReferralsByReferrerId(id);
    const totalReferredUsers = allReferrals.length;
    const totalConvertedUsers = allReferrals.filter((referral) => referral.status === "CONVERTED").length;

    res.json({ total: totalReferredUsers, converted: totalConvertedUsers });
  } catch (error) {
    const str = "Encountered an error While fetching referral stats";
    console.error(str, "\n", error);
    return res.status(500).json({ error: "Internal Server Error", message: str });
  }
});

export default referralRouter;
