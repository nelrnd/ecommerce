import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "../axios"
import { useAuth } from "@/providers/AuthProvider"
import { useEffect } from "react"

const formSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Email format is invalid"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
})

export default function Register() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || "/"

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios
      .post("/auth/register", values)
      .then((res) => {
        const user = res.data.user
        setUser(user)
      })
      .catch((err) => {
        const errors = err.response.data.errors
        for (const error in errors) {
          form.setError(errors[error].path, { type: "custom", message: errors[error].msg })
        }
      })
  }

  // redirect to home if logged in
  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <div className="sm:my-24 m-auto w-full max-w-md p-8 sm:border border-gray-200 rounded-xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Register</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full mt-10">Register</Button>
        </form>

        <Separator className="my-6" />

        <p className="text-sm">
          Have an account already?{" "}
          <Link to="/login" state={{ from: from }} className="text-indigo-700 hover:underline">
            Log in
          </Link>
        </p>
      </Form>
    </div>
  )
}
