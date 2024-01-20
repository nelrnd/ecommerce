import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./routes/Home"
import ProductForm from "./routes/ProductForm"
import ProductDelete from "./routes/ProductDelete"
import Dashboard, { DashboardIndex, DashboardProducts } from "./routes/Dashboard"
import Root from "./routes/Root"
import Product from "./routes/Product"

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
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
