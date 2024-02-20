interface BadgeProps {
  count: number
}

export default function Badge({ count }: BadgeProps) {
  const text = count < 10 ? count : "9+"

  if (count === 0) return null

  return (
    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white text-xs font-semibold grid place-content-center absolute -right-1 -top-1">
      <span>{text}</span>
    </div>
  )
}
