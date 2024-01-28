import { Link, Outlet, useLocation } from "react-router-dom"
import {
  BiSolidHome,
  BiChart,
  BiCube,
  BiGridAlt,
  BiPurchaseTag,
  BiPlus,
  BiShow,
  BiTrash,
  BiLinkExternal,
  BiLogOut,
} from "react-icons/bi"
import useFetch from "../hooks/useFetch"

const tabs = {
  top: [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BiSolidHome />,
    },
    {
      name: "Orders",
      href: "/dashboard/order",
      icon: <BiChart />,
    },
    {
      name: "Products",
      href: "/dashboard/product",
      icon: <BiCube />,
    },
    {
      name: "Categories",
      href: "/dashboard/category",
      icon: <BiGridAlt />,
    },
    {
      name: "Brands",
      href: "/dashboard/brand",
      icon: <BiPurchaseTag />,
    },
  ],
  bottom: [
    {
      name: "Go to site",
      href: "/",
      icon: <BiLinkExternal />,
    },
    {
      name: "Log out",
      href: "/logout",
      icon: <BiLogOut />,
    },
  ],
}

function DashboardSidebar() {
  return (
    <nav className="w-[20rem] h-screen sticky top-0 bg-white p-8 shrink-0 border-r border-gray-200 flex flex-col gap-4">
      <h1 className="m-4">E-commerce</h1>
      <ul className="flex-1 flex flex-col gap-1">
        {tabs.top.map((t) => (
          <DashboardSidebarTab key={t.name} tab={t} />
        ))}
      </ul>
      <ul className="space-y-1">
        {tabs.bottom.map((t) => (
          <DashboardSidebarTab key={t.name} tab={t} />
        ))}
      </ul>
    </nav>
  )
}

function DashboardSidebarTab({ tab }) {
  const location = useLocation()
  const active = location.pathname === tab.href

  return (
    <li className={`rounded hover:bg-gray-100 text-gray-600 ${active ? "bg-gray-100" : "bg-white"}`}>
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
        <Link to={`/dashboard/product/${product.slug}/delete`}>
          <div className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 flex items-center gap-2">
            <BiTrash />
            <span>DELETE</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export function DashboardCategories() {
  const [categories, loading] = useFetch("/category")

  return (
    <div className="max-w-[64rem] m-auto bg-white rounded">
      <header className="p-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Categories</h1>
      </header>
      <main className="p-8 pt-0">
        {categories && (
          <div className="flex flex-col gap-2">
            {categories.map((c) => (
              <DashboardCategoryTab key={c._id} category={c} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function DashboardCategoryTab({ category }) {
  return (
    <div className="p-8 border-2 border-gray-200 rounded">
      <div className="flex items-baseline justify-between gap-4">
        <Link to={`/dashboard/category/${category.slug}`} className="hover:underline">
          {category.name}
        </Link>
        <Link to={`/category/${category.slug}`}>
          <div className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 flex items-center gap-2">
            <BiShow />
            <span>PREVIEW</span>
          </div>
        </Link>
        <Link to={`/dashboard/category/${category.slug}/delete`}>
          <div className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 flex items-center gap-2">
            <BiTrash />
            <span>DELETE</span>
          </div>
        </Link>
      </div>
    </div>
  )
}
