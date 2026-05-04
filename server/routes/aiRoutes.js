import express from "express";
import { managerInsight, parseLeave } from "../controllers/aiController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/parse-leave", protect, allowRoles("employee", "manager", "admin"), parseLeave);
router.post("/manager-insight", protect, allowRoles("manager", "admin"), managerInsight);

export default router;
