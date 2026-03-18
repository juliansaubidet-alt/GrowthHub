const NAV_MAIN = [
  { id: 'home',        label: 'Home',        emoji: '🏠' },
  { id: 'careerpath',  label: 'Career Path', emoji: '🗺️' },
  { id: 'people',      label: 'People',      emoji: '👥' },
  { id: 'performance', label: 'Performance', emoji: '📊' },
  { id: 'learning',    label: 'Learning',    emoji: '📚' },
]

const NAV_MGMT = [
  { id: 'goals',    label: 'Goals',   emoji: '🎯' },
  { id: 'reviews',  label: 'Reviews', emoji: '📋' },
  { id: 'meetings', label: '1:1s',    emoji: '🤝' },
]

const NAV_ADMIN = [
  { id: 'settings', label: 'Settings', emoji: '⚙️' },
]

function NavItem({ item, active, onClick }) {
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-[13px] transition-all duration-100 ${
        active
          ? 'bg-h-50 text-h-600 font-semibold'
          : 'text-n-800 hover:bg-n-50 hover:text-n-950 font-normal'
      }`}
    >
      <span className="text-base leading-none shrink-0">{item.emoji}</span>
      {item.label}
    </button>
  )
}

export default function Sidebar({ activeView, setActiveView, leaderRole, setLeaderRole, profile }) {
  const name = profile?.role ? profile.role : 'Sofia Carro'
  const role = profile?.industry ? profile.industry : 'Product Designer · Mid'

  const initials = name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <aside className="w-60 bg-white border-r border-n-200 flex flex-col shrink-0 h-screen sticky top-0 z-50">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-n-200 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-h-500 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-[15px] leading-none">H</span>
        </div>
        <span className="text-[15px] font-semibold text-n-950 tracking-tight">humand</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto scrollbar-thin">
        {NAV_MAIN.map(item => (
          <NavItem key={item.id} item={item} active={activeView === item.id} onClick={setActiveView} />
        ))}

        <div className="mt-4 mb-2">
          <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest px-3 mb-1.5">Management</p>
          {NAV_MGMT.map(item => (
            <NavItem key={item.id} item={item} active={activeView === item.id} onClick={setActiveView} />
          ))}
        </div>

        <div className="mt-2 mb-1">
          <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest px-3 mb-1.5">Admin</p>
          {NAV_ADMIN.map(item => (
            <NavItem key={item.id} item={item} active={activeView === item.id} onClick={setActiveView} />
          ))}
          {leaderRole && (
            <NavItem
              item={{ id: 'admin', label: 'Admin Panel', emoji: '🛡️' }}
              active={activeView === 'admin'}
              onClick={setActiveView}
            />
          )}
        </div>
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-n-100">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-n-50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-h-100 text-h-600 text-xs font-bold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-n-950 truncate">{name}</p>
            <p className="text-[11px] text-n-600 truncate">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
