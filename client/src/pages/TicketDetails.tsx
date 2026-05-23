import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { socket } from "../socket"

const TicketDetails = () => {
  const { id } = useParams()

  const [ticket, setTicket] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [attachments, setAttachments] = useState<any[]>([])

  const [commentText, setCommentText] = useState("")
  const [typingUser, setTypingUser] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [attachmentSearch, setAttachmentSearch] = useState("")
  const [aiLoading, setAiLoading] = useState(false)

  const user = JSON.parse(
    sessionStorage.getItem("user") || "{}"
  )

  const fetchTicket = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task/single/${id}`
      )
      setTicket(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/comment/${id}`
      )
      setComments(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchActivities = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/activity/${id}`
      )
      setActivities(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAttachments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attachment/${id}`
      )
      setAttachments(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleAIAnalysis = async () => {
    try {
      setAiLoading(true)

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/ai/ticket-suggestions`,
        {
          title: ticket.title,
        }
      )

      setTicket((prev: any) => ({
        ...prev,
        priority: response.data.priority,
        type: response.data.type,
        description: response.data.description,
      }))
    } catch (error) {
      console.log(error)
    } finally {
      setAiLoading(false)
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) return

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comment/create`,
        {
          text: commentText,
          taskId: Number(id),
          userId: user.id,
        }
      )

      socket.emit("commentAdded", {
        taskId: Number(id),
      })

      setCommentText("")
      fetchComments()
      fetchActivities()
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      const uploadData = new FormData()
      uploadData.append("attachment", file)
      uploadData.append("taskId", String(id))

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/attachment/upload`,
        uploadData
      )

      setFile(null)
      fetchAttachments()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteAttachment = async (
    attachmentId: number
  ) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/attachment/${attachmentId}`
      )

      fetchAttachments()
    } catch (error) {
      console.log(error)
    }
  }

  const filteredAttachments = attachments.filter(
    (attachment) =>
      attachment.fileName
        .toLowerCase()
        .includes(attachmentSearch.toLowerCase())
  )

  useEffect(() => {
    fetchTicket()
    fetchComments()
    fetchActivities()
    fetchAttachments()
  }, [])

  useEffect(() => {
    if (!socket.connected && user.id) {
      socket.auth = {
        userId: user.id,
      }

      socket.connect()
    }

    socket.on("userTyping", (data) => {
      if (Number(data.taskId) === Number(id)) {
        setTypingUser(data.user)

        setTimeout(() => {
          setTypingUser("")
        }, 2000)
      }
    })

    socket.on("commentAdded", (data) => {
      if (Number(data.taskId) === Number(id)) {
        fetchComments()
        fetchActivities()
      }
    })

    return () => {
      socket.off("userTyping")
      socket.off("commentAdded")
    }
  }, [id])

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-start gap-6">
            <div>
              <div className="flex gap-3 mb-4">
                <span className="bg-blue-500/15 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                  {ticket.ticketKey}
                </span>

                <span className="bg-slate-800 text-slate-300 px-3 py-1 rounded-full text-sm font-medium">
                  {ticket.type}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-slate-100">
                {ticket.title}
              </h1>

              <p className="text-slate-400 mt-3 max-w-3xl">
                {ticket.description}
              </p>

              <button
                onClick={handleAIAnalysis}
                disabled={aiLoading}
                className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-3 rounded-xl transition shadow-lg shadow-blue-500/20"
              >
                {aiLoading ? "Analyzing..." : "AI Analyze Ticket"}
              </button>
            </div>

            <div className="text-right">
              <p className="text-red-400 font-bold">
                {ticket.priority}
              </p>

              <p className="text-slate-400 mt-2">
                {ticket.status}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div>
              <h2 className="font-bold mb-2 text-slate-200">
                Assignee
              </h2>

              <p className="bg-blue-500/15 text-blue-400 inline-block px-4 py-2 rounded-full">
                {ticket.assignedTo?.name || "Unassigned"}
              </p>
            </div>

            <div>
              <h2 className="font-bold mb-2 text-slate-200">
                Due Date
              </h2>

              <p className="text-slate-400">
                {ticket.dueDate
                  ? new Date(ticket.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-5">
            Attachments
          </h2>

          <div className="flex gap-3 mb-5">
            <input
              type="file"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="bg-slate-800 border border-slate-700 text-slate-100 p-3 rounded-xl flex-1"
            />

            <button
              onClick={handleUpload}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-xl transition"
            >
              Upload
            </button>
          </div>

          <input
            type="text"
            placeholder="Search file name..."
            value={attachmentSearch}
            onChange={(e) =>
              setAttachmentSearch(e.target.value)
            }
            className="bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 p-3 rounded-xl w-full mb-5 outline-none focus:border-blue-500"
          />

          <div className="flex flex-col gap-4">
            {filteredAttachments.length === 0 ? (
              <p className="text-slate-500">
                No attachments found
              </p>
            ) : (
              filteredAttachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="bg-slate-800 border border-slate-700 p-4 rounded-xl"
                >
                  {attachment.fileType.startsWith("image") && (
                    <img
                      src={attachment.fileUrl}
                      alt={attachment.fileName}
                      className="rounded-xl max-h-[300px] mb-3"
                    />
                  )}

                  <div className="flex justify-between items-center gap-4">
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 font-semibold break-all"
                    >
                      {attachment.fileName}
                    </a>

                    <button
                      onClick={() =>
                        handleDeleteAttachment(attachment.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-5">
            Activity Timeline
          </h2>

          <div className="flex flex-col gap-4">
            {activities.length === 0 ? (
              <p className="text-slate-500">
                No activities yet
              </p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-slate-800 border border-slate-700 p-4 rounded-xl"
                >
                  <p className="text-sm text-slate-300">
                    <span className="font-bold text-blue-400">
                      {activity.user.name}
                    </span>{" "}
                    {activity.action}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold mb-5">
            Comments
          </h2>

          <div className="flex flex-col gap-4">
            {comments.length === 0 ? (
              <p className="text-slate-500">
                No comments yet
              </p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-slate-800 border border-slate-700 p-4 rounded-xl"
                >
                  <h3 className="font-bold text-blue-400">
                    {comment.user.name}
                  </h3>

                  <p className="text-slate-300 mt-2">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {typingUser && typingUser !== user.name && (
              <p className="text-sm text-slate-500">
                {typingUser} is typing...
              </p>
            )}

            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => {
                setCommentText(e.target.value)

                socket.emit("typing", {
                  user: user.name,
                  taskId: Number(id),
                })
              }}
              className="bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 p-3 rounded-xl h-[120px] outline-none focus:border-blue-500"
            />

            <button
              onClick={handleAddComment}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
            >
              Send Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketDetails