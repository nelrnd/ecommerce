import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration } from "react-router-dom"
import Root, { loader as rootLoader } from "./routes/Root"
import Home, { loader as homeLoader } from "./routes/Home"
import Product, { loader as productLoader } from "./routes/Product"
import Categories, { loader as categoriesLoader } from "./routes/Categories"
import Category, { loader as categoryLoader } from "./routes/Category"
import Brand, { loader as brandLoader } from "./routes/Brand"
import Checkout from "./routes/Checkout"
import dashboardRouter from "./routes/Dashboard/Dashboard"
import CartProvider from "./providers/CartProvider"
import { Toaster } from "./components/ui/toaster"
import Brands, { loader as brandsLoader } from "./routes/Brands"
import Latest, { loader as latestLoader } from "./routes/Latest"
import OrderConfirmation from "./routes/OrderConfirmation"
import Search from "./routes/Search"
import Register from "./routes/Register"
import Login from "./routes/Login"
import AuthProvider from "./providers/AuthProvider"
import AuthRoute from "./routes/AuthRoute"
import Wishlist from "./routes/Wishlist"
import WishlistProvider from "./providers/WishlistProvider"
import Error from "./routes/Error"
import Cart from "./components/Cart"

const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Outlet />
            <Cart />
            <Toaster />
            <ScrollRestoration />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    ),
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Root />,
        loader: rootLoader,
        children: [
          {
            index: true,
            element: <Home />,
            loader: homeLoader,
          },
          {
            path: "product/:slug",
            element: <Product />,
            loader: productLoader,
          },
          {
            path: "category",
            element: <Categories />,
            loader: categoriesLoader,
          },
          {
            path: "category/:slug",
            element: <Category />,
            loader: categoryLoader,
          },
          {
            path: "brand",
            element: <Brands />,
            loader: brandsLoader,
          },
          {
            path: "brand/:slug",
            element: <Brand />,
            loader: brandLoader,
          },
          {
            path: "latest",
            element: <Latest />,
            loader: latestLoader,
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
        path: "checkout",
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
