import { Request, Response } from "express"
import prisma from "../prisma/prisma"

export const addMember = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      workspaceId,
      userId,
      role,
    } = req.body

    const existingMember =
      await prisma.workspaceMember.findFirst({
        where: {
          workspaceId,
          userId,
        },
      })

    if (existingMember) {
      const updatedMember =
        await prisma.workspaceMember.update({
          where: {
            id: existingMember.id,
          },
          data: {
            role: role || "MEMBER",
          },
          include: {
            user: true,
          },
        })

      return res.status(200).json(updatedMember)
    }

    const member =
      await prisma.workspaceMember.create({
        data: {
          workspaceId,
          userId,
          role: role || "MEMBER",
        },
        include: {
          user: true,
        },
      })

    return res.status(201).json(member)
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: "Server error",
    })
  }
}

export const getMembers = async (
  req: Request,
  res: Response
) => {
  try {
    const workspaceId = Number(req.params.id)

    const members =
      await prisma.workspaceMember.findMany({
        where: {
          workspaceId,
        },
        include: {
          user: true,
        },
      })

    return res.status(200).json(members)
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      message: "Server error",
    })
  }
}