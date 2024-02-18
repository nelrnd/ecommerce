import { useAuth } from "@/providers/AuthProvider"
import { Navigate, Outlet } from "react-router-dom"

export default function AdminRoute() {
  const { user } = useAuth()

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace={true} state={{ from: "/" }} />
  }

  return <Outlet />
}
