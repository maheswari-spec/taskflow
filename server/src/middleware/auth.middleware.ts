import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

interface JwtPayload {
  userId: number
}

export interface AuthRequest extends Request {
  user?: JwtPayload
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    // check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized",
      })
    }

    // extract token
    const token = authHeader.split(" ")[1]

    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    // attach user data
    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    })
  }
}