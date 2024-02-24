import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import axios from "../axios"

export async function loader() {
  const [categories, brands] = await Promise.all([axios.get("/category?limit=5"), axios.get("/brand?limit=5")])

  return { categories: categories.data, brands: brands.data }
}

export default function Root() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
