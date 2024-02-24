import { Link } from "react-router-dom"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-100 px-8 py-12 border-t border-gray-200 lg:py-24">
      <div className="w-[80rem] max-w-full m-auto">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          <div className="md:col-span-3">
            <h3 className="text-xl mb-4">E-Commerce</h3>
            <p className="text-gray-600">©{year} E-Commerce. All rights reserved.</p>
          </div>
          {[
            {
              title: "About",
              links: ["Our mission", "Careers", "Affiliate"],
            },
            {
              title: "Customer service",
              links: ["Help", "Shipping", "Returns"],
            },
            {
              title: "Contact",
              links: ["+44 421 036 551", "Write us an email"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-gray-600 hover:underline">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export function CheckoutFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-white px-8 py-12 border-t border-gray-200 lg:py-24">
      <div className="w-[80rem] max-w-full m-auto">
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          <div className="md:col-span-3">
            <h3 className="text-xl mb-4">E-Commerce</h3>
            <p className="text-gray-600">©{year} E-Commerce. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
