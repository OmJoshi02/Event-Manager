import { Router } from "express";
import { getEventStats, getStats } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = Router();

router.get('/stats',authMiddleware,adminMiddleware ,getStats)

router.get('/event-stats', authMiddleware, adminMiddleware, getEventStats)

export default router;