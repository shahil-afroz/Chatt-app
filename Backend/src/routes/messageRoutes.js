import express from "express";
import { getMessage, getUsersforSidebars, sendMessage } from "../controllers/messageController.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router =express.Router();




router.get("/users",protectRoute,getUsersforSidebars)
router.get("/:id",protectRoute,getMessage)
router.post("/send/:id",protectRoute,sendMessage)
export default router;