import { Link, useParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import NotFound from "../routes/NotFound"
import { ProductCard } from "./Product"
import { useState } from "react"

const API_BASE = import.meta.env.VITE_API_BASE

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

export function CategoryList() {
  const [categories, loading] = useFetch("/category")

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="w-[64rem] mx-auto">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">All categories</h1>
      </header>
      <main className="p-8 pt-0">
        {categories && (
          <div className="grid grid-cols-2 gap-4">
            {categories.map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
