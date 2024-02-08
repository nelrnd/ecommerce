import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCart } from "@/providers/CartProvider"
import { formatPrice } from "../utils"
import countries from "../countries.json"
import Footer from "../components/Footer"
import OrderSummary from "../components/OrderSummary"
import NavBar from "../components/NavBar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Link, useNavigate } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox"

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar minimized={true} />
      <div className="w-[64rem] max-w-full m-auto mb-16 px-4">
        <Checkout_Header />
        <Checkout_Form />
      </div>
      <Footer minimized={true} />
    </div>
  )
}

function Checkout_Header() {
  return (
    <header className="py-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Checkout</h1>
    </header>
  )
}

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Email format is invalid"),
  country: z.string().min(1, "Country is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1).optional(),
  zip_code: z.string().min(1, "Zip code is required"),
  phone_code: z.string().min(1, "Phone code is required"),
  phone: z.string().min(1, "Phone is required"),
  shipping_method: z.string().min(1, "Shipping method is required"),
  card_name: z.string().min(1, "Cardholder's name is required"),
  card_number: z.string().min(1, "Card number is required"),
  card_expires: z.string().min(1, "Card expiration date is required"),
  card_cvc: z.string().min(1, "Card CVC is required").length(3, "CVC must be 3 characters long"),
  accepts_terms: z.boolean().default(false),
})

const shippingMethods = [
  { name: "standard", price: 0, text: "FREE | 5-6 days | Standard" },
  { name: "business", price: 10, text: `${formatPrice(10)} | 2-3 days | Business` },
]

function Checkout_Form() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      country: "",
      address: "",
      city: "",
      state: undefined,
      zip_code: "",
      phone_code: "",
      phone: "",
      shipping_method: shippingMethods[0].name,
      card_name: "",
      card_number: "",
      card_expires: "",
      card_cvc: "",
      accepts_terms: false,
    },
  })
  const { watch, setValue } = form
  const countryValue = watch("country")
  const shipingMethodValue = watch("shipping_method")
  const acceptTerms = watch("accepts_terms")
  const navigate = useNavigate()

  const { items } = useCart()

  useEffect(() => {
    if (countryValue) {
      const country = countries.find((country) => country.name === countryValue)
      setValue("phone_code", country.phone_code)
    }
  }, [countryValue, setValue])

  /*
  useEffect(() => {
    if (items.length === 0) {
      navigate("/")
    }
  }, [items, navigate])
  */

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (acceptTerms === false) return
    console.log(values)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-8 gap-6 items-start">
          <section className="bg-white p-8 rounded-xl border border-gray-200 md:col-span-5">
            <header className="mb-6">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Personal info</h2>
            </header>
            <main className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.name}>
                            {country.emoji} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        State <span className="font-normal text-gray-600">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="zip_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal or zip code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country calling code</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country calling code" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country.id} value={country.phone_code}>
                              {country.emoji} +{country.phone_code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </main>
          </section>

          <section className="bg-white p-8 rounded-xl border border-gray-200 md:col-span-5">
            <header className="mb-6">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Shipping method</h2>
            </header>
            <main className="space-y-6">
              <FormField
                control={form.control}
                name="shipping_method"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col gap-3"
                      >
                        {shippingMethods.map((method) => (
                          <FormItem key={method.name} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={method.name} />
                            </FormControl>
                            <FormLabel className="mt-0 font-normal">{method.text}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </main>
          </section>

          <section className="bg-white p-8 rounded-xl border border-gray-200 md:col-span-5">
            <header className="mb-6">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Payment info</h2>
            </header>
            <main className="space-y-6">
              <FormField
                control={form.control}
                name="card_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder's name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="card_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="1234 1234 1234 1234" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="card_expires"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MM/YY" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="card_cvc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="CVC" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </main>
          </section>

          <div className="md:row-start-1 md:col-start-6 md:col-span-3 md:sticky top-4">
            <OrderSummary items={items} shippingMethod={shipingMethodValue} />
          </div>

          <section className="bg-white p-8 rounded-xl border border-gray-200 md:col-span-5">
            <FormField
              control={form.control}
              name="accepts_terms"
              render={({ field }) => (
                <FormItem className="flex items-end mb-4 gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel>
                    By clicking this, I agree to{" "}
                    <Link to="#" className="text-indigo-700 hover:underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="text-indigo-700 hover:underline">
                      Privacy Policy
                    </Link>
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={acceptTerms === false}>
              Continue
            </Button>
          </section>
        </form>
      </Form>
    </div>
  )
}
