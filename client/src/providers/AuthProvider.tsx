import { createContext, useContext, useEffect, useMemo, useState } from "react"
import axios from "../axios"

const AuthContext = createContext({})

export default function AuthProvider({ children }) {
  const [token, setToken_] = useState(localStorage.getItem("token"))

  const setToken = (newToken: string) => {
    setToken_(newToken)
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token
      localStorage.setItem("token", token)
    } else {
      delete axios.defaults.headers.common["x-auth-token"]
      localStorage.removeItem("token")
    }
  }, [token])

  const contextValue = useMemo(() => ({ token, setToken }), [token])

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
