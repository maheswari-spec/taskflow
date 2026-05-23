import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Bell, Check } from "lucide-react"

import { socket } from "../socket"

interface Workspace {
  id: number
  name: string
  description: string
}

interface Task {
  id: number
  status: string
  priority: string
  dueDate?: string
}

const Dashboard = () => {
  const navigate = useNavigate()

  const token = sessionStorage.getItem("token")

  const user = JSON.parse(
    sessionStorage.getItem("user") || "{}"
  )

  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [tasks, setTasks] = useState<Task[]>([])

  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/workspace/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setWorkspaces(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchAllTasks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/task`
      )

      setTasks(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notification/${user.id}`
      )

      setNotifications(
        response.data.filter(
          (notification: any) => !notification.isRead
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notification/read/${notificationId}`
      )

      setNotifications((prev) =>
        prev.filter(
          (notification) => notification.id !== notificationId
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreateWorkspace = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/workspace/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      fetchWorkspaces()
      setOpen(false)

      setFormData({
        name: "",
        description: "",
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")

    socket.disconnect()
    navigate("/login")
  }

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const taskDate = new Date(dueDate)
    taskDate.setHours(0, 0, 0, 0)

    return taskDate < today
  }

  const totalTasks = tasks.length
  const todoCount = tasks.filter((task) => task.status === "TODO").length
  const inProgressCount = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length
  const doneCount = tasks.filter((task) => task.status === "DONE").length
  const overdueCount = tasks.filter((task) =>
    isOverdue(task.dueDate)
  ).length

  const completionPercentage =
    totalTasks > 0
      ? Math.round((doneCount / totalTasks) * 100)
      : 0

  useEffect(() => {
    fetchWorkspaces()
    fetchNotifications()
    fetchAllTasks()

    socket.on("notificationCreated", (notification) => {
      if (notification.userId === user.id) {
        setNotifications((prev) => [notification, ...prev])
      }
    })

    return () => {
      socket.off("notificationCreated")
    }
  }, [])

 return (
  <div className="min-h-screen bg-slate-950 text-slate-100">
    <div className="bg-slate-900/80 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-2xl font-bold text-blue-500">
        TaskFlow
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative bg-slate-800 hover:bg-slate-700 transition p-3 rounded-full"
          >
            <Bell size={22} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-[360px] bg-slate-900 shadow-2xl rounded-2xl p-4 z-50 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-slate-100">
                  Notifications
                </h2>
                <span className="text-sm text-slate-400">
                  {notifications.length} New
                </span>
              </div>

              <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-10 text-slate-500">
                    No Notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="bg-slate-800 border border-slate-700 rounded-xl p-4"
                    >
                      <p className="text-sm text-slate-300 leading-6">
                        {notification.message}
                      </p>

                      <div className="flex justify-end mt-3">
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                        >
                          <Check size={16} />
                          Read
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 bg-slate-800 border border-slate-700 px-4 py-2 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold text-sm text-slate-100">
              {user.name}
            </p>
            <p className="text-xs text-slate-400">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="bg-slate-800 hover:bg-red-500 border border-slate-700 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </div>

    <div className="p-8">
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-2">
          Dashboard Analytics
        </h2>

        <p className="text-slate-400 mb-6">
          Track your workspace performance and task progress.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
          <AnalyticsCard title="Total Tickets" value={totalTasks} />
          <AnalyticsCard title="To Do" value={todoCount} />
          <AnalyticsCard title="In Progress" value={inProgressCount} />
          <AnalyticsCard title="Completed" value={doneCount} />
          <AnalyticsCard title="Overdue" value={overdueCount} />
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <div className="flex justify-between mb-3">
            <p className="font-semibold text-slate-200">
              Project Completion
            </p>
            <p className="font-bold text-blue-500">
              {completionPercentage}%
            </p>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">
            Your Workspaces
          </h2>
          <p className="text-slate-400 mt-1">
            Manage your teams and projects
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          + Create Workspace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            onClick={() => navigate(`/workspace/${workspace.id}`)}
            className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg hover:border-blue-500/60 hover:-translate-y-1 transition cursor-pointer"
          >
            <h3 className="text-2xl font-bold text-blue-500">
              {workspace.name}
            </h3>

            <p className="text-slate-400 mt-3">
              {workspace.description}
            </p>
          </div>
        ))}
      </div>
    </div>

    {open && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-slate-900 border border-slate-700 w-[400px] p-6 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-5">
            Create Workspace
          </h2>

          <div className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Workspace Name"
              value={formData.name}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 p-3 rounded-xl outline-none focus:border-blue-500"
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 p-3 rounded-xl outline-none focus:border-blue-500"
            />

            <button
              onClick={handleCreateWorkspace}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition"
            >
              Create
            </button>

            <button
              onClick={() => setOpen(false)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)
}

const AnalyticsCard = ({
  title,
  value,
}: {
  title: string
  value: number
}) => {
  return (
    <div className="
      bg-slate-900
      border
      border-slate-800
      p-5
      rounded-2xl
      shadow-lg
      hover:border-blue-500/50
      hover:-translate-y-1
      transition-all
      duration-300
    ">
      <p className="text-slate-400 text-sm font-medium">
        {title}
      </p>

      <h2 className="
        text-4xl
        font-bold
        text-blue-500
        mt-3
      ">
        {value}
      </h2>
    </div>
  )
}

export default Dashboard