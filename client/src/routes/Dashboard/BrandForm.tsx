import { useToast } from "@/components/ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "../../axios"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ToastAction } from "@/components/ui/toast"
import { BiShow } from "react-icons/bi"

const formSchema = z.object({
  id: z.string().optional(), // if editing an existing brand
  name: z.string().min(3).max(200),
  description: z.string().min(3).max(200).optional(),
})

export default function BrandForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const { slug } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  const heading = slug ? "Update brand" : "Create brand"
  const btnText = slug ? "Save" : "Submit"

  useEffect(() => {
    if (slug) {
      axios
        .get(`/brand/${slug}`)
        .then((res) => {
          const brand = res.data
          form.setValue("id", brand._id)
          form.setValue("name", brand.name)
          form.setValue("description", brand.description)
        })
        .catch((err) => {
          console.log(err)
          navigate(`/dashboard/brand/create`)
        })
    }
  }, [slug, form, navigate])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const catchHandler = (err) => {
      console.log(err)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      })
    }

    if (slug) {
      axios
        .put(`/brand/${slug}`, values)
        .then((res) => {
          navigate(`/dashboard/brand/${res.data.slug}`)
          toast({
            title: "Success!",
            description: "Brand successfully saved.",
          })
        })
        .catch(catchHandler)
    } else {
      axios
        .post("/brand", values)
        .then((res) => {
          form.setValue("name", "")
          form.setValue("description", "")
          toast({
            title: "Success!",
            description: "New brand successfully created.",
            action: (
              <ToastAction altText="open" onClick={() => navigate(`/dashboard/brand/${res.data.slug}`)}>
                OPEN
              </ToastAction>
            ),
          })
        })
        .catch(catchHandler)
    }
  }

  return (
    <div>
      <header className="p-12">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">{heading}</h1>
      </header>
      {slug && (
        <section className="mx-12 mb-6">
          <Link
            to={`/brand/${slug}`}
            className="p-4 w-fit bg-white border border-gray-200 rounded-xl flex items-center gap-2 shadow hover:bg-gray-50"
          >
            <BiShow className="text-lg" />
            /brand/{slug}
          </Link>
        </section>
      )}
      <section className="bg-white mx-12 mb-12 p-12 border border-gray-200 rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-[36rem] space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">{btnText}</Button>
          </form>
        </Form>
      </section>
    </div>
  )
}
