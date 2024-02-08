import { createContext, useContext, useState } from "react"

const CartContext = createContext(null)

interface cartItem {
  productId: string
  quantity: number
  size?: string
}

export default function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<cartItem[]>([])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const addToCart = (product) => {
    const inCart = items.find((item) => item._id === product._id && item.size == product.size)
    if (inCart) {
      if (inCart.quantity < 5) {
        setItems((items) =>
          items.map((item) => (item === inCart ? { ...inCart, quantity: inCart.quantity + 1 } : item))
        )
      }
    } else {
      setItems((items) => [...items, { ...product, quantity: 1 }])
    }
  }

  const deleteFromCart = (product) => {
    setItems((items) => items.filter((item) => !(item._id === product._id && item.size == product.size)))
  }

  const updateItemSize = (product, size) => {
    const inCart = items.find((item) => item._id === product._id && item.size === size)
    if (inCart) {
      setItems((items) => items.filter((item) => !(item._id === product._id && item.size == product.size)))
      setItems((items) =>
        items.map((item) =>
          item === inCart ? { ...inCart, quantity: Math.min(5, inCart.quantity + product.quantity) } : item
        )
      )
    } else {
      setItems((items) =>
        items.map((item) => (item._id === product._id && item.size == product.size ? { ...product, size } : item))
      )
    }
  }

  const updateItemQuantity = (item, quantity) => {
    setItems(items.map((i) => (i._id === item._id && i.size == item.size ? { ...item, quantity } : i)))
  }

  const contextValue = {
    isOpen,
    items,
    openCart,
    closeCart,
    addToCart,
    deleteFromCart,
    updateItemSize,
    updateItemQuantity,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
