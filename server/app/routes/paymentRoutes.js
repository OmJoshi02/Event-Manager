import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { makePayment } from "../controllers/paymentController.js";

const router = Router()

router.post('/pay/:registrationId',authMiddleware,makePayment)

export default router