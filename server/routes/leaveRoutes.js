import express from "express";
import {
  applyLeave,
  approveLeave,
  getMyLeaves,
  getPendingLeaves,
  rejectLeave,
} from "../controllers/leaveController.js";
import { allowRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, allowRoles("employee", "admin"), applyLeave);
router.get("/my", protect, allowRoles("employee", "admin"), getMyLeaves);
router.get("/pending", protect, allowRoles("manager", "admin"), getPendingLeaves);
router.patch("/:id/approve", protect, allowRoles("manager", "admin"), approveLeave);
router.patch("/:id/reject", protect, allowRoles("manager", "admin"), rejectLeave);

export default router;
