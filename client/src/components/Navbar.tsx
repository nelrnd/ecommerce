import { Link } from "react-router-dom"
import Cart from "./Cart"
import useFetch from "@/hooks/useFetch"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu"

export default function NavBar() {
  const [categories, categoriesLoading] = useFetch("/category?limit=5")
  const [brands, brandsLoading] = useFetch("/brand?limit=5")

  return (
    <header className="h-[6rem] p-8 lg:px-16 xl:px-24 border-b border-gray-200">
      <div className="grid grid-cols-4 items-center">
        <div>
          <Link to="/">
            <h3>E-Commerce</h3>
          </Link>
        </div>
        <div className="col-span-2 flex justify-center">
          <NavigationMenu className="justify-end">
            <NavigationMenuList>
              {categories && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="px-8 py-4 columns-2 w-[24rem] space-y-2">
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
                  <NavigationMenuTrigger>Brands</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="px-8 py-4 columns-2 w-[24rem] space-y-2">
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
        <div className="flex justify-end items-center gap-4">
          <Cart />
        </div>
      </div>
    </header>
  )
}
