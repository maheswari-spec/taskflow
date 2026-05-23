import { useNavigate } from "react-router-dom"

const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <h1 className="text-2xl font-bold">
          TaskFlow
        </h1>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-900"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-28">

        <h1 className="text-5xl font-bold max-w-3xl leading-tight">
          Manage Projects, Teams & Tasks
          in One Place
        </h1>

        <p className="text-gray-400 mt-6 text-lg max-w-xl">
          Real-time collaboration platform with
          authentication, workspaces, role management,
          chat, and project tracking.
        </p>

        <div className="flex gap-4 mt-10">

          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-blue-600 rounded-lg text-lg hover:bg-blue-700"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 border border-gray-600 rounded-lg text-lg hover:bg-gray-900"
          >
            Login
          </button>

        </div>

      </div>
    </div>
  )
}

export default LandingPage