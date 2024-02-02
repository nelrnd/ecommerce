import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Root from "./routes/Root"
import Home from "./routes/Home"
import Product from "./components/Product"
import Category, { CategoryList } from "./components/Category"
import Checkout from "./routes/Checkout"
import dashboardRouter from "./routes/Dashboard/Dashboard"
import CartProvider from "./providers/CartProvider"
import { Toaster } from "./components/ui/toaster"

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
