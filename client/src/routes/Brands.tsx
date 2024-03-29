import { Section } from "@/components/Layout"
import { Link, useLoaderData } from "react-router-dom"
import axios from "../axios"

export async function loader() {
  const res = await axios.get(`/brand`)
  return res.data
}

export default function Brands() {
  const brands = useLoaderData()

  return (
    <Section>
      <header className="mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">All brands</h1>
      </header>
      <main>
        <ul className="space-y-4 columns-3">
          {brands.map((brand) => (
            <li key={brand._id}>
              <Link to={`/brand/${brand.slug}`} className="hover:underline">
                {brand.name}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </Section>
  )
}
