import { createBrowserRouter, RouterProvider } from "react-router-dom"
import axios from "./axios"
import Root from "./routes/Root"
import Home from "./routes/Home"
import Product from "./components/Product"
//import Category, { CategoryList } from "./components/Category"
import Category from "./routes/Category"
import Checkout from "./routes/Checkout"
import dashboardRouter from "./routes/Dashboard/Dashboard"
import CartProvider from "./providers/CartProvider"
import { Toaster } from "./components/ui/toaster"
import NotFound from "./routes/NotFound"

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
      /*
      {
        path: "/category",
        element: <CategoryList />,
      },
      */
      {
        path: "category/:slug",
        element: <Category />,
        errorElement: <NotFound />,
        loader: async ({ params }) => {
          const res = await axios.get(`/category/${params.slug}`)
          return res.data
        },
      },
      /*
      {
        path: "/category/:slug",
        element: <Category />,
      },
      */
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
