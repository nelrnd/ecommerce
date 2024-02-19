import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom"
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
import OrderConfirmation from "./routes/OrderConfirmation"
import Search from "./routes/Search"
import Register from "./routes/Register"
import Login from "./routes/Login"
import AuthProvider from "./providers/AuthProvider"
import AuthRoute from "./routes/AuthRoute"
import Wishlist from "./routes/Wishlist"
import WishlistProvider from "./providers/WishlistProvider"

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Outlet />
            <Toaster />
            <ScrollRestoration />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <Root />,
        errorElement: (
          <div className="h-screen">
            <NotFound />
          </div>
        ),
        loader: async () => {
          const [navbarCategories, navbarBrands] = await Promise.all([
            axios.get("/category?limit=5"),
            axios.get("/brand?limit=5"),
          ])
          return { navbarCategories: navbarCategories.data, navbarBrands: navbarBrands.data }
        },
        children: [
          {
            index: true,
            element: <Home />,
            loader: async () => {
              const [category1, category2, products] = await Promise.all([
                axios.get("/category/t-shirts-1"),
                axios.get("/category/jackets"),
                axios.get("/product?limit=5"),
              ])

              return { categories: [category1.data, category2.data], products: products.data }
            },
          },
          {
            path: "/product/:slug",
            element: <Product />,
            loader: async ({ params }) => {
              const res = await axios.get(`/product/${params.slug}`)
              return res.data
            },
          },
          {
            path: "category",
            element: <Categories />,
            loader: async () => {
              const res = await axios.get("/category")
              return res.data
            },
          },
          {
            path: "category/:slug",
            element: <Category />,
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
            loader: async () => {
              const res = await axios.get(`/brand`)
              return res.data
            },
          },
          {
            path: "brand/:slug",
            element: <Brand />,
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
            loader: async () => {
              const res = await axios.get("/product")
              return res.data
            },
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "search",
            element: <Search />,
          },
          {
            element: <AuthRoute />,
            children: [
              {
                path: "wishlist",
                element: <Wishlist />,
              },
            ],
          },
        ],
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "order",
        element: <OrderConfirmation />,
      },
      dashboardRouter,
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
