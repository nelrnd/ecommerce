import { useEffect, useLayoutEffect, useState } from "react"
import { Link, useLoaderData } from "react-router-dom"
import { BiUser, BiHeart, BiMenu, BiShoppingBag, BiX, BiChevronRight, BiLogOut } from "react-icons/bi"
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
import { useWishlist } from "@/providers/WishlistProvider"
import Badge from "./Badge"
import { Button } from "./ui/button"
import { useCart } from "@/providers/CartProvider"

export default function NavBar() {
  // for mobile version
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  function toggleMenu() {
    setIsMenuOpen((open) => !open)
  }

  function closeMenu() {
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="bg-white py-3 md:py-6 px-3 sm:px-6 md:px-12 border-b border-gray-200 sticky top-0 left-0 z-10">
        <div className="flex items-center gap-4">
          <NavBar_Logo />
          <NavBar_Links />
          <NavBar_Buttons toggleMenu={toggleMenu} />
        </div>
      </header>
      <NavBar_MobileMenu isOpen={isMenuOpen} close={closeMenu} />
    </>
  )
}

function NavBar_Logo() {
  return (
    <div className="flex-1">
      <Link to="/" className="block w-fit">
        <h3>E-Commerce</h3>
      </Link>
    </div>
  )
}

function NavBar_Links() {
  const { categories, brands } = useLoaderData()

  return (
    <div className="flex-1 hidden md:block">
      <NavigationMenu>
        <NavigationMenuList>
          {categories && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base font-normal">Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-8 columns-2 w-[24rem] space-y-2">
                  {categories.map((category) => (
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

          {brands && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base font-normal">Brands</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="p-8 columns-2 w-[24rem] space-y-2">
                  {brands.map((brand) => (
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

function NavBar_Buttons({ toggleMenu }) {
  return (
    <div className="flex-1">
      <div className="flex justify-end gap-2">
        <SearchModal />
        <WishlistButton />
        <CartButton />
        <AccountButton />
        <Button onClick={toggleMenu} variant="ghost" className="text-xl md:hidden" title="Open menu">
          <BiMenu />
        </Button>
      </div>
    </div>
  )
}

function NavBar_MobileMenu({ isOpen, close }) {
  const { user, setUser } = useAuth()

  function logout() {
    setUser()
  }

  useLayoutEffect(() => {
    const menuLinks = document.querySelectorAll("#navbar-menu a")
    menuLinks.forEach((elem) => {
      elem.addEventListener("click", close)
    })

    return () =>
      menuLinks.forEach((elem) => {
        elem.removeEventListener("click", close)
      })
  }, [isOpen, close, user])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-y-hidden")
    } else {
      document.body.classList.remove("overflow-y-hidden")
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="bg-white fixed top-0 inset-0 z-20" id="navbar-menu">
      <header className="py-6 px-3 sm:px-6">
        <Button onClick={close} variant="ghost" className="text-xl block ml-auto">
          <BiX />
        </Button>
      </header>
      <section className="px-3 sm:px-6 pb-6 ">
        <ul className="space-y-4">
          {[
            {
              href: "/category",
              text: "Categories",
            },
            {
              href: "/brand",
              text: "Brands",
            },
            {
              href: "/latest",
              text: "Latest",
            },
          ].map((link) => (
            <li key={link.text}>
              <Link to={link.href} className="px-3 py-2 flex justify-between hover:underline">
                <span>{link.text}</span>
                <BiChevronRight />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="px-3 sm:px-6 space-y-4">
        <Button variant="outline" className="p-4 h-auto w-full justify-start gap-2" asChild>
          <Link to="/wishlist" className="text-base">
            <BiHeart />
            <span>Wishlist</span>
          </Link>
        </Button>
        {!user ? (
          <Button variant="outline" className="p-4 h-auto w-full justify-start gap-2" asChild>
            <Link to="/login" className="text-base">
              <BiUser />
              <span>Account</span>
            </Link>
          </Button>
        ) : (
          <Button onClick={logout} variant="outline" className="p-4 h-auto w-full justify-start gap-2">
            <BiLogOut />
            Logout
          </Button>
        )}
      </section>
    </div>
  )
}

function CartButton() {
  const { items, openCart } = useCart()

  const nbOfItems = items.reduce((acc, curr) => acc + curr.quantity, 0)
  const badgeText = nbOfItems < 10 ? nbOfItems : "9+"

  return (
    <Button onClick={openCart} variant="ghost" className="w-10 p-0 text-xl relative" title="Cart">
      <BiShoppingBag />
      <Badge count={badgeText} />
    </Button>
  )
}

function WishlistButton() {
  const { items } = useWishlist()

  const badgeText = items.length

  return (
    <Button variant="ghost" className="w-10 p-0 text-xl hidden md:flex relative z-10" title="Wishlist" asChild>
      <Link to="/wishlist">
        <BiHeart />
        <Badge count={badgeText} />
      </Link>
    </Button>
  )
}

function AccountButton() {
  const { user, setUser } = useAuth()

  const username = user?.full_name.split(" ")[0]

  function logout() {
    setUser()
  }

  return !user ? (
    <Button variant="ghost" className="w-10 p-0 text-xl hidden md:flex" title="Account" asChild>
      <Link to="/login">
        <BiUser />
      </Link>
    </Button>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="hidden md:flex" title="Account">
          <BiUser className="text-xl" />
          <span className="ml-2">{username}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Button onClick={logout} variant="ghost" className="w-full cursor-pointer">
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function CheckoutNavBar() {
  return (
    <header className="bg-white py-3 md:py-6 px-3 sm:px-6 md:px-12 border-b border-gray-200 sticky top-0 left-0 z-10">
      <NavBar_Logo />
    </header>
  )
}
