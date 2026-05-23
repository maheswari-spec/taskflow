import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

import { socket } from "../socket"

const Login = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

  }

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      )

      sessionStorage.setItem(
        "token",
        response.data.token
      )

      sessionStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      )

      // SOCKET CONNECT
      socket.auth = {
        userId: response.data.user.id,
      }

      socket.connect()

      toast.success("Login successful")

      navigate("/dashboard")

    } catch (error: any) {

      toast.error(
        error.response?.data?.message ||
        "Login failed"
      )

    }
  }
 

 return (
  <div className="
    min-h-screen
    flex
    items-center
    justify-center
    bg-slate-950
    px-4
  ">

    <div className="
      w-full
      max-w-md
      bg-slate-900/80
      backdrop-blur-xl
      border
      border-slate-800
      rounded-3xl
      shadow-2xl
      p-8
    ">

      <div className="mb-8">

        <h1 className="
          text-4xl
          font-bold
          text-slate-100
          text-center
        ">
          Welcome Back
        </h1>

        <p className="
          text-slate-400
          text-center
          mt-3
        ">
          Login to continue managing your workspace
        </p>

      </div>

      <div className="flex flex-col gap-5">

        <div>
          <label className="
            text-sm
            text-slate-300
            mb-2
            block
          ">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className="
              w-full
              bg-slate-800
              border
              border-slate-700
              text-slate-100
              placeholder:text-slate-500
              p-4
              rounded-xl
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20
              transition
            "
          />
        </div>

        <div>
          <label className="
            text-sm
            text-slate-300
            mb-2
            block
          ">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
            className="
              w-full
              bg-slate-800
              border
              border-slate-700
              text-slate-100
              placeholder:text-slate-500
              p-4
              rounded-xl
              outline-none
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/20
              transition
            "
          />
        </div>

        <button
          onClick={handleLogin}
          className="
            mt-2
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-4
            rounded-xl
            font-semibold
            transition-all
            duration-300
            hover:scale-[1.02]
            shadow-lg
            shadow-blue-500/20
          "
        >
          Login
        </button>

        <p className="
          text-center
          text-slate-400
          mt-2
        ">
          Don’t have an account?{" "}

          <Link
            to="/signup"
            className="
              text-blue-500
              hover:text-blue-400
              font-semibold
            "
          >
            Signup
          </Link>
        </p>

      </div>

    </div>

  </div>
)
}

export default Login