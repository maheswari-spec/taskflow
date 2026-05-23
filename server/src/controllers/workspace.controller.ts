import { Response } from "express"
import prisma from "../prisma/prisma"
import { AuthRequest } from "../middleware/auth.middleware"

export const createWorkspace = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const { name, description } = req.body

    const workspace =
      await prisma.workspace.create({
        data: {
          name,
          description,
          userId: req.user!.userId,
        },
      })
      await prisma.workspaceMember.create({
  data: {
    workspaceId: workspace.id,
    userId: req.user!.userId,
    role: "ADMIN",
  },
})

    res.status(201).json(workspace)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
      error,
    })

  }
}

export const getWorkspaces = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const userId = Number(
      req.params.userId
    )

    const workspaces =
      await prisma.workspace.findMany({
        where: {
          OR: [
            {
              userId: userId,
            },
            {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },

        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      })

    res.status(200).json(workspaces)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Server error",
    })

  }
}