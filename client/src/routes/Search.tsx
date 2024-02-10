import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "../axios"
import { ProductGrid, Section } from "@/components/Layout"
import ProductCard from "@/components/ProductCard"

export default function Search() {
  const [searchParams] = useSearchParams()
  const term = searchParams.get("term")
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (term) {
      axios
        .get(`/search?term=${term}`)
        .then((res) => res.data)
        .then((results) => setResults(results))
        .catch((err) => console.log(err))
    } else {
      navigate("/")
    }
  }, [term, navigate])

  return (
    <Section>
      <header className="mb-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Search results for "{term}"</h1>
      </header>
      <main>
        <ProductGrid>
          {results.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </ProductGrid>
      </main>
    </Section>
  )
}
