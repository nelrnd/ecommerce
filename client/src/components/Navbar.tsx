import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="h-[6rem] px-8 lg:px-16 xl:px-24 border border-b-gray-200 flex items-center justify-between">
      <Link to="/">
        <h3>E-Commerce</h3>
      </Link>
      <ul className="flex item-baseline gap-8">
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>
      </ul>
    </nav>
  )
}
