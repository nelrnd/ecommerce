import { Link, useParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import NotFound from "../routes/NotFound"
import { ProductCard } from "./Product"

export default function Category() {
  const { slug } = useParams()
  const [data, loading] = useFetch(`/category/${slug}`)
  const category = data && data.category
  const products = data && data.category_products

  if (!category && !loading) {
    return <NotFound />
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="w-[64rem] mx-auto">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{category.name}</h1>
        <p className="mt-2 text-xl text-gray-600">
          {products.length} {products.length < 2 ? "item" : "items"}
        </p>
      </header>
      <main className="p-8 pt-0">
        {products && (
          <div className="grid grid-cols-3 gap-4 gap-y-8">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.slug}`}>
      <div className="group bg-gray-200 p-12 aspect-square rounded-xl flex items-end">
        <h1 className="text-4xl group-hover:underline">{category.name}</h1>
      </div>
    </Link>
  )
}
