import { Link, Outlet } from "react-router-dom"
import { BiSolidHome, BiGridAlt, BiPlus, BiShow } from "react-icons/bi"
import useFetch from "../hooks/useFetch"

const tabs = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <BiSolidHome />,
  },
  {
    name: "Products",
    href: "/dashboard/product",
    icon: <BiGridAlt />,
  },
  {
    name: "Create product",
    href: "/dashboard/product/create",
    icon: <BiPlus />,
  },
]

function DashboardSidebar() {
  return (
    <nav className="w-[20rem] bg-blue-700 p-8 shrink-0">
      <ul className="flex flex-col gap-1">
        {tabs.map((t) => (
          <DashboardSidebarTab key={t.name} tab={t} />
        ))}
      </ul>
    </nav>
  )
}

function DashboardSidebarTab({ tab }) {
  return (
    <li className="rounded hover:bg-blue-600 text-gray-200">
      <Link to={tab.href} className="block p-4">
        <div className="flex items-center gap-2">
          {tab.icon}
          <span>{tab.name}</span>
        </div>
      </Link>
    </li>
  )
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <DashboardSidebar />
      <div className="px-8 py-12 flex-1">
        <Outlet />
      </div>
    </div>
  )
}

export function DashboardIndex() {
  return (
    <div className="max-w-[64rem] m-auto bg-white rounded">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Dashboard</h1>
      </header>
    </div>
  )
}

export function DashboardProducts() {
  const [products, loading] = useFetch("/product")

  console.log(products)

  return (
    <div className="max-w-[64rem] m-auto bg-white rounded">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Products</h1>
      </header>
      <main className="p-8 pt-0">
        {products && (
          <div className="flex flex-col gap-2">
            {products.map((p) => (
              <DashboardProductTab key={p._id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function DashboardProductTab({ product }) {
  return (
    <div className="p-8 border-2 border-gray-200 rounded">
      <div className="flex items-baseline justify-between gap-4">
        <Link to={`/dashboard/product/${product.slug}`} className="hover:underline">
          {product.name}
        </Link>
        <Link to={`/product/${product.slug}`}>
          <div className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 flex items-center gap-2">
            <BiShow />
            <span>PREVIEW</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
