import { useEffect, useState } from "react"
import axios from "../axios"
import { useNavigate, useParams } from "react-router-dom"
import { BiGridVertical, BiTrash } from "react-icons/bi"
import useFetch from "../hooks/useFetch"

export default function ProductForm() {
  const [categories] = useFetch("/category")
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [image, setImage] = useState("")
  const [sizes, setSizes] = useState([])
  const [errors, setErrors] = useState({})

  const { slug } = useParams()
  const navigate = useNavigate()
  const heading = slug ? "Update product" : "Create product"
  const btnText = slug ? "Save" : "Submit"

  useEffect(() => {
    if (slug) {
      axios
        .get(`/product/${slug}`)
        .then((res) => {
          const product = res.data
          setId(product._id)
          setName(product.name)
          setPrice(product.price)
          setDescription(product.description)
          setCategory(product.category)
          setImage(product.image)
          setSizes(product.sizes)
        })
        .catch((err) => console.log(err))
    } else {
      setId("")
      setName("")
      setPrice("")
      setDescription("")
      setCategory("")
      setImage("")
      setSizes([])
    }
  }, [slug])

  function handleSubmit(e) {
    e.preventDefault()

    const options = {
      headers: { "Content-Type": "multipart/form-data" },
    }

    if (slug) {
      axios
        .put(
          `/product/${slug}`,
          { id, name, price, description, category: category || null, image, sizes: sizes.length ? sizes : null },
          options
        )
        .then(async (res) => {
          const newData = await axios.get(`/product/${res.data.slug}`)
          const product = newData.data
          if (product.slug !== slug) {
            return navigate(`/dashboard/product/${product.slug}`)
          }
          setId(product._id)
          setName(product.name)
          setPrice(product.price)
          setDescription(product.description)
          setCategory(product.category)
          setImage(product.image)
          setSizes(product.sizes)
        })
        .catch((err) => {
          if (err.response) {
            setErrors(err.response.data.errors)
          }
        })
    } else {
      axios
        .post(
          "/product",
          { name, price, description, category: category || null, image, sizes: sizes.length ? sizes : null },
          options
        )
        .then(async (res) => {
          const newData = await axios.get(`/product/${res.data.slug}`)
          const product = newData.data
          if (product.slug !== slug) {
            return navigate(`/dashboard/product/${product.slug}`)
          }
          setId(product._id)
          setName(product.name)
          setPrice(product.price)
          setDescription(product.description)
          setCategory(product.category)
          setImage(product.image)
          setSizes(product.sizes)
        })
        .catch((err) => {
          console.log(err)
          if (err.response) {
            setErrors(err.response.data.errors)
          }
        })
    }
  }

  return (
    <div className="max-w-[64rem] m-auto bg-white rounded">
      <div className="max-w-[52rem] m-auto">
        <header className="p-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{heading}</h1>
        </header>
        <main className="p-8 pt-0">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="flex flex-col gap-6">
              <div>
                <label htmlFor="name" className="text-gray-600">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full mt-2 border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="price" className="text-gray-600">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="block w-full mt-2 border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="desc" className="text-gray-600">
                  Description
                </label>
                <textarea
                  id="desc"
                  name="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full mt-2 border-gray-300 rounded"
                ></textarea>
              </div>
              {categories && (
                <div>
                  <label htmlFor="category" className="text-gray-600">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="block w-full mt-2 border-gray-300 rounded"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="" className="text-gray-600">
                      Select a category
                    </option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="image" className="text-gray-600">
                  Image
                </label>
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="block w-full mt-2 border-gray-300 rounded"
                />
              </div>
              <ProductFormSizes sizes={sizes} setSizes={setSizes} />
              <button className="mt-4 px-6 py-3 bg-blue-700 text-white hover:bg-blue-800 rounded">{btnText}</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

function ProductFormSizes({ sizes, setSizes }) {
  const [name, setName] = useState("")
  const [selected, setSelected] = useState(null)

  const handleAdd = () => {
    if (!name || sizes.includes(name.toUpperCase())) return
    setSizes([...sizes, name.toUpperCase()])
    setName("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleDelete = (name) => {
    setSizes(sizes.filter((s) => s !== name))
  }

  const handleSelect = (name) => {
    setSelected(name)
    document.addEventListener("mouseup", () => {
      setSelected(null)
    })
  }

  const handleHover = (name) => {
    if (!selected || selected === name) return
    let sizesCopy = [...sizes]
    const index = sizesCopy.findIndex((s) => s === name)
    sizesCopy = sizesCopy.filter((s) => s !== selected)
    sizesCopy.splice(index, 0, selected.toString())
    setSizes(sizesCopy)
  }

  const handleItemChange = (index, value) => {
    const sizesCopy = [...sizes]
    sizesCopy[index] = value.toUpperCase()
    setSizes(sizesCopy)
  }

  return (
    <div>
      <label htmlFor="size" className="text-gray-600">
        Sizes
      </label>
      {sizes.length > 0 && (
        <ul className="mt-2 flex flex-col gap-2">
          {sizes.map((s, index) => (
            <li key={index} onMouseEnter={() => handleHover(s)}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onMouseDown={() => handleSelect(s)}
                  className="w-11 h-11 rounded-md hover:bg-gray-100 grid place-content-center text-xl cursor-grab"
                >
                  <BiGridVertical />
                </button>
                <input
                  type="text"
                  value={s}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  className="block w-full border-gray-300 rounded flex-1"
                ></input>
                <button
                  type="button"
                  onClick={() => handleDelete(s)}
                  className="w-11 h-11 rounded-md hover:bg-gray-100 grid place-content-center text-xl"
                >
                  <BiTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex gap-2">
        {sizes.length > 0 && <div className="w-11" />}
        <input
          id="size"
          type="text"
          placeholder="Size"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="block w-full border-gray-300 rounded flex-1"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleAdd}
          className="px-10 bg-gray-200 text-black hover:bg-gray-300 rounded disabled:opacity-50 disabled:hover:bg-gray-200"
          disabled={!name || sizes.includes(name.toUpperCase())}
          type="button"
        >
          Add
        </button>
      </div>
    </div>
  )
}
