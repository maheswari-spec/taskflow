import { useEffect, useState } from "react"
import axios from "axios"
import { socket } from "../socket"
import { useNavigate, useParams } from "react-router-dom"
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd"

interface Task {
  id: number
  title: string
  description: string
  priority: string
  status: string
  ticketKey?: string
  type: string
  dueDate?: string

  assignedTo?: {
    id: number
    name: string
    email: string
  }
}

const ProjectDetails = () => {
  const { id } = useParams()

  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [workspaceId, setWorkspaceId] = useState<number>()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)


  const [search, setSearch] = useState("")
const [priorityFilter, setPriorityFilter] = useState("")
const [typeFilter, setTypeFilter] = useState("")
const [showOverdueOnly, setShowOverdueOnly] = useState(false)

 

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assignedToId: "",
    type: "TASK",
    dueDate: "",
    
  })

  const fetchProject = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/project/single/${id}`
    )

    setWorkspaceId(response.data.workspaceId)
  }

  const fetchTasks = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/task/${id}`
    )

    setTasks(response.data)
  }

  const fetchMembers = async () => {
    if (!workspaceId) return

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/member/${workspaceId}`
    )

    setMembers(response.data)
  }





  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCreateTask = async () => {
    await axios.post(
     `${import.meta.env.VITE_API_URL}/api/task/create`,
      {
        ...formData,
        projectId: Number(id),
        assignedToId: formData.assignedToId
          ? Number(formData.assignedToId)
          : null,
      }
    )

    fetchTasks()
    setOpen(false)

    setFormData({
      title: "",
      description: "",
      priority: "MEDIUM",
      assignedToId: "",
      type: "TASK",
      dueDate: "",
    })
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const taskId = Number(result.draggableId)
    const newStatus = result.destination.droppableId

    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/task/status/${taskId}`,
      {
        status: newStatus,
      }
    )

    fetchTasks()
  }

  useEffect(() => {
    const user = JSON.parse(
      sessionStorage.getItem("user") || "{}"
    )

    if (!socket.connected && user.id) {
      socket.auth = { userId: user.id }
      socket.connect()
    }
  }, [])

  useEffect(() => {
    fetchTasks()
    fetchProject()
  }, [])

  useEffect(() => {
    if (workspaceId) {
      fetchMembers()
    }
  }, [workspaceId])

  useEffect(() => {
    socket.on("taskUpdated", () => {
      fetchTasks()
    })

    return () => {
      socket.off("taskUpdated")
    }
  }, [])





  
  const isOverdue = (dueDate?: string) => {
  if (!dueDate) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const taskDate = new Date(dueDate)
  taskDate.setHours(0, 0, 0, 0)

  return taskDate < today
}

  const getTypeStyle = (type: string) => {
    if (type === "BUG") return "bg-red-100 text-red-700"
    if (type === "EPIC") return "bg-purple-100 text-purple-700"
    if (type === "STORY") return "bg-blue-100 text-blue-700"
    return "bg-gray-100 text-gray-700"
  }
  const getFilteredTasks = (status: string) => {
  return tasks
    .filter((task) => task.status === status)
    .filter((task) => {
      const searchValue = search.toLowerCase()

      return (
        task.title.toLowerCase().includes(searchValue) ||
        task.ticketKey
          ?.toLowerCase()
          .includes(searchValue)
      )
    })
    .filter((task) =>
      priorityFilter
        ? task.priority === priorityFilter
        : true
    )
    .filter((task) =>
      typeFilter ? task.type === typeFilter : true
    )
    .filter((task) =>
      showOverdueOnly ? isOverdue(task.dueDate) : true
    )
}


 return (
  <div className="min-h-screen bg-slate-950 text-slate-100">

    {/* HEADER */}
    <div className="
      bg-slate-900/80
      border-b
      border-slate-800
      px-6
      py-5
      backdrop-blur-xl
      sticky
      top-0
      z-40
    ">
      <h1 className="text-3xl font-bold text-blue-500">
        Project Tasks
      </h1>
    </div>

    <div className="p-8">

      {/* TOP SECTION */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-3xl font-bold">
            Kanban Board
          </h2>

          <p className="text-slate-400 mt-1">
            Manage project workflow
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="
            bg-blue-600
            hover:bg-blue-700
            transition
            text-white
            px-5
            py-3
            rounded-xl
            shadow-lg
            shadow-blue-500/20
          "
        >
          + Create Ticket
        </button>

      </div>

      {/* FILTERS */}
      <div className="
        bg-slate-900
        border
        border-slate-800
        p-5
        rounded-2xl
        shadow-xl
        mb-8
        grid
        grid-cols-1
        md:grid-cols-4
        gap-4
      ">

        <input
          type="text"
          placeholder="Search ticket..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            bg-slate-800
            border
            border-slate-700
            text-slate-100
            placeholder:text-slate-500
            p-3
            rounded-xl
            outline-none
            focus:border-blue-500
          "
        />

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="
            bg-slate-800
            border
            border-slate-700
            text-slate-100
            p-3
            rounded-xl
            outline-none
            focus:border-blue-500
          "
        >
          <option value="">All Priority</option>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="
            bg-slate-800
            border
            border-slate-700
            text-slate-100
            p-3
            rounded-xl
            outline-none
            focus:border-blue-500
          "
        >
          <option value="">All Type</option>
          <option value="TASK">TASK</option>
          <option value="BUG">BUG</option>
          <option value="STORY">STORY</option>
          <option value="EPIC">EPIC</option>
        </select>

        <button
          onClick={() =>
            setShowOverdueOnly(!showOverdueOnly)
          }
          className={`
            rounded-xl
            px-4
            py-3
            transition
            ${
              showOverdueOnly
                ? "bg-red-500 text-white"
                : "bg-slate-800 text-slate-200"
            }
          `}
        >
          Overdue Only
        </button>

      </div>

      {/* KANBAN */}
      <DragDropContext onDragEnd={handleDragEnd}>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {["TODO", "IN_PROGRESS", "DONE"].map(
            (status) => (
              <div
                key={status}
                className="
                  bg-slate-900
                  border
                  border-slate-800
                  rounded-2xl
                  p-5
                "
              >

                <h2 className="
                  text-xl
                  font-bold
                  mb-5
                  text-slate-100
                ">
                  {status.replace("_", " ")}
                </h2>

                <Droppable droppableId={status}>

                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="
                        flex
                        flex-col
                        gap-4
                        min-h-[500px]
                      "
                    >

                      {getFilteredTasks(status).map(
                        (task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={String(task.id)}
                            index={index}
                          >

                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                onClick={() =>
                                  navigate(`/ticket/${task.id}`)
                                }
                                className="
                                  bg-slate-800
                                  border
                                  border-slate-700
                                  p-4
                                  rounded-xl
                                  shadow-lg
                                  hover:border-blue-500/60
                                  hover:-translate-y-1
                                  transition-all
                                  duration-300
                                  cursor-pointer
                                "
                              >

                                <div className="
                                  flex
                                  justify-between
                                  items-center
                                  mb-2
                                ">

                                  <h3 className="
                                    font-bold
                                    text-blue-400
                                  ">
                                    {task.ticketKey}
                                  </h3>

                                  <span
                                    className={`
                                      text-xs
                                      px-2
                                      py-1
                                      rounded
                                      ${getTypeStyle(task.type)}
                                    `}
                                  >
                                    {task.type}
                                  </span>

                                </div>

                                <h2 className="
                                  font-semibold
                                  text-slate-100
                                ">
                                  {task.title}
                                </h2>

                                <p className="
                                  text-sm
                                  text-slate-400
                                  mt-1
                                ">
                                  {task.description}
                                </p>

                                <div className="
                                  flex
                                  justify-between
                                  mt-3
                                  text-sm
                                ">

                                  <span className="text-slate-300">
                                    {task.priority}
                                  </span>

                                  {task.dueDate && (
                                    <span
                                      className={
                                        isOverdue(task.dueDate)
                                          ? "text-red-500"
                                          : "text-slate-500"
                                      }
                                    >
                                      {task.dueDate}
                                    </span>
                                  )}

                                </div>

                                {task.assignedTo && (
                                  <p className="
                                    text-sm
                                    mt-2
                                    text-blue-400
                                  ">
                                    {task.assignedTo.name}
                                  </p>
                                )}

                              </div>
                            )}

                          </Draggable>
                        )
                      )}

                      {provided.placeholder}

                    </div>
                  )}

                </Droppable>

              </div>
            )
          )}

        </div>

      </DragDropContext>

    </div>

    {/* CREATE TASK MODAL */}
    {open && (
      <div className="
        fixed
        inset-0
        bg-black/70
        flex
        items-center
        justify-center
        z-50
      ">

        <div className="
          bg-slate-900
          border
          border-slate-700
          w-[400px]
          p-6
          rounded-2xl
          shadow-2xl
        ">

          <h2 className="text-2xl font-bold mb-5">
            Create Ticket
          </h2>

          <div className="flex flex-col gap-4">

            <input
              type="text"
              name="title"
              placeholder="Ticket Title"
              value={formData.title}
              onChange={handleChange}
              className="
                bg-slate-800
                border
                border-slate-700
                text-slate-100
                p-3
                rounded-xl
                outline-none
                focus:border-blue-500
              "
            />

            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="
                bg-slate-800
                border
                border-slate-700
                text-slate-100
                p-3
                rounded-xl
                outline-none
                focus:border-blue-500
              "
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="
                bg-slate-800
                border
                border-slate-700
                text-slate-100
                p-3
                rounded-xl
              "
            >
              <option value="TASK">TASK</option>
              <option value="BUG">BUG</option>
              <option value="STORY">STORY</option>
              <option value="EPIC">EPIC</option>
            </select>

            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="
                bg-slate-800
                border
                border-slate-700
                text-slate-100
                p-3
                rounded-xl
              "
            />

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="
                bg-slate-800
                border
                border-slate-700
                text-slate-100
                p-3
                rounded-xl
              "
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            <select
              name="assignedToId"
              value={formData.assignedToId}
              onChange={handleChange}
              className="
                bg-slate-800
                border
                border-slate-700
                text-slate-100
                p-3
                rounded-xl
              "
            >
              <option value="">Assign Member</option>

              {members.map((member) => (
                <option
                  key={member.user.id}
                  value={member.user.id}
                >
                  {member.user.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleCreateTask}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                py-3
                rounded-xl
                transition
              "
            >
              Create
            </button>

            <button
              onClick={() => setOpen(false)}
              className="
                bg-slate-800
                hover:bg-slate-700
                text-slate-200
                py-3
                rounded-xl
                transition
              "
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

export default ProjectDetails