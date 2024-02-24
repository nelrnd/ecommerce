import { BiImage } from "react-icons/bi"

const API_BASE = import.meta.env.VITE_API_BASE

export default function ProductImage({ src, className = "" }) {
  return (
    <div className={`relative aspect-square bg-gray-200 ${className}`}>
      {src ? (
        <img src={API_BASE + "/" + src} alt="" className="block w-full h-full object-cover" />
      ) : (
        <div className="text-5xl text-gray-400 h-full flex items-center justify-center opacity-50 select-none">
          <BiImage className="w-1/2" />
        </div>
      )}
    </div>
  )
}
