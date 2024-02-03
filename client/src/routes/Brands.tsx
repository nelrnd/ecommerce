import { Link, useLoaderData } from "react-router-dom"

export default function Brands() {
  const brands = useLoaderData()

  return (
    <div className="w-[64rem] mx-auto">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">All brands</h1>
      </header>
      <main className="p-8 pt-0 mb-16">
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
    </div>
  )
}
