import { useAuth } from "@/providers/AuthProvider"
import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function AuthRoute() {
  const { user } = useAuth()
  const location = useLocation()
  const from = location.pathname

  if (!user) {
    return <Navigate to="/login" replace={true} state={{ from: from }} />
  }

  return <Outlet />
}
