import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BiX, BiShoppingBag } from "react-icons/bi"
import { useCart } from "../providers/CartProvider"
import { Link, useNavigate } from "react-router-dom"
import { formatPrice } from "@/utils"
import { Button } from "./ui/button"
import ProductImage from "./ProductImage"

const MAX_ITEM_QUANTITY = 5

export default function Cart() {
  const { items, isOpen, setIsOpen, closeCart } = useCart()

  const navigate = useNavigate()

  function handleClick() {
    closeCart()
    navigate("/checkout")
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-[24rem]">
        <div className="h-full flex flex-col">
          <header className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-baseline">
              <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">Cart</h1>
              <SheetClose className="w-11 h-11 rounded-md hover:bg-gray-100 grid place-content-center">
                <BiX className="text-xl" />
                <span className="sr-only">Close</span>
              </SheetClose>
            </div>
          </header>
          <main className="p-6 flex-1 overflow-y-auto space-y-8">
            {items.length ? (
              items.map((item) => <CartItem key={item.sku} item={item} />)
            ) : (
              <div className="h-full grid place-content-center">
                <p className="text-xl">Your cart is currently empty</p>
              </div>
            )}
          </main>
          <footer className="p-6">
            {items.length > 0 &&
              [
                {
                  text: "Subtotal",
                  value: items.reduce((acc, curr) => curr.product.price * curr.quantity + acc, 0),
                },
                {
                  text: "Shipping",
                  value: 0,
                },
                {
                  text: "Total",
                  value: items.reduce((acc, curr) => curr.product.price * curr.quantity + acc, 0) + 0,
                },
              ].map((row) => (
                <li
                  key={row.text}
                  className={`py-3 flex justify-between ${
                    row.text === "Total" ? "font-bold py-6 border-t border-gray-200" : ""
                  }`}
                >
                  <span>{row.text}</span>
                  <span>{formatPrice(row.value)}</span>
                </li>
              ))}
            <Button onClick={handleClick} size="lg" className="w-full" disabled={items.length === 0}>
              Go To Checkout
            </Button>
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function CartItem({ item, editable = true }) {
  const { updateItemSize, updateItemQuantity, deleteItem, closeCart } = useCart()

  return (
    <div className="flex gap-3">
      <Link to={`/product/${item.product.slug}`} className="w-20" onClick={closeCart}>
        <ProductImage src={item.product.image} />
      </Link>
      <div className="flex-1">
        <div className="flex">
          <div className="flex-1">
            <Link to={`/product/${item.product.slug}`} onClick={closeCart}>
              <h2 className="font-bold hover:underline">{item.product.name}</h2>
            </Link>
            <p className="text-gray-600">{formatPrice(item.product.price * item.quantity)}</p>
          </div>
          <button
            onClick={() => deleteItem(item)}
            className="w-9 h-9 rounded-md hover:bg-gray-100 grid place-content-center"
          >
            <BiX />
            <span className="sr-only">Remove item</span>
          </button>
        </div>
        <div className="mt-1 grid grid-cols-2 gap-2">
          {item.size && editable ? (
            <Select value={item.size} onValueChange={(newSize) => updateItemSize(item, newSize)}>
              <SelectTrigger className="px-2 h-8">
                <SelectValue placeholder="Size">Size: {item.size}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {item.product.sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-gray-600 text-sm py-1">One size</p>
          )}
          {editable ? (
            <Select
              value={item.quantity.toString()}
              onValueChange={(newQuantity) => updateItemQuantity(item, Number(newQuantity))}
            >
              <SelectTrigger className="px-2 h-8">
                <SelectValue placeholder="Quantity">Quantity: {item.quantity}</SelectValue>
                <SelectContent>
                  {Array.from({ length: MAX_ITEM_QUANTITY }, (_, index) => index + 1).map((quantity) => (
                    <SelectItem key={quantity} value={quantity.toString()}>
                      {quantity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectTrigger>
            </Select>
          ) : (
            <p className="text-gray-600 text-sm py-1">Quantity: {item.quantity}</p>
          )}
        </div>
      </div>
    </div>
  )
}
