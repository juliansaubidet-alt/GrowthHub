import { Bell, Search } from 'lucide-react'

export default function Topbar({ activeView, label }) {
  return (
    <header className="h-14 bg-white border-b border-n-200 flex items-center px-8 gap-3 shrink-0 z-40">
      <div className="flex items-center gap-1.5 text-[13px] text-n-600">
        <span>Home</span>
        <span className="text-n-400 text-sm leading-none">›</span>
        <span className="font-semibold text-n-950">{label}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-n-600 hover:bg-n-100 transition-colors">
          <Search size={17} />
        </button>
        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-n-600 hover:bg-n-100 transition-colors relative">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-r-600 border border-white" />
        </button>
      </div>
    </header>
  )
}
