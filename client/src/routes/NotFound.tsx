import { buttonVariants } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="h-full grid place-content-center">
      <div className="mt-8 text-center">
        <h1 className="scroll-m-20 text-5xl lg:text-8xl mb-2 lg:mb-4 font-extrabold tracking-tight">404</h1>
        <p className="text-gray-600 mb-4">Page not found, sorry</p>
        <Link to="/" className={buttonVariants()}>
          Go back home
        </Link>
      </div>
    </div>
  )
}
