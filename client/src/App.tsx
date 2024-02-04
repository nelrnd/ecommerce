import { createBrowserRouter, RouterProvider } from "react-router-dom"
import axios from "./axios"
import Root from "./routes/Root"
import Home from "./routes/Home"
import Product from "./routes/Product"
import Category from "./routes/Category"
import Checkout from "./routes/Checkout"
import dashboardRouter from "./routes/Dashboard/Dashboard"
import CartProvider from "./providers/CartProvider"
import { Toaster } from "./components/ui/toaster"
import NotFound from "./routes/NotFound"
import Brand from "./routes/Brand"
import Categories from "./routes/Categories"
import Brands from "./routes/Brands"
import Latest from "./routes/Latest"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <div className="h-screen">
        <NotFound />
      </div>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/product/:slug",
        element: <Product />,
        errorElement: <NotFound />,
        loader: async ({ params }) => {
          const res = await axios.get(`/product/${params.slug}`)
          return res.data
        },
      },
      {
        path: "category",
        element: <Categories />,
        errorElement: <NotFound />,
        loader: async () => {
          const res = await axios.get("/category")
          return res.data
        },
      },
      {
        path: "category/:slug",
        element: <Category />,
        errorElement: <NotFound />,
        loader: async ({ request, params }) => {
          const url = new URL(request.url)
          const sort = url.searchParams.get("sort")
          const endpoint = `/category/${params.slug}${sort ? `?sort=${sort}` : ""}`
          const res = await axios.get(endpoint)
          return res.data
        },
      },
      {
        path: "brand",
        element: <Brands />,
        errorElement: <NotFound />,
        loader: async () => {
          const res = await axios.get(`/brand`)
          return res.data
        },
      },
      {
        path: "brand/:slug",
        element: <Brand />,
        errorElement: <NotFound />,
        loader: async ({ request, params }) => {
          const url = new URL(request.url)
          const sort = url.searchParams.get("sort")
          const endpoint = `/brand/${params.slug}${sort ? `?sort=${sort}` : ""}`
          const res = await axios.get(endpoint)
          return res.data
        },
      },
      {
        path: "latest",
        element: <Latest />,
        errorElement: <NotFound />,
        loader: async ({ request, params }) => {
          const res = await axios.get("/product")
          return res.data
        },
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
    ],
  },
  dashboardRouter,
])

export default function App() {
  return (
    <CartProvider>
      <Toaster />
      <RouterProvider router={router} />
    </CartProvider>
  )
}
