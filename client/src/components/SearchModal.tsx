import { useEffect, useState } from "react"
import { BiSearch } from "react-icons/bi"
import axios from "../axios"
import { Input } from "./ui/input"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "./ui/dialog"
import ProductCard from "./ProductCard"
import { useNavigate } from "react-router-dom"
import { BiX } from "react-icons/bi"
import { Button } from "./ui/button"

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState("")
  const [results, setResults] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    if (value) {
      axios.get(`/search?term=${value}&limit=6`).then((results) => setResults(results.data))
    } else {
      setResults([])
    }
  }, [value])

  useEffect(() => {
    if (isOpen === false) {
      setValue("")
    }
  }, [isOpen])

  function handleSubmit(event) {
    event.preventDefault()
    if (value) {
      navigate(`/search?term=${value}`)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="w-11 h-11 rounded-md hover:bg-gray-100 grid place-content-center relative">
          <BiSearch className="text-xl" />
          <span className="sr-only">Open search</span>
        </button>
      </DialogTrigger>

      <DialogContent className="top-[2rem] max-w-[36rem] translate-y-0">
        <div className="flex gap-2">
          <form onSubmit={handleSubmit} className="flex-1 relative">
            <button className="h-full absolute px-3 text-lg text-gray-600">
              <BiSearch />
            </button>
            <Input
              type="text"
              placeholder="Search for a product"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mb-0 pl-10 &::-webkit-search-cancel-button:none"
              autoFocus
              spellCheck={false}
            />
          </form>

          <DialogClose asChild>
            <Button variant="ghost">
              <BiX className="text-lg" />
              <span className="sr-only">Close modal</span>
            </Button>
          </DialogClose>
        </div>

        {results.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2 item-start self-start">
            {results.map((product) => (
              <div key={product._id} className="p-2 rounded-xl hover:bg-gray-100" onClick={() => setIsOpen(false)}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
