import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email format is invalid"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
})

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="mt-24 m-auto w-full max-w-md p-8 border border-gray-200 rounded-xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-6">Login</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <Button className="w-full mt-10">Log in</Button>
        </form>

        <Separator className="my-6" />

        <p className="text-sm">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-indigo-700 hover:underline">
            Register
          </Link>
        </p>
      </Form>
    </div>
  )
}
