import { useEffect, useState } from "react"
import axios from "../axios"
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  Button,
  Center,
} from "@chakra-ui/react"
import { useNavigate, useParams } from "react-router-dom"

export default function ProductForm() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [errors, setErrors] = useState({})

  const { slug } = useParams()
  const navigate = useNavigate()
  const heading = slug ? "Update product" : "Create product"

  useEffect(() => {
    if (slug) {
      axios
        .get(`/product/${slug}`)
        .then((res) => {
          const product = res.data
          setName(product.name)
          setPrice(product.price)
          setDescription(product.description)
        })
        .catch((err) => console.log(err))
    }
  }, [slug])

  function handleSubmit(e) {
    e.preventDefault()

    if (slug) {
      axios
        .put(`/product/${slug}`, { name, price, description })
        .then((res) => navigate(`/product/${res.data.slug}`))
        .catch((err) => {
          if (err.response) {
            setErrors(err.response.data.errors)
          }
        })
    } else {
      axios
        .post("/product", { name, price, description })
        .then((res) => navigate(`/product/${res.data.slug}`))
        .catch((err) => {
          if (err.response) {
            setErrors(err.response.data.errors)
          }
        })
    }
  }

  return (
    <Center minH="100vh" bg="gray.100">
      <Box bg="white" p="12" width="30rem" rounded="md" boxShadow="lg">
        <Heading mb="4">{heading}</Heading>
        <form onSubmit={handleSubmit}>
          <VStack spacing="4">
            <FormControl isInvalid={errors.name}>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && (
                <FormErrorMessage>{errors.name.msg}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors.price}>
              <FormLabel>Price</FormLabel>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              {errors.price && (
                <FormErrorMessage>{errors.price.msg}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={errors.description}>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <FormErrorMessage>{errors.description.msg}</FormErrorMessage>
              )}
            </FormControl>

            <Button type="submit">Submit</Button>
          </VStack>
        </form>
      </Box>
    </Center>
  )
}
