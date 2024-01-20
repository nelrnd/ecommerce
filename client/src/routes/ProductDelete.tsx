import { useNavigate, useParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import axios from "../axios.ts"
import NotFound from "./NotFound"

export default function ProductDelete() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, loading] = useFetch(`/product/${slug}`)

  function handleClick() {
    axios
      .delete(`/product/${slug}`)
      .catch((err) => console.log(err))
      .finally(() => navigate(-1))
  }

  if (!product) {
    return <NotFound />
  }

  return (
    <div className="max-w-[64rem] m-auto bg-white rounded">
      <div className="max-w-[52rem] m-auto">
        <header className="p-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Delete product</h1>
        </header>
        <main className="p-8 pt-0">
          <p className="text-gray-600">Do you really wish to delete that product?</p>
          <button onClick={handleClick} className="mt-4 px-6 py-3 bg-red-600 text-white hover:bg-red-700 rounded">
            Delete
          </button>
        </main>
      </div>
    </div>
  )
}
