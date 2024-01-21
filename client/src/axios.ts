import axios from "axios"

const API_BASE = import.meta.env.VITE_API_BASE

const instance = axios.create({
  baseURL: API_BASE + "/api",
})

export default instance
