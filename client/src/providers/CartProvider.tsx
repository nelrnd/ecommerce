import { createContext, useContext, useState } from "react"

const CartContext = createContext(null)

export default function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState([])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const addToCart = (product) => {
    const exists = items.find((i) => i._id === product._id && i.size === product.size)
    if (exists) {
      exists.quantity++
      setItems((items) => items.map((i) => (i._id === product._id ? exists : i)))
    } else {
      setItems([...items, { ...product, quantity: 1 }])
    }
  }

  const deleteFromCart = (id) => {
    setItems((items) => items.filter((i) => i._id !== id))
  }

  const updateItemSize = (item, size) => {
    setItems(items.map((i) => (i._id === item._id && i.size === item.size ? { ...item, size } : item)))
  }

  const updateItemQuantity = (item, quantity) => {
    setItems(items.map((i) => (i._id === item._id && i.size === item.size ? { ...item, quantity } : item)))
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
