import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes"
import workspaceRoutes from "./routes/workspace.routes"
import projectRoutes from "./routes/project.routes"
import taskRoutes from "./routes/task.routes"
import memberRoutes from "./routes/member.routes"
import commentRoutes from "./routes/comment.routes"
import notificationRoutes from "./routes/notification.routes"
import activityRoutes from "./routes/activity.routes"
import attachmentRoutes from "./routes/attachment.routes"
import aiRoutes from "./routes/ai.route"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.get("/", (_, res) => {
  res.send("TeamSync API Running")
})
app.use("/api/workspace", workspaceRoutes)
app.use("/api/project", projectRoutes)
app.use("/api/task", taskRoutes)
app.use("/api/member", memberRoutes)
app.use(
  "/api/comment",
  commentRoutes
)
app.use("/api/notification", notificationRoutes)
app.use("/api/activity", activityRoutes)
app.use("/uploads", express.static("uploads"))
app.use("/api/attachment", attachmentRoutes)
app.use("/api/ai", aiRoutes)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

export default app