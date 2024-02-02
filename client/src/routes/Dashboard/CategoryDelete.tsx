import useFetch from "../../hooks/useFetch"
import axios from "../../axios"
import { useNavigate, useParams } from "react-router-dom"
import NotFound from "../NotFound"
import { Button } from "@/components/ui/button"

export default function CategoryDelete() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [category, loading] = useFetch(`/category/${slug}`)

  function handleClick() {
    axios
      .delete(`/category/${slug}`)
      .then(() => navigate(-1))
      .catch((err) => console.log(err))
  }

  if (loading) return null

  if (!category) {
    return <NotFound />
  }

  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Delete category</h1>
      </header>
      <section className="bg-white mx-12 mb-12 p-12 border border-gray-200 rounded-lg">
        <p className="text-gray-600 mb-4">
          Do you really wish to delete "<span className="text-black">{category.name}</span>" category?
        </p>
        <Button variant="destructive" onClick={handleClick}>
          Delete
        </Button>
      </section>
    </div>
  )
}
