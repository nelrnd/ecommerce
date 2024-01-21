import { createContext, useContext, useState } from "react"

const CartContext = createContext(null)

export default function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  const contextValue = {
    isOpen,
    openCart,
    closeCart,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
