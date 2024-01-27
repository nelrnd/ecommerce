import { Link } from "react-router-dom"

export default function Footer({ variant = "normal" }) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white px-8 py-24 border-t border-gray-200">
      <div className="w-[80rem] m-auto flex items-center justify-between gap-8">
        <div>
          <h3 className="text-xl mb-4">E-Commerce</h3>
          <p className="text-gray-600">© {year} E-Commerce. All rights reserved.</p>
        </div>
        {variant !== "minimum" && (
          <nav className="grid grid-cols-3 gap-24">
            <div>
              <h4 className="font-bold mb-3">About</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 hover:underline">
                    Our mission
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:underline">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:underline">
                    Affiliate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Customer service</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 hover:underline">
                    Help
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:underline">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:underline">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="#" className="text-gray-600 hover:underline">
                    +44 421 036 551
                  </Link>
                </li>
                <li>
                  <Link to="#" className="text-gray-600 hover:underline">
                    Email
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        )}
      </div>
    </footer>
  )
}
