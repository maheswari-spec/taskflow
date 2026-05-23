import { Router } from "express"

import {
  getNotifications,
  markAsRead,
} from "../controllers/notification.controller"

const router = Router()

router.get("/:userId", getNotifications)

router.put("/read/:id", markAsRead)

export default router