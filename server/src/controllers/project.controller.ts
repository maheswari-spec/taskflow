import { Request, Response } from "express"
import  prisma  from "../prisma/prisma"

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      description,
      workspaceId,
    } = req.body

    const project = await prisma.project.create({
      data: {
        name,
        description,
        workspaceId,
      },
    })

    res.status(201).json(project)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const getProjects = async (
  req: Request,
  res: Response
) => {
  try {
    const workspaceId = Number(req.params.id)

    const projects = await prisma.project.findMany({
      where: {
        workspaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.status(200).json(projects)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const getSingleProject = async (
  req: Request,
  res: Response
) => {
  try {

    const id = Number(req.params.id)

    const project =
      await prisma.project.findUnique({
        where: {
          id,
        },
      })

    res.status(200).json(project)

  } catch (error) {

    res.status(500).json({
      message: "Server error",
    })

  }
}

