import { Link } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_BASE

export default function CategoryCard({ category }) {
  return (
    <Link to={`/category/${category.slug}`}>
      <div className="group p-6 sm:p-12 aspect-square rounded-xl flex items-end relative overflow-hidden">
        <div className="bg-black opacity-15 absolute inset-0 -z-10" />
        <img
          className="block absolute inset-0 object-cover -z-20 transition-transform duration-300 group-hover:scale-105"
          src={API_BASE + "/" + category.image}
          alt=""
        />
        <div>
          <h1 className="font-bold text-3xl md:text-4xl text-white">{category.name}</h1>
          <p className="text-white mt-2 group-hover:underline">SHOP NOW</p>
        </div>
      </div>
    </Link>
  )
}
