import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
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

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        formData
      )

      toast.success(response.data.message);
      navigate("/login")
    } catch (error: any) {
        toast.error(error.response.data.message)
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
          TaskFlow
        </h1>

        <p className="
          text-center
          text-slate-400
          mt-3
        ">
          Create your workspace account
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
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
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
            placeholder="Create a password"
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
          onClick={handleSignup}
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
          Create Account
        </button>

        <p className="
          text-center
          text-slate-400
          mt-3
        ">
          Already have an account?{" "}

          <Link
            to="/login"
            className="
              text-blue-500
              hover:text-blue-400
              font-semibold
            "
          >
            Login
          </Link>
        </p>

      </div>

    </div>

  </div>
)
}

export default Signup