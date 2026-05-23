import { Router } from "express"

import {
  generateTicketSuggestions,
} from "../controllers/ai.controller"

const router = Router()

router.post(
  "/ticket-suggestions",
  generateTicketSuggestions
)

export default router