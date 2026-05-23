import { Request, Response } from "express"
import prisma from "../prisma/prisma"
import { io } from "../server"

export const createComment = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      text,
      taskId,
      userId,
    } = req.body

    const comment =
      await prisma.comment.create({
        data: {
          text,
          taskId,
          userId,
        },

        include: {
          user: true,
        },
      })
      await prisma.activity.create({
        data: {
          action: `commented on ticket`,
          taskId,
          userId,
        },
      })

    res.status(201).json(comment)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })

  }
}

export const getComments = async (
  req: Request,
  res: Response
) => {
  try {

    const taskId = Number(req.params.id)

    const comments =
      await prisma.comment.findMany({
        where: {
          taskId,
        },

        include: {
          user: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      })
      io.emit("commentAdded", {
        taskId,
      })

    res.status(200).json(comments)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })

  }
}