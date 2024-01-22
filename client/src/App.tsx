import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./routes/Home"
import ProductForm from "./routes/ProductForm"
import ProductDelete from "./routes/ProductDelete"
import Dashboard, { DashboardCategories, DashboardIndex, DashboardProducts } from "./routes/Dashboard"
import Root from "./routes/Root"
import Product from "./components/Product"
import CategoryForm from "./routes/CategoryForm"
import CategoryDelete from "./routes/CategoryDelete"
import Category, { CategoryList } from "./components/Category"
import CartProvider from "./providers/CartProvider"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/product/:slug",
        element: <Product />,
      },
      {
        path: "/category",
        element: <CategoryList />,
      },
      {
        path: "/category/:slug",
        element: <Category />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <DashboardIndex />,
      },
      {
        path: "product",
        element: <DashboardProducts />,
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
        element: <DashboardCategories />,
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
    ],
  },
])

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}
