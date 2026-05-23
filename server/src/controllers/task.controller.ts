import { Request, Response } from "express"
import prisma from "../prisma/prisma"
import { io } from "../server"

export const createTask = async (
  req: Request,
  res: Response
) => {
  try {

    const {
      title,
      description,
      projectId,
      priority,
      type,
dueDate,
      assignedToId,
    } = req.body
    const taskCount = await prisma.task.count()

    const ticketKey = `TS-${taskCount + 1}`
    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        priority,
        ticketKey,
        type,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedToId:
          assignedToId || null,
      },

      include: {
        assignedTo: true,
      },
    })

    io.emit("taskUpdated")
    if (assignedToId) {
      const project = await prisma.project.findUnique({
        where: {
          id: Number(projectId),
        },
        include: {
          workspace: true,
        },
      })
    
      const notification = await prisma.notification.create({
        data: {
          userId: Number(assignedToId),
          message: `You have been assigned "${title}" in project "${project?.name}" under workspace "${project?.workspace.name}".`,
        },
      })
    
      io.emit("notificationCreated", notification)
    }
    await prisma.activity.create({
      data: {
        action: `created ticket ${task.ticketKey}`,
        taskId: task.id,
        userId: Number(assignedToId),
      },
    })

    res.status(201).json(task)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })

  }
}

export const getTasks = async (
  req: Request,
  res: Response
) => {
  try {

    const projectId = Number(
      req.params.id
    )

    const tasks =
      await prisma.task.findMany({
        where: {
          projectId,
        },

        include: {
          assignedTo: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      })

    res.status(200).json(tasks)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })

  }
}

export const updateTaskStatus = async (
  req: Request,
  res: Response
) => {
  try {

    const { status } = req.body

    const taskId = Number(
      req.params.id
    )

    const updatedTask =
      await prisma.task.update({
        where: {
          id: taskId,
        },

        data: {
          status,
        },

        include: {
          assignedTo: true,
        },
      })

    io.emit("taskUpdated")
    await prisma.activity.create({
      data: {
        action: `moved ticket to ${status}`,
        taskId: updatedTask.id,
        userId: updatedTask.assignedToId!,
      },
    })

    res.status(200).json(updatedTask)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })

  }
}

export const getSingleTask = async (
  req: Request,
  res: Response
) => {

  try {

    const taskId = Number(req.params.id)

    const task =
      await prisma.task.findUnique({
        where: {
          id: taskId,
        },

        include: {
          assignedTo: true,
        },
      })

    res.status(200).json(task)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })

  }
}

export const getAllTasks = async (
  req: Request,
  res: Response
) => {

  try {

    const tasks = await prisma.task.findMany({

      include: {
        assignedTo: true,
        project: true,
      },

      orderBy: {
        createdAt: "desc",
      },

    })

    res.status(200).json(tasks)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })

  }
}
