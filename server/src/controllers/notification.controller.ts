import { Request, Response } from "express"
import prisma from "../prisma/prisma"

export const getNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = Number(req.params.userId)

    const notifications =
      await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      })

    res.status(200).json(notifications)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const markAsRead = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id)

    const notification =
      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      })

    res.status(200).json(notification)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}