import { buttonVariants } from "@/components/ui/button"
import { Link, useLocation, useRouteError } from "react-router-dom"

export default function Error() {
  const error = useRouteError()
  const location = useLocation()
  const from = location.pathname

  return (
    <div className="h-screen grid place-content-center">
      <div className="text-center space-y-4">
        <h1 className="scroll-m-20 text-5xl lg:text-8xl font-extrabold tracking-tight">{error.status || "500"}</h1>
        <p className="text-gray-600">{error.text || "Server error"}</p>
        <Link to={from} replace={true} className={buttonVariants()}>
          {error.status === 404 ? "Go back home" : "Try again"}
        </Link>
      </div>
    </div>
  )
}
