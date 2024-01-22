import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "../providers/CartProvider"

const API_BASE = import.meta.env.VITE_API_BASE

export default function Cart() {
  const { items } = useCart()

  return (
    <Sheet>
      <SheetTrigger>Cart</SheetTrigger>
      <SheetContent className="w-[24rem]">
        <header className="p-8">
          <h1>Cart</h1>
          <SheetClose />
        </header>
        <section>
          <div className="flex flex-col gap-4">
            {items.map((i) => (
              <CartProduct key={i._id} product={i} />
            ))}
          </div>
        </section>
      </SheetContent>
    </Sheet>
  )
}

function CartProduct({ product }) {
  return (
    <div className="flex gap-4">
      <div className="aspect-square w-24 bg-gray-200">
        {product.image ? (
          <img src={API_BASE + "/" + product.image} alt="" className="block w-full h-full object-cover" />
        ) : (
          <div className="text-5xl text-gray-400 h-full grid place-content-center opacity-50">
            <BiImage />
          </div>
        )}
      </div>
      <div className="mt-2 grid-cols-2">
        <h2 className="font-bold group-hover:underline">{product.name}</h2>
        <p className="text-gray-600">${product.price}</p>
        <div className="flex gap-3">
          <button>Size: M</button>
          <button>Quantity: 1</button>
          <button>Delete</button>
        </div>
      </div>
    </div>
  )
}
