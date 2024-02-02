import useFetch from "../../hooks/useFetch"
import axios from "../../axios"
import { useNavigate, useParams } from "react-router-dom"
import NotFound from "../NotFound"
import { Button } from "@/components/ui/button"

export default function ProductDelete() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, loading] = useFetch(`/product/${slug}`)

  function handleClick() {
    axios
      .delete(`/product/${slug}`)
      .then(() => navigate(-1))
      .catch((err) => console.log(err))
  }

  if (loading) return null

  if (!product) {
    return <NotFound />
  }

  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Delete product</h1>
      </header>
      <section className="bg-white mx-12 mb-12 p-12 border border-gray-200 rounded-lg">
        <p className="text-gray-600 mb-4">
          Do you really wish to delete "<span className="text-black">{product.name}</span>" product?
        </p>
        <Button variant="destructive" onClick={handleClick}>
          Delete
        </Button>
      </section>
    </div>
  )
}
