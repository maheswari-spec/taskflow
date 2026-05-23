import { Router } from "express"
import { createWorkspace , getWorkspaces } from "../controllers/workspace.controller"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

router.post(
  "/create",
  authMiddleware,
  createWorkspace
)
router.get(
    "/:userId",
    authMiddleware,
    getWorkspaces
  )


export default router