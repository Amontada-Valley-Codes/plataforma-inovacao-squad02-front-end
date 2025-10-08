import { MessageSquareText } from 'lucide-react'

export default function Comentarios() {
  return (
    <button 
      className='flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 rounded hover:bg-gray-100 hover:text-[#F4A136]'
    >
      <MessageSquareText className="w-4.5 h-4.5"/>
      <span className='font-medium'>11</span>
    </button>
  )
}

{/* #f48C24 #F4A136 */ }
