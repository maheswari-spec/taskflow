import { Router } from "express"

import {
  createTask,
  getAllTasks,
  getSingleTask,
  getTasks,
  updateTaskStatus
} from "../controllers/task.controller"

const router = Router()

router.post("/create", createTask)

router.get("/", getAllTasks)

router.get("/:id", getTasks)

router.put(
    "/status/:id",
    updateTaskStatus
  )
  router.get(
    "/single/:id",
    getSingleTask
  )

export default router