import { useState } from 'react'
import { TrendingUp } from 'lucide-react'
import { useApp } from '../App'

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

const ROLE_LABELS = {
  employee: 'Colaborador',
  manager: 'Manager',
  hr_admin: 'Admin',
}

const ROLE_BADGE_COLORS = {
  employee: 'bg-h-100 text-h-700',
  manager: 'bg-t-100 text-t-700',
  hr_admin: 'bg-p-100 text-p-700',
}

function NavItem({ item, active, onClick }) {
  if (item.id !== 'careerpath') {
    return (
      <div className="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg cursor-default">
        <div className="w-5 h-5 rounded bg-n-100 shrink-0" />
        <div className="h-2.5 rounded-full bg-n-100" style={{ width: `${40 + (item.label.length * 4)}px` }} />
      </div>
    )
  }
  return (
    <button
      onClick={() => onClick(item.id)}
      className={`w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-[13px] transition-all duration-100 ${
        active
          ? 'bg-h-50 text-h-600 font-semibold'
          : 'text-n-800 hover:bg-n-50 hover:text-n-950 font-normal'
      }`}
    >
      <TrendingUp size={16} className="shrink-0" />
      {item.label}
    </button>
  )
}

function getInitials(name) {
  if (!name) return '??'
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Sidebar({ activeView, setActiveView }) {
  const { users, selectedUser, setSelectedUser } = useApp()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const name = selectedUser?.name || ''
  const roleLabel = selectedUser ? (ROLE_LABELS[selectedUser.role] || selectedUser.role) : ''
  const roleDisplay = selectedUser
    ? (selectedUser.department ? selectedUser.department + ' · ' + roleLabel : roleLabel)
    : ''

  const initials = getInitials(name)

  const isAdmin = selectedUser?.role === 'hr_admin'

  return (
    <aside className="w-60 bg-white border-r border-n-200 flex flex-col shrink-0 h-screen sticky top-0 z-50">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-n-200 shrink-0">
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <img src="/hu-logo.jpeg" alt="hu" className="h-7 w-auto rounded-lg" />
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-p-100 text-p-800 tracking-wide">Admin</span>
          </div>
        ) : (
          <img src="/humand-logo.png" alt="humand" className="h-6 w-auto" />
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto scrollbar-thin">
        {NAV_MAIN.map(item => (
          <NavItem key={item.id} item={item} active={activeView === item.id} onClick={setActiveView} />
        ))}

        <div className="mt-4 mb-2">
          <div className="h-2 w-20 rounded-full bg-n-100 px-3 mb-3 ml-3" />
          {NAV_MGMT.map(item => (
            <NavItem key={item.id} item={item} active={activeView === item.id} onClick={setActiveView} />
          ))}
        </div>

        <div className="mt-2 mb-1">
          <div className="h-2 w-10 rounded-full bg-n-100 px-3 mb-3 ml-3" />
          {NAV_ADMIN.map(item => (
            <NavItem key={item.id} item={item} active={activeView === item.id} onClick={setActiveView} />
          ))}
        </div>
      </nav>

      {/* User footer with switcher */}
      <div className="p-3 border-t border-n-100 relative">
        {/* User menu dropdown (opens upward) */}
        {showUserMenu && users.length > 0 && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-xl shadow-8dp border border-n-200 py-2 max-h-64 overflow-y-auto z-50">
            <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest px-3 py-1.5">Cambiar usuario</p>
            {users.map(u => {
              const uInitials = getInitials(u.name)
              const uRoleLabel = ROLE_LABELS[u.role] || u.role
              const uBadgeColor = ROLE_BADGE_COLORS[u.role] || 'bg-n-100 text-n-700'
              const isSelected = selectedUser && selectedUser._id === u._id
              return (
                <button
                  key={u._id}
                  onClick={() => { setSelectedUser(u); setShowUserMenu(false) }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors ${isSelected ? 'bg-h-50' : 'hover:bg-n-50'}`}
                >
                  <div className={`w-7 h-7 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${ROLE_BADGE_COLORS[u.role] || 'bg-n-100 text-n-700'}`}>
                    {uInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-n-950 truncate">{u.name}</p>
                    <p className="text-[10px] text-n-600 truncate">{u.department ? u.department + ' \u00b7 ' : ''}{uRoleLabel}</p>
                  </div>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${uBadgeColor}`}>
                    {uRoleLabel}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <div
          onClick={() => setShowUserMenu(prev => !prev)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-n-50 cursor-pointer transition-colors"
        >
          <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${selectedUser ? (ROLE_BADGE_COLORS[selectedUser.role] || 'bg-h-100 text-h-600') : 'bg-h-100 text-h-600'}`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-n-950 truncate">{name}</p>
            <p className="text-[11px] text-n-600 truncate">{roleDisplay}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
