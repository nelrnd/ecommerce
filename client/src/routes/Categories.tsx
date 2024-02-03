import CategoryCard from "@/components/CategoryCard"
import { useLoaderData } from "react-router-dom"

export default function Categories() {
  const categories = useLoaderData()

  return (
    <div className="w-[64rem] mx-auto">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">All categories</h1>
      </header>
      <main className="p-8 pt-0 mb-16">
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </main>
    </div>
  )
}
