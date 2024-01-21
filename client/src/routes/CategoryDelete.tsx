import { useNavigate, useParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import axios from "../axios.ts"
import NotFound from "./NotFound"

export default function CategoryDelete() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [category, loading] = useFetch(`/category/${slug}`)

  function handleClick() {
    axios
      .delete(`/category/${slug}`)
      .catch((err) => console.log(err))
      .finally(() => navigate(-1))
  }

  if (!category && !loading) {
    return <NotFound />
  }

  return (
    <div className="max-w-[64rem] m-auto bg-white rounded">
      <div className="max-w-[52rem] m-auto">
        <header className="p-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Delete category</h1>
        </header>
        <main className="p-8 pt-0">
          <p className="text-gray-600">Do you really wish to delete that category?</p>
          <button onClick={handleClick} className="mt-4 px-6 py-3 bg-red-600 text-white hover:bg-red-700 rounded">
            Delete
          </button>
        </main>
      </div>
    </div>
  )
}
