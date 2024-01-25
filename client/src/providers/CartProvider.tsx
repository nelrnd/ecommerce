import { createContext, useContext, useState } from "react"

const CartContext = createContext(null)

export default function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState([])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const addToCart = (product) => {
    const exists = items.find((i) => i._id === product._id)
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

  const contextValue = {
    isOpen,
    items,
    openCart,
    closeCart,
    addToCart,
    deleteFromCart,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
