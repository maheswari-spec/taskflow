import { Request, Response } from "express"
import prisma from "../prisma/prisma"

export const getActivities = async (
  req: Request,
  res: Response
) => {
  try {
    const taskId = Number(req.params.taskId)

    const activities =
      await prisma.activity.findMany({
        where: {
          taskId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })

    res.status(200).json(activities)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}