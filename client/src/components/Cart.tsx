import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BiX, BiShoppingBag, BiImage } from "react-icons/bi"
import { useCart } from "../providers/CartProvider"
import { Link } from "react-router-dom"

const API_BASE = import.meta.env.VITE_API_BASE

export default function Cart() {
  const { items } = useCart()

  const handleClick = () => {
    console.log(items)
  }

  return (
    <Sheet>
      <SheetTrigger className="w-11 h-11 rounded-md hover:bg-gray-100 grid place-content-center text-xl relative">
        <BiShoppingBag />
        <span className="sr-only">Cart</span>
        <CartLabel />
      </SheetTrigger>
      <SheetContent className="w-[24rem]">
        <div className="flex flex-col h-full">
          <header className="px-6 py-8 border-b border-gray-200 flex items-baseline justify-between">
            <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">Cart</h1>
            <SheetClose className="w-11 h-11 rounded-md hover:bg-gray-100 grid place-content-center text-xl">
              <BiX />
              <span className="sr-only">Close</span>
            </SheetClose>
          </header>
          <section className="p-6 flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4">
              {items.map((i) => (
                <CartProduct key={i._id + i.size} product={i} />
              ))}
            </div>
          </section>
          <footer className="p-6">
            <div className="py-3 flex justify-between">
              <span>Subtotal:</span>
              <span>${items.reduce((total, curr) => total + curr.price, 0)}</span>
            </div>
            <div className="py-3 pt-0 flex justify-between">
              <span>Shipping:</span>
              <span>$10</span>
            </div>
            <div className="font-bold py-6 border-t border-gray-200 flex justify-between">
              <span>Total:</span>
              <span>${items.reduce((total, curr) => total + curr.price, 0) + 10}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full bg-gray-900 w-96 font-semibold text-white text-center px-6 py-3 rounded hover:bg-gray-800"
            >
              Go To Checkout
            </Link>
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function CartProduct({ product }) {
  const { deleteFromCart, updateItemSize, updateItemQuantity } = useCart()

  return (
    <div className="flex gap-3">
      <Link to={`/product/${product.slug}`}>
        <div className="aspect-square w-20 bg-gray-200">
          {product.image ? (
            <img src={API_BASE + "/" + product.image} alt="" className="block w-full h-full object-cover" />
          ) : (
            <div className="text-5xl text-gray-400 h-full grid place-content-center opacity-50">
              <BiImage />
            </div>
          )}
        </div>
      </Link>
      <div className="flex-1 ">
        <div className="flex gap-2">
          <div className="flex-1">
            <Link to={`/product/${product.slug}`}>
              <h2 className="font-bold hover:underline">{product.name}</h2>
            </Link>
            <p className="text-gray-600">${product.price * product.quantity}</p>
          </div>
          <div>
            <button
              onClick={() => deleteFromCart(product._id)}
              className="w-9 h-9 rounded-md hover:bg-gray-100 grid place-content-center"
            >
              <BiX />
              <span className="sr-only">Remove item</span>
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          {product.sizes ? (
            <Select defaultValue={product.size} onValueChange={(size) => updateItemSize(product, size)}>
              <SelectTrigger>
                <SelectValue placeholder="Size">
                  <span className="text-sm text-gray-600">Size:</span> {product.size}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-gray-600 text-sm w-full px-2 py-1">One size</p>
          )}
          <Select defaultValue={product.quantity} onValueChange={(qty) => updateItemQuantity(product, qty)}>
            <SelectTrigger>
              <SelectValue placeholder="Quantity">
                <span className="text-sm text-gray-600">Quantity:</span> {product.quantity}
              </SelectValue>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((quantity) => (
                  <SelectItem key={quantity} value={quantity.toString()}>
                    {quantity}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectTrigger>
          </Select>
        </div>
      </div>
    </div>
  )
}

function CartLabel() {
  const { items } = useCart()

  const nbOfItems = items.reduce((total, curr) => total + Number(curr.quantity), 0)

  if (nbOfItems === 0) return null

  return (
    <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-black text-white text-sm font-semibold grid place-content-center">
      <span>{nbOfItems < 10 ? nbOfItems : "9+"}</span>
    </div>
  )
}
