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
  name: z.string().min(3).max(200),
  description: z.string().min(3).max(200).optional(),
  image: z.union([
    z.string(),
    z
      .instanceof(File)
      .refine((f) => f.size < 5242880, "Image should be less than 5 MB")
      .optional(),
  ]),
})

export default function CategoryForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  const { slug } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()
  const heading = slug ? "Update category" : "Create category"
  const btnText = slug ? "Save" : "Submit"

  useEffect(() => {
    if (slug) {
      axios
        .get(`/category/${slug}`)
        .then((res) => {
          const category = res.data
          form.setValue("name", category.name)
          form.setValue("description", category.description)
          form.setValue("image", category.image)
        })
        .catch((err) => {
          console.log(err)
          navigate(`/dashboard/category/create`)
        })
    }
  }, [slug, form, navigate])

  function onSubmit(values: z.infer<typeof formSchema>) {
    const options = { headers: { "Content-Type": "multipart/form-data" } }

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
        .put(`/category/${slug}`, values, options)
        .then((res) => {
          navigate(`/dashboard/category/${res.data.slug}`)
          toast({
            title: "Success!",
            description: "Category successfully saved.",
          })
        })
        .catch(catchHandler)
    } else {
      axios
        .post("/category", values, options)
        .then((res) => {
          form.setValue("name", "")
          form.setValue("description", "")
          form.setValue("image", undefined)
          document.getElementById("image").value = null
          toast({
            title: "Success!",
            description: "New category successfully created.",
            action: (
              <ToastAction altText="open" onClick={() => navigate(`/dashboard/category/${res.data.slug}`)}>
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
            to={`/category/${slug}`}
            className="p-4 w-fit bg-white border border-gray-200 rounded-xl flex items-center gap-2 shadow hover:bg-gray-50"
          >
            <BiShow className="text-lg" />
            /category/{slug}
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

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                    />
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
