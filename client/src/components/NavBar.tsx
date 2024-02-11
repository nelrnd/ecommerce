import { Link, useLoaderData } from "react-router-dom"
import { BiUser } from "react-icons/bi"
import Cart from "./Cart"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"
import SearchModal from "./SearchModal"
import { useAuth } from "@/providers/AuthProvider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export default function NavBar({ minimized = false }) {
  return (
    <header className="bg-white p-6 lg:px-16 xl:px-24 border-b border-gray-200">
      <div className="grid grid-cols-4 items-center">
        <div className={minimized ? "col-span-4" : ""}>
          <Link to="/">
            <h3>E-Commerce</h3>
          </Link>
        </div>
        {!minimized && (
          <>
            <NavBarLinks />
            <div className="flex justify-end items-center gap-1">
              <SearchModal />
              <Cart />
              <AccountButton />
            </div>
          </>
        )}
      </div>
    </header>
  )
}

function AccountButton() {
  const { token, setToken } = useAuth()

  function logout() {
    setToken()
  }

  return !token ? (
    <Link to="/login" className="w-11 h-11 rounded-md hover:bg-gray-100 grid place-content-center relative">
      <BiUser className="text-xl" />
      <span className="sr-only">Account</span>
    </Link>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-11 h-11 rounded-md hover:bg-gray-100 grid place-content-center relative">
          <BiUser className="text-xl" />
          <span className="sr-only">Account</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <button className="semibold cursor-pointer" onClick={logout}>
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function NavBarLinks() {
  const { navbarCategories, navbarBrands } = useLoaderData()

  return (
    <div className="col-span-2 flex justify-center">
      <NavigationMenu className="justify-end">
        <NavigationMenuList>
          {navbarCategories && navbarCategories.length > 0 && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="px-8 py-4 columns-2 w-[24rem] space-y-2">
                  {navbarCategories.map((category) => (
                    <li key={category._id}>
                      <NavigationMenuLink asChild>
                        <Link to={`/category/${category.slug}`} className="hover:underline">
                          {category.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/category" className="hover:underline">
                        See all categories
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
          {navbarBrands && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Brands</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="px-8 py-4 columns-2 w-[24rem] space-y-2">
                  {navbarBrands.map((brand) => (
                    <li key={brand._id}>
                      <NavigationMenuLink asChild>
                        <Link to={`/brand/${brand.slug}`} className="hover:underline">
                          {brand.name}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                  <li>
                    <NavigationMenuLink asChild>
                      <Link to="/brand" className="hover:underline">
                        See all brands
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link to="/latest" className="px-4 py-2 hover:underline">
                Latest
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
