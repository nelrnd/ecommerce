import useFetch from "../hooks/useFetch"
import { ProductCard } from "../components/Product"
import { CategoryCard } from "../components/Category"

export default function Home() {
  const [products, pLoading] = useFetch("/product")
  const [categories, cLoading] = useFetch("/category")

  if (pLoading || cLoading) {
    return <p>Loading</p>
  }

  return (
    <div className="w-[64rem] m-auto">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Home</h1>
      </header>
      <section className="p-8 pt-0">
        {categories && (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        )}
      </section>
      <section className="p-8 pt-0">
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
