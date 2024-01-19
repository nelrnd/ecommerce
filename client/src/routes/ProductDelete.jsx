import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Center, Heading, Spinner, Text } from "@chakra-ui/react"
import useFetch from "../hooks/useFetch"
import axios from "../axios"
import NotFound from "./NotFound"

export default function ProductDelete() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, loading] = useFetch(`/product/${slug}`)

  function handleClick() {
    axios
      .delete(`/product/${slug}`)
      .catch((err) => console.log(err))
      .finally(() => navigate("/"))
  }

  if (loading) {
    return <Spinner />
  }

  if (!product) {
    return <NotFound />
  }

  return (
    <Center minH="100vh" bg="gray.100">
      <Box bg="white" p="12" width="30rem" rounded="md" boxShadow="lg">
        <Heading mb="4">Delete product</Heading>
        <Text color="gray.600" mb="4">
          Do you really wish to delete this product?
        </Text>
        <Button onClick={handleClick} colorScheme="red">
          Delete
        </Button>
      </Box>
    </Center>
  )
}
