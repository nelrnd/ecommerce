import { createContext, useContext, useEffect, useMemo, useState } from "react"
import axios from "../axios"

const AuthContext = createContext({})

export default function AuthProvider({ children }) {
  const [user, setUser_] = useState(localStorage.getItem("user"))

  const setUser = (user) => {
    setUser_(user)
  }

  useEffect(() => {
    if (user && user.token) {
      axios.defaults.headers.common["x-auth-token"] = user.token
      localStorage.setItem("user", user)
    } else {
      delete axios.defaults.headers.common["x-auth-token"]
      localStorage.removeItem("user")
    }
  }, [user])

  const contextValue = useMemo(() => ({ user, setUser }), [user])

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
