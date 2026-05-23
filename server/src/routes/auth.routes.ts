import { Router } from "express"
import { signup,login } from "../controllers/auth.controller"
import {
    authMiddleware,
    AuthRequest,
  } from "../middleware/auth.middleware"

const router = Router()

router.post("/signup", signup)
router.post("/login", login)

router.get(
    "/me",
    authMiddleware,
    (req: AuthRequest, res) => {
      res.json({
        message: "Protected route accessed",
        user: req.user,
      })
    }
  )
  

export default router