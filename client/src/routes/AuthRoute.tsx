import { useAuth } from "@/providers/AuthProvider"
import { Navigate, Outlet } from "react-router-dom"

export default function AuthRoute() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace={true} />
  }

  return <Outlet />
}
