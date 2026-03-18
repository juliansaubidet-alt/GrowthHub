import { LayoutDashboard, User, Target, Activity, ClipboardList, ChevronLeft, ChevronRight, TrendingUp, ShieldCheck, Lock, LogOut } from 'lucide-react'
import { useApp } from '../App'

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',     icon: LayoutDashboard, desc: 'Vista general' },
  { id: 'onboarding', label: 'Mi Perfil',      icon: User,            desc: 'Configurar perfil' },
  { id: 'objectives', label: 'Objetivos OKR',  icon: Target,          desc: 'Metas y key results' },
  { id: 'skillgap',   label: 'Skill Gap',      icon: Activity,        desc: 'Análisis de brechas' },
  { id: 'actionplan', label: 'Plan de Acción', icon: ClipboardList,   desc: 'Recursos y timeline' },
]

export default function Sidebar({ activeView, setActiveView, open, setOpen }) {
  const { profile, leaderRole, setLeaderRole } = useApp()

  return (
    <aside
      className={`relative flex flex-col bg-gray-900 text-white transition-all duration-300 shrink-0 ${open ? 'w-64' : 'w-16'}`}
    >
      {/* Toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shadow-md hover:bg-indigo-500 transition-colors"
      >
        {open ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
      </button>

      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-700/60 ${!open && 'justify-center'}`}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 shadow">
          <TrendingUp size={15} className="text-white" />
        </div>
        {open && (
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight">CareerPath</p>
            <p className="text-[10px] text-gray-400 truncate">Planificador Pro</p>
          </div>
        )}
      </div>

      {/* Profile chip */}
      {open && profile.role && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700">
          <p className="text-xs text-gray-400 truncate">{profile.role}</p>
          {profile.industry && <p className="text-[10px] text-indigo-400 truncate mt-0.5">{profile.industry}</p>}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {NAV.map(({ id, label, icon: Icon, desc }) => {
          const active = activeView === id
          return (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              title={!open ? label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              } ${!open && 'justify-center'}`}
            >
              <Icon size={18} className="shrink-0" />
              {open && (
                <div className="min-w-0 text-left">
                  <p className="leading-tight truncate">{label}</p>
                  {!active && <p className="text-[10px] text-gray-500 truncate group-hover:text-gray-400">{desc}</p>}
                </div>
              )}
            </button>
          )
        })}

        {/* Divider */}
        <div className="my-2 border-t border-gray-700/60" />

        {/* Admin button */}
        <button
          onClick={() => setActiveView('admin')}
          title={!open ? 'Admin' : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
            activeView === 'admin'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-gray-500 hover:bg-gray-800 hover:text-amber-400'
          } ${!open && 'justify-center'}`}
        >
          {leaderRole
            ? <ShieldCheck size={18} className="shrink-0" />
            : <Lock size={18} className="shrink-0" />
          }
          {open && (
            <div className="min-w-0 text-left flex-1">
              <p className="leading-tight truncate">Admin</p>
              {activeView !== 'admin' && (
                <p className="text-[10px] truncate group-hover:text-amber-500/70 text-gray-600">
                  {leaderRole ? 'Sesión activa' : 'Solo líderes'}
                </p>
              )}
            </div>
          )}
          {open && leaderRole && (
            <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-bold shrink-0">LÍDER</span>
          )}
        </button>

        {/* Logout leader */}
        {leaderRole && (
          <button
            onClick={() => { setLeaderRole(false); if (activeView === 'admin') setActiveView('dashboard') }}
            title={!open ? 'Cerrar sesión líder' : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-gray-600 hover:text-red-400 hover:bg-gray-800 transition-all ${!open && 'justify-center'}`}
          >
            <LogOut size={14} className="shrink-0" />
            {open && <span>Cerrar sesión líder</span>}
          </button>
        )}
      </nav>

      {/* Footer */}
      {open && (
        <div className="p-3 border-t border-gray-700/60">
          <p className="text-[10px] text-gray-600 text-center">v1.0 · Career Planning</p>
        </div>
      )}
    </aside>
  )
}
