import { Router } from "express"

import {
  createProject,
  getProjects,
  getSingleProject
} from "../controllers/project.controller"

const router = Router()

router.post("/create", createProject)

router.get("/:id", getProjects)
router.get(
  "/single/:id",
  getSingleProject

)

export default router