import express from "express"

import {
  createComment,
  getComments,
} from "../controllers/comment.controller"

const router = express.Router()

router.post(
  "/create",
  createComment
)

router.get(
  "/:id",
  getComments
)

export default router