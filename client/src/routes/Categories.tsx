import CategoryCard from "@/components/CategoryCard"
import { Section } from "@/components/Layout"
import { useLoaderData } from "react-router-dom"
import axios from "../axios"

export async function loader() {
  const res = await axios.get("/category")
  return res.data
}

export default function Categories() {
  const categories = useLoaderData()

  return (
    <Section>
      <header className="mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">All categories</h1>
      </header>
      <main>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </main>
    </Section>
  )
}
