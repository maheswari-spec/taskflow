import express from "express"

import {
  addMember,
  getMembers,
} from "../controllers/member.controller"

const router = express.Router()

router.post("/add", addMember)

router.get("/:id", getMembers)

export default router