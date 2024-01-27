import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/providers/CartProvider"
import { formatPrice } from "../utils"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import countries from "../countries.json"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useEffect } from "react"

export default function Checkout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-[64rem] m-auto mb-16">
        <Checkout_Header />
        <Checkout_Form />
      </div>
    </div>
  )
}

function Checkout_Header() {
  return (
    <header className="py-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Checkout</h1>
    </header>
  )
}

const formSchema = z.object({
  first_name: z.string().min(2).max(50),
  last_name: z.string().min(2).max(50),
  email: z.string().min(1).email("This is not a valid email"),
  country: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip_code: z.string().min(1),
  phone_code: z.number(),
  phone: z.number(),
  shipping_method: z.string(),
  card_name: z.string().min(2),
  card_number: z.number(),
  card_expires: z.string().length(3),
  card_cvc: z.number().int().lte(999),
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
      state: "",
      zip_code: "",
      //phone_code: 0,
      //phone: 0,
      shipping_method: shippingMethods[0].name,
      card_name: "",
      //card_number: 0,
      //card_expires: 0,
      //card_cvc: 0
    },
  })
  const { watch, setValue } = form

  const countryValue = watch("country")
  const shipingMethodValue = watch("shipping_method")

  useEffect(() => {
    if (countryValue) {
      const country = countries.find((country) => country.name === countryValue)
      setValue("phone_code", country.phone_code)
    }
  }, [countryValue, setValue])

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-8 gap-6 items-start">
          <section className="bg-white p-8 rounded-xl border border-gray-200 col-span-5">
            <header className="mb-6">
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Personal info</h2>
            </header>
            <main className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
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

              <div className="grid grid-cols-2 gap-6">
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
                      <FormLabel>State</FormLabel>
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

              <div className="grid grid-cols-2 gap-6">
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

          <section className="bg-white p-8 rounded-xl border border-gray-200 col-span-5">
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
                          <FormItem className="flex items-center space-x-3 space-y-0">
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

          <section className="bg-white p-8 rounded-xl border border-gray-200 col-span-5">
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

              <div className="grid grid-cols-2 gap-6">
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
                        <Input type="number" {...field} placeholder="CVC" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </main>
          </section>

          <Checkout_Summary shippingMethodValue={shipingMethodValue} />

          <section className="bg-white p-8 rounded-xl border border-gray-200 col-span-5">
            <Button className="w-full">Continue</Button>
          </section>
        </form>
      </Form>
    </div>
  )
}

function Checkout_Summary({ shippingMethodValue }) {
  const nbOfItems = 6
  const items = [
    {
      _id: 1,
      name: "Stussy Basic Tee",
      size: "M",
      quantity: 3,
      price: 50,
    },
    {
      _id: 2,
      name: "Lacoste Jacket",
      size: "M",
      quantity: 1,
      price: 200,
    },
    {
      _id: 3,
      name: "Arc'Teryx Beanie",
      quantity: 1,
      price: 40,
    },
  ]

  const shippingMethod = shippingMethods.find((m) => m.name === shippingMethodValue)
  const shippingPrice = shippingMethod.price
  const subTotalPrice = items.reduce((prev, curr) => prev + curr.price * curr.quantity, 0)
  const totalPrice = shippingPrice + subTotalPrice

  return (
    <aside className="bg-white p-8 rounded-xl border border-gray-200 row-start-1 col-start-6 col-span-3 sticky top-4">
      <header className="mb-8 flex items-baseline justify-between">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">Summary</h2>
        <p className="text-sm text-gray-600">
          {nbOfItems} {nbOfItems > 1 ? "items" : "item"}
        </p>
      </header>
      <Separator />
      <main className="mt-8 mb-8 space-y-4">
        {items.map((item) => (
          <Checkout_SummaryItem key={item._id} item={item} />
        ))}
      </main>
      <footer>
        <div className="mb-2 flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(subTotalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatPrice(shippingPrice)}</span>
        </div>
        <Separator className="my-3" />
        <div className="font-semibold text-lg flex justify-between">
          <span>Total</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
      </footer>
    </aside>
  )
}

function Checkout_SummaryItem({ item }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[5rem] bg-gray-200 aspect-square"></div>
      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p>{formatPrice(250)}</p>
        <div className="text-sm text-gray-600 flex gap-3">
          <span>{item.size ? "Size: " + item.size : "One size"}</span>
          <span>Quantity: {item.quantity}</span>
        </div>
      </div>
    </div>
  )
}
