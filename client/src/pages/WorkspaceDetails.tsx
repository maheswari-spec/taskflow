import { useEffect, useState } from "react"

import {
  useNavigate,
  useParams,
} from "react-router-dom"

import axios from "axios"

import { socket } from "../socket"

interface Project {
  id: number
  name: string
  description: string
}

const WorkspaceDetails = () => {

  const { id } = useParams()

  const navigate = useNavigate()

  const [projects, setProjects] = useState<
    Project[]
  >([])

  const [members, setMembers] = useState<any[]>([])

  const [onlineUsers, setOnlineUsers] =
    useState<string[]>([])

  const [open, setOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

 const [memberData, setMemberData] = useState({
  userId: "",
  role: "MEMBER",
})

  const fetchProjects = async () => {

    try {

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/project/${id}`
      )

      setProjects(response.data)

    } catch (error) {

      console.log(error)

    }
  }

  const fetchMembers = async () => {

    try {

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/member/${id}`
      )

      setMembers(response.data)

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

  const handleCreateProject = async () => {

    try {

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/project/create`,
        {
          ...formData,
          workspaceId: Number(id),
        }
      )

      fetchProjects()

      setOpen(false)

      setFormData({
        name: "",
        description: "",
      })

    } catch (error) {

      console.log(error)

    }
  }

  const handleAddMember = async () => {

    try {

     await axios.post(
  `${import.meta.env.VITE_API_URL}/api/member/add`,
  {
    workspaceId: Number(id),
    userId: Number(memberData.userId),
    role: memberData.role,
  }
)

      fetchMembers()

    setMemberData({
  userId: "",
  role: "MEMBER",
})

    } catch (error) {

      console.log(error)

    }
  }

  useEffect(() => {

    fetchProjects()
    fetchMembers()

  }, [])
    const user = JSON.parse(
  sessionStorage.getItem("user") || "{}"
)

const currentUserRole =
  members.find(
    (member) =>
      member.user.id === user.id
  )?.role

  useEffect(() => {

    const user = JSON.parse(
      sessionStorage.getItem("user") || "{}"
    )
    

    if (user.id) {

      socket.auth = {
        userId: user.id,
      }

      if (!socket.connected) {
        socket.connect()
      }

      socket.emit("getOnlineUsers")

    }

    socket.on(
      "onlineUsers",
      (users) => {

        console.log(
          "online users:",
          users
        )

        setOnlineUsers(users)

      }
    )

    return () => {

      socket.off("onlineUsers")

    }

  }, [])

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
        Workspace #{id}
      </h1>

    </div>

    <div className="p-5 md:p-8">

      {/* TOP */}
      <div className="
        flex
        flex-col
        md:flex-row
        justify-between
        md:items-center
        gap-5
        mb-8
      ">

        <div>

          <h2 className="text-3xl font-bold">
            Projects
          </h2>

          <p className="text-slate-400 mt-1">
            Manage workspace projects
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
          + Create Project
        </button>

      </div>

      {/* PROJECTS */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
      ">

        {projects.map((project) => (

          <div
            key={project.id}
            onClick={() =>
              navigate(`/project/${project.id}`)
            }
            className="
              bg-slate-900
              border
              border-slate-800
              p-6
              rounded-2xl
              shadow-lg
              cursor-pointer
              hover:border-blue-500/60
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            <h3 className="
              text-2xl
              font-bold
              text-blue-400
            ">
              {project.name}
            </h3>

            <p className="
              text-slate-400
              mt-3
            ">
              {project.description}
            </p>

          </div>

        ))}

      </div>

      {/* MEMBERS */}
      <div className="
        bg-slate-900
        border
        border-slate-800
        p-6
        rounded-2xl
        shadow-xl
        mt-10
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-5
        ">
          Workspace Members
        </h2>

        {/* ADD MEMBER */}
        {currentUserRole === "ADMIN" && (

          <div className="
            flex
            flex-col
            md:flex-row
            gap-3
            mb-6
          ">

            <input
              type="number"
              placeholder="Enter User ID"
              value={memberData.userId}
              onChange={(e) =>
                setMemberData({
                  ...memberData,
                  userId: e.target.value,
                })
              }
              className="
                bg-slate-800
                border
                border-slate-700
                text-slate-100
                placeholder:text-slate-500
                p-3
                rounded-xl
                flex-1
                outline-none
                focus:border-blue-500
              "
            />

            <select
              value={memberData.role}
              onChange={(e) =>
                setMemberData({
                  ...memberData,
                  role: e.target.value,
                })
              }
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
              <option value="ADMIN">
                ADMIN
              </option>

              <option value="MANAGER">
                MANAGER
              </option>

              <option value="MEMBER">
                MEMBER
              </option>
            </select>

            <button
              onClick={handleAddMember}
              className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-5
                rounded-xl
                py-3
                transition
              "
            >
              Add Member
            </button>

          </div>

        )}

        {/* MEMBER LIST */}
        <div className="flex flex-col gap-4">

          {members.map((member) => (

            <div
              key={member.id}
              className="
                bg-slate-800
                border
                border-slate-700
                p-4
                rounded-xl
              "
            >

              <div className="
                flex
                items-center
                gap-2
              ">

                <span
                  className={`w-3 h-3 rounded-full ${
                    onlineUsers.includes(
                      String(member.user.id)
                    )
                      ? "bg-green-500"
                      : "bg-slate-500"
                  }`}
                />

                <h3 className="
                  font-bold
                  text-lg
                  text-slate-100
                ">
                  {member.user.name}
                </h3>

              </div>

              <p className="
                text-slate-400
                mt-1
              ">
                {member.user.email}
              </p>

              <p className="
                text-sm
                text-blue-400
                font-semibold
                mt-2
              ">
                {member.role}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

    {/* MODAL */}
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
          w-full
          max-w-[400px]
          p-6
          rounded-2xl
          shadow-2xl
        ">

          <h2 className="
            text-2xl
            font-bold
            mb-5
          ">
            Create Project
          </h2>

          <div className="
            flex
            flex-col
            gap-4
          ">

            <input
              type="text"
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleChange}
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
                placeholder:text-slate-500
                p-3
                rounded-xl
                outline-none
                focus:border-blue-500
              "
            />

            <button
              onClick={handleCreateProject}
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

export default WorkspaceDetails