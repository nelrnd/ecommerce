export default function Layout({ children }) {
  return <div className="w-[64rem] max-w-full mx-auto px-3 sm:px-4">{children}</div>
}

export function ProductGrid({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6 sm:gap-y-8">{children}</div>
}

export function Section({ className = "", children }) {
  const sectionClasses = `py-14 ${className || ""}`
  return (
    <section className={sectionClasses}>
      <Layout>{children}</Layout>
    </section>
  )
}
