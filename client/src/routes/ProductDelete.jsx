import { useNavigate, useParams } from "react-router-dom"
import { Box, Button, Heading, Text } from "@chakra-ui/react"
import axios from "../axios"

export default function ProductDelete() {
  const { slug } = useParams()
  const navigate = useNavigate()

  function handleClick() {
    axios
      .delete(`/product/${slug}`)
      .catch((err) => console.log(err))
      .finally(() => navigate("/"))
  }

  return (
    <Box m="auto" maxW="sm">
      <Heading mb="4">Delete product</Heading>
      <Text>Do you really wish to delete this product?</Text>
      <Button onClick={handleClick} colorScheme="red">
        Delete
      </Button>
    </Box>
  )
}
