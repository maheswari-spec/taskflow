import dotenv from "dotenv"
dotenv.config()

import http from "http"
import { Server } from "socket.io"
import app from "./app"

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
  },
})

const onlineUsers = new Map<string, string>()

const sendOnlineUsers = () => {
  io.emit("onlineUsers", Array.from(onlineUsers.keys()))
}

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId

  if (userId) {
    onlineUsers.set(String(userId), socket.id)
  }

  sendOnlineUsers()

  console.log("User connected:", userId)

  socket.on("getOnlineUsers", () => {
    socket.emit("onlineUsers", Array.from(onlineUsers.keys()))
  })

  socket.on("typing", (data) => {
    socket.broadcast.emit("userTyping", data)
  })

  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(String(userId))
    }

    sendOnlineUsers()

    console.log("User disconnected:", userId)
  })
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})