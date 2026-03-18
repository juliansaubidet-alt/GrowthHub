import { LayoutDashboard, User, Target, Activity, ClipboardList, ShieldCheck, Lock, LogOut, TrendingUp } from 'lucide-react'

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard },
  { id: 'onboarding', label: 'Mi Perfil',      icon: User },
  { id: 'objectives', label: 'Objetivos OKR',  icon: Target },
  { id: 'skillgap',   label: 'Skill Gap',      icon: Activity },
  { id: 'actionplan', label: 'Plan de Acción', icon: ClipboardList },
]

export default function Sidebar({ activeView, setActiveView, leaderRole, setLeaderRole, profile }) {
  const initials = profile?.role
    ? profile.role.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'GH'

  return (
    <aside className="w-60 bg-white border-r border-n-200 flex flex-col shrink-0 h-screen sticky top-0 z-50">
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-6 border-b border-n-200 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-h-500 flex items-center justify-center shrink-0">
          <TrendingUp size={14} className="text-white" />
        </div>
        <span className="text-base font-semibold text-n-950 tracking-tight">Growth Hub</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-0.5 overflow-y-auto scrollbar-thin">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeView === id
          return (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`w-full flex items-center gap-2 px-3 h-10 rounded-lg text-sm transition-all duration-100 ${
                active
                  ? 'bg-h-50 text-h-600 font-semibold'
                  : 'text-n-800 hover:bg-n-50 hover:text-n-950 font-normal'
              }`}
            >
              <Icon size={18} className="shrink-0" />
              {label}
            </button>
          )
        })}

        <div className="my-3 border-t border-n-100" />
        <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest px-3 mb-1">Admin</p>

        <button
          onClick={() => setActiveView('admin')}
          className={`w-full flex items-center gap-2 px-3 h-10 rounded-lg text-sm transition-all duration-100 ${
            activeView === 'admin'
              ? 'bg-h-50 text-h-600 font-semibold'
              : 'text-n-800 hover:bg-n-50 hover:text-n-950 font-normal'
          }`}
        >
          {leaderRole ? <ShieldCheck size={18} className="shrink-0" /> : <Lock size={18} className="shrink-0" />}
          <span className="flex-1 text-left">Admin</span>
          {leaderRole && (
            <span className="text-[9px] font-semibold bg-h-100 text-h-800 px-1.5 py-0.5 rounded-full">LÍDER</span>
          )}
        </button>

        {leaderRole && (
          <button
            onClick={() => { setLeaderRole(false); if (activeView === 'admin') setActiveView('dashboard') }}
            className="w-full flex items-center gap-2 px-3 h-9 rounded-lg text-xs text-n-600 hover:text-r-600 hover:bg-r-50 transition-all"
          >
            <LogOut size={14} className="shrink-0" />
            Cerrar sesión líder
          </button>
        )}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-n-100">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-n-50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-h-100 text-h-800 text-xs font-semibold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-n-950 truncate">
              {profile?.role || 'Mi Perfil'}
            </p>
            <p className="text-[11px] text-n-800 truncate">
              {profile?.industry || 'Configurar perfil'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
