import ProductCard from "@/components/ProductCard"
import { useLoaderData } from "react-router-dom"

export default function Category() {
  const category = useLoaderData()

  return (
    <div className="w-[64rem] mx-auto">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{category.name}</h1>
        <p className="mt-2 text-xl text-gray-600">
          {category.products.length} {category.products.length < 2 ? "item" : "items"}
        </p>
      </header>
      <main className="p-8 pt-0">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8">
          {category.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </main>
    </div>
  )
}
