import { useParams } from "react-router-dom"
import useFetch from "../hooks/useFetch"
import NotFound from "./NotFound"

export default function Product() {
  const { slug } = useParams()
  const [product, loading] = useFetch(`/product/${slug}`)

  if (!product) {
    return <NotFound />
  }

  return (
    <>
      <h1>Product</h1>
    </>
  )
}

/*
      <Heading>{product.name}</Heading>
      <Text as="b">${product.price}</Text>
      <Text>{product.description}</Text>
      */
