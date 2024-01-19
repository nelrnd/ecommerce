import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from "./routes/Home"
import ProductForm from "./routes/ProductForm"
import Product from "./routes/Product"
import ProductDelete from "./routes/ProductDelete"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product/create",
    element: <ProductForm />,
  },
  {
    path: "/product/:slug",
    element: <Product />,
  },
  {
    path: "/product/:slug/update",
    element: <ProductForm />,
  },
  {
    path: "/product/:slug/delete",
    element: <ProductDelete />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
