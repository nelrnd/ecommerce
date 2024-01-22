import { createContext, useContext, useState } from "react"

const CartContext = createContext(null)

export default function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState([])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const addToCart = (product) => {
    setItems([...items, product])
  }

  const contextValue = {
    isOpen,
    items,
    openCart,
    closeCart,
    addToCart,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
