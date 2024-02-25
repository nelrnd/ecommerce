import { useEffect } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCart } from "@/providers/CartProvider"
import { formatPrice } from "../utils"
import axios from "../axios"
import countries from "../countries.json"
import { CheckoutFooter } from "../components/Footer"
import OrderSummary from "../components/OrderSummary"
import { CheckoutNavBar } from "../components/NavBar"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Link, useNavigate } from "react-router-dom"
import { Checkbox } from "@/components/ui/checkbox"
import type { MaskitoOptions } from "@maskito/core"
import { useMaskito } from "@maskito/react"
import { maskitoDateOptionsGenerator } from "@maskito/kit"

export default function Checkout() {
  const { itemsLoading, items } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!itemsLoading && items.length < 1) {
      navigate("/")
    }
  }, [items, itemsLoading, navigate])

  return (
    <div className="min-h-screen bg-gray-100">
      <CheckoutNavBar />
      <div className="w-[64rem] max-w-full m-auto mb-16 px-2 md:px-4">
        <Checkout_Header />
        <Checkout_Form />
      </div>
      <CheckoutFooter />
    </div>
  )
}

function Checkout_Header() {
  return (
    <header className="py-8">
      <h1 className="scroll-m-20 text-2xl sm:text-4xl font-extrabold tracking-tight">Checkout</h1>
    </header>
  )
}

const cartItemSchema = z.object({
  _id: z.string(),
  sku: z.string(),
  product: z.string(),
  size: z.string().nullable(),
  quantity: z.number(),
})

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
  card_number: z
    .string()
    .min(1, "Card number is required")
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Card number must be 16 digits"),
  card_expires: z
    .string()
    .min(1, "Expiration date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiration date must be in MM/YY format"),
  card_cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3}$/, "CVV must be 3 digits"),
  accepts_terms: z.boolean().default(false),
  products: z.array(cartItemSchema),
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
      card_cvv: "",
      accepts_terms: false,
      products: [],
    },
  })

  const { watch, setValue } = form

  const shipingMethodValue = watch("shipping_method")

  const navigate = useNavigate()

  const { items } = useCart()

  useEffect(() => {
    if (items.length) {
      setValue(
        "products",
        items.map((item) => ({ ...item, product: item.product._id })),
        { shouldValidate: true }
      )
    }
  }, [items, navigate, setValue])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await axios.post("/order", values)
    const order = res.data
    if (order) {
      navigate("/order", { state: order })
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-8 gap-6 items-start">
          <CheckoutPersonalInfo form={form} />
          <CheckoutShippingMethod form={form} />
          <CheckoutPaymentInfo form={form} />
          <div className="md:row-start-1 md:col-start-6 md:col-span-3 md:sticky top-4">
            <OrderSummary items={items} shippingMethod={shipingMethodValue} />
          </div>
          <CheckoutContinue form={form} />
        </form>
      </Form>
    </div>
  )
}

import { cn } from "@/lib/utils"

interface CheckoutSectionProps {
  title?: string
  className?: string
  children: React.ReactNode
}

function CheckoutSection({ title, className, children }: CheckoutSectionProps) {
  return (
    <section className={cn("bg-white px-4 md:px-8 py-8 rounded-xl border border-gray-200 md:col-span-5", className)}>
      {title ? (
        <>
          <header className="mb-6">
            <h2 className="scroll-m-20 text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>
          </header>
          <main>{children}</main>
        </>
      ) : (
        children
      )}
    </section>
  )
}

function CheckoutPersonalInfo({ form }) {
  const countryValue = form.watch("country")

  useEffect(() => {
    if (countryValue) {
      const country = countries.find((country) => country.name === countryValue)
      form.setValue("phone_code", country.phone_code, { shouldValidate: true })
    }
  }, [countryValue, form])

  return (
    <CheckoutSection title="Personal info" className="md:col-span-5">
      <div className="space-y-6">
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
      </div>
    </CheckoutSection>
  )
}

function CheckoutShippingMethod({ form }) {
  return (
    <CheckoutSection title="Shipping method" className="md:col-span-5">
      <FormField
        control={form.control}
        name="shipping_method"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-3">
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
    </CheckoutSection>
  )
}

const cardMask: MaskitoOptions = {
  mask: [
    ...new Array(4).fill(/\d/),
    " ",
    ...new Array(4).fill(/\d/),
    " ",
    ...new Array(4).fill(/\d/),
    " ",
    ...new Array(4).fill(/\d/),
  ],
}

const expiresMask = maskitoDateOptionsGenerator({ mode: "mm/yy", separator: "/" })

const cvvMask: MaskitoOptions = {
  mask: [...new Array(3).fill(/\d/)],
}

function CheckoutPaymentInfo({ form }) {
  const cardRef = useMaskito({ options: cardMask })
  const expiresRef = useMaskito({ options: expiresMask })
  const cvvRef = useMaskito({ options: cvvMask })

  return (
    <CheckoutSection title="Payment info" className="md:col-span-5">
      <div className="space-y-6">
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
                <Input
                  {...field}
                  placeholder="0000 0000 0000 0000"
                  ref={cardRef}
                  onInput={(e) => form.setValue("card_number", e.currentTarget.value, { shouldValidate: true })}
                />
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
                  <Input
                    {...field}
                    placeholder="mm/yy"
                    ref={expiresRef}
                    onInput={(e) => form.setValue("card_expires", e.currentTarget.value, { shouldValidate: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="card_cvv"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVV</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="cvv"
                    ref={cvvRef}
                    onInput={(e) => form.setValue("card_cvv", e.currentTarget.value, { shouldValidate: true })}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </CheckoutSection>
  )
}

function CheckoutContinue({ form }) {
  const acceptTerms = form.watch("accepts_terms")

  return (
    <CheckoutSection className="md:col-span-5">
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

      <Button type="submit" className="w-full" disabled={acceptTerms === false}>
        Continue
      </Button>
    </CheckoutSection>
  )
}
