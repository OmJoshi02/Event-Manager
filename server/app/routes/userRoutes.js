import express from "express";
import { makeAdmin } from "../controllers/userController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";



const router = express.Router();

router.patch(
    "/:id/make-admin",
    authMiddleware,
    adminMiddleware,
    makeAdmin
);

export default router;