import { Router } from "express"

import {
  uploadAttachment,
  getAttachments,
  deleteAttachment,
} from "../controllers/attachment.controller"

import upload from "../middleware/upload"

const router = Router()

router.post(
  "/upload",
  upload.single("attachment"),
  uploadAttachment
)

router.get(
  "/:taskId",
  getAttachments
)

router.delete("/:id", deleteAttachment)

export default router