import { createContext, useContext, useState } from "react"

const CartContext = createContext(null)

interface cartItem {
  id: string
  productId: string
  quantity: number
  size?: string
}

const MAX_ITEM_QUANTITY = 5

export default function CartProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<cartItem[]>([])

  function openCart() {
    setIsOpen(true)
  }

  function closeCart() {
    setIsOpen(false)
  }

  function addItem(item) {
    item = giveItemId(item)
    const itemInCart = getItem(item)
    if (itemInCart) {
      editItemQuantity(item, itemInCart.quantity + 1)
    } else {
      setItems([...items, item])
    }
  }

  function deleteItem(item) {
    const itemsCopy = [...items]
    const updatedItems = itemsCopy.filter((cartItem) => cartItem.id !== item.id)
    setItems(updatedItems)
  }

  function editItemSize(item, newSize) {
    let updatedItem = { ...item, size: newSize }
    updatedItem = giveItemId(updatedItem)
    const itemInCart = getItem(updatedItem)
    const itemsCopy = [...items]
    if (itemInCart) {
      const newQuantity = Math.min(MAX_ITEM_QUANTITY, itemInCart.quantity + item.quantity)
      const updatedItems = itemsCopy
        .filter((cartItem) => cartItem !== item)
        .map((cartItem) => (cartItem === itemInCart ? { ...itemInCart, quantity: newQuantity } : cartItem))
      setItems(updatedItems)
    } else {
      const updatedItems = itemsCopy.map((cartItem) => (cartItem === item ? updatedItem : cartItem))
      setItems(updatedItems)
    }
  }

  function editItemQuantity(item, newQuantity) {
    const itemInCart = getItem(item)
    if (itemInCart && newQuantity <= MAX_ITEM_QUANTITY) {
      itemInCart.quantity = newQuantity
      const itemsCopy = [...items]
      const updatedItems = itemsCopy.map((cartItem) => (cartItem.id === itemInCart.id ? itemInCart : cartItem))
      setItems(updatedItems)
    }
  }

  function getItem(item) {
    if (!item.id) item = giveItemId(item)
    return items.find((cartItem) => cartItem.id === item.id)
  }

  function giveItemId(item) {
    return { ...item, id: item.product._id + item.size }
  }

  const contextValue = {
    isOpen,
    setIsOpen,
    items,
    openCart,
    closeCart,
    addItem,
    deleteItem,
    editItemSize,
    editItemQuantity,
    getItem,
  }

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}
