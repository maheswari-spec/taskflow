import React from "react"
import ReactDOM from "react-dom/client"
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Signup from "./pages/Signup"
import Login from "./pages/Login"
import "./index.css"
import { Toaster } from "react-hot-toast"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectedRoute"
import WorkspaceDetails from "./pages/WorkspaceDetails"
import ProjectDetails from "./pages/ProjectDetails"
import TicketDetails from "./pages/TicketDetails"
import LandingPage from "./pages/LandingPage"


ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
    <Toaster position="top-right" />
     <Routes>
            <Route path="/" element={<LandingPage />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/login" element={<Login />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/workspace/:id"
      element={
        <ProtectedRoute>
          <WorkspaceDetails />
        </ProtectedRoute>
      }
    />

    <Route
      path="/project/:id"
      element={
        <ProtectedRoute>
          <ProjectDetails />
        </ProtectedRoute>
      }
    />

    <Route
      path="/ticket/:id"
      element={
        <ProtectedRoute>
          <TicketDetails />
        </ProtectedRoute>
      }
    />
</Routes>
    </BrowserRouter>
  </React.StrictMode>
)