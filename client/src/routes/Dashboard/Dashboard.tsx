import { Link, Outlet, useLocation } from "react-router-dom"
import BrandDelete from "./BrandDelete"
import BrandForm from "./BrandForm"
import Brands from "./Brands"
import Categories from "./Categories"
import CategoryDelete from "./CategoryDelete"
import CategoryForm from "./CategoryForm"
import Index from "./Index"
import Order from "./Order"
import Orders from "./Orders"
import ProductDelete from "./ProductDelete"
import ProductForm from "./ProductForm"
import Products from "./Products"
import { BiChart, BiCube, BiGridAlt, BiLinkExternal, BiLogOut, BiPurchaseTag, BiSolidHome } from "react-icons/bi"

export default {
  path: "/dashboard",
  element: <Dashboard />,
  children: [
    {
      index: true,
      element: <Index />,
    },
    {
      path: "order",
      element: <Orders />,
    },
    {
      path: "order/:id",
      element: <Order />,
    },
    {
      path: "product",
      element: <Products />,
    },
    {
      path: "product/create",
      element: <ProductForm />,
    },
    {
      path: "product/:slug",
      element: <ProductForm />,
    },
    {
      path: "product/:slug/delete",
      element: <ProductDelete />,
    },
    {
      path: "category",
      element: <Categories />,
    },
    {
      path: "category/create",
      element: <CategoryForm />,
    },
    {
      path: "category/:slug",
      element: <CategoryForm />,
    },
    {
      path: "category/:slug/delete",
      element: <CategoryDelete />,
    },
    {
      path: "brand",
      element: <Brands />,
    },
    {
      path: "brand/create",
      element: <BrandForm />,
    },
    {
      path: "brand/:slug",
      element: <BrandForm />,
    },
    {
      path: "brand/:slug/delete",
      element: <BrandDelete />,
    },
  ],
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Dashboard_Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}

const sidebarTabs = {
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

function Dashboard_Sidebar() {
  return (
    <nav className="w-[20rem] h-screen sticky top-0 bg-white p-8 shrink-0 border-r border-gray-200 flex flex-col gap-4">
      <h1 className="m-4">E-commerce</h1>
      <ul className="flex-1 flex flex-col gap-1">
        {sidebarTabs.top.map((t) => (
          <Dashboard_SidebarTab key={t.name} tab={t} />
        ))}
      </ul>
      <ul className="space-y-1">
        {sidebarTabs.bottom.map((t) => (
          <Dashboard_SidebarTab key={t.name} tab={t} />
        ))}
      </ul>
    </nav>
  )
}

function Dashboard_SidebarTab({ tab }) {
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
