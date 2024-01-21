import useFetch from "../hooks/useFetch"
import { ProductCard } from "../components/Product"
import { CategoryCard } from "../components/Category"
import { Link } from "react-router-dom"

export default function Home() {
  const [products, pLoading] = useFetch("/product")
  const [categories, cLoading] = useFetch("/category")

  if (pLoading || cLoading) {
    return <p>Loading</p>
  }

  return (
    <div className="w-[64rem] m-auto">
      <section className="px-8 py-8">
        <header className="py-4">
          <div className="flex items-baseline justify-between">
            <h2 className="scroll-m-20 text-4xl font-extrabold tracking-tight mb-5">Categories</h2>
            <Link to="/category">
              <span className="text-gray-600 hover:underline">See All</span>
            </Link>
          </div>
        </header>
        {categories && (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        )}
      </section>
      <section className="px-8 py-32">
        <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight mb-4">Latest</h2>
        {products && (
          <div className="grid grid-cols-3 gap-4 gap-y-8">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
