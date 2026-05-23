import { Request, Response } from "express"
import prisma from "../prisma/prisma"

export const uploadAttachment = async (
  req: Request,
  res: Response
) => {
  try {
    const taskId = Number(req.body.taskId)

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      })
    }

    const attachment = await prisma.attachment.create({
      data: {
        fileName: req.file.originalname,
        fileUrl: req.file.path,
        fileType: req.file.mimetype,
        taskId,
      },
    })

    res.status(201).json(attachment)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const getAttachments = async (
  req: Request,
  res: Response
) => {
  try {
    const taskId = Number(req.params.taskId)

    const attachments = await prisma.attachment.findMany({
      where: {
        taskId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    res.status(200).json(attachments)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}

export const deleteAttachment = async (
  req: Request,
  res: Response
) => {
  try {
    const attachmentId = Number(req.params.id)

    await prisma.attachment.delete({
      where: {
        id: attachmentId,
      },
    })

    res.status(200).json({
      message: "Attachment deleted",
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      message: "Server error",
    })
  }
}