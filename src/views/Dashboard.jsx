import { Target, TrendingUp, CheckCircle2, Flame, Clock, ArrowRight } from 'lucide-react'
import { useApp } from '../App'

function StatCard({ icon: Icon, label, value, sub, iconBg, iconColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-4dp p-6 flex flex-col gap-3 hover:shadow-8dp transition-shadow">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-n-950">{value}</p>
        <p className="text-xs text-n-800 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-n-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function ProgressRing({ pct, color = '#496be3', size = 72 }) {
  const r = 30, circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx="36" cy="36" r={r} fill="none" stroke="#eeeef1" strokeWidth="5" />
        <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          className="ring-progress" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-semibold text-n-950">{pct}%</span>
        <span className="text-[10px] text-n-800">done</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { profile, objectives, skills, actionItems } = useApp()

  const totalOKR = objectives.length
  const avgOKRProgress = totalOKR
    ? Math.round(objectives.reduce((s, o) => {
        const done = o.keyResults.filter(k => k.done).length
        return s + (o.keyResults.length ? done / o.keyResults.length * 100 : 0)
      }, 0) / totalOKR)
    : 0

  const criticalGaps = skills
    .map(s => ({ ...s, gap: s.required - s.current }))
    .filter(s => s.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 4)

  const doneActions  = actionItems.filter(a => a.done).length
  const pendingItems = actionItems.filter(a => !a.done).slice(0, 4)

  const upcomingDeadlines = objectives
    .filter(o => { const diff = (new Date(o.deadline) - new Date()) / 86400000; return diff >= 0 && diff <= 60 })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const PRIORITY_BADGE = {
    high:   'bg-r-100 text-r-600',
    medium: 'bg-y-100 text-y-700',
    low:    'bg-g-100 text-g-800',
  }
  const PRIORITY_LABEL = { high: 'Alta', medium: 'Media', low: 'Baja' }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-n-950">
          {greeting()}{profile.role ? `, ${profile.role.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-sm text-n-800 mt-1">Resumen de tu progreso profesional</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Target}       label="Objetivos OKR"        value={totalOKR}             sub={`${avgOKRProgress}% completado`}      iconBg="bg-h-50"  iconColor="text-h-600" />
        <StatCard icon={TrendingUp}   label="Progreso promedio"    value={`${avgOKRProgress}%`} sub="de tus OKRs"                           iconBg="bg-s-100" iconColor="text-s-800" />
        <StatCard icon={CheckCircle2} label="Acciones completadas" value={doneActions}           sub={`de ${actionItems.length} totales`}   iconBg="bg-g-100" iconColor="text-g-800" />
        <StatCard icon={Flame}        label="Brechas críticas"     value={criticalGaps.length}   sub="skills prioritarias"                  iconBg="bg-y-100" iconColor="text-y-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* OKR Progress */}
        <div className="bg-white rounded-2xl shadow-4dp overflow-hidden hover:shadow-8dp transition-shadow">
          <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-n-950">Objetivos OKR</p>
              <p className="text-xs text-n-800 mt-0.5">{totalOKR} objetivos activos</p>
            </div>
            <ProgressRing pct={avgOKRProgress} />
          </div>
          <div className="p-6">
            {objectives.length === 0 ? (
              <p className="text-sm text-n-600 text-center py-4">Sin objetivos aún</p>
            ) : (
              <div className="space-y-4">
                {objectives.slice(0, 3).map(obj => {
                  const done = obj.keyResults.filter(k => k.done).length
                  const pct  = obj.keyResults.length ? Math.round(done / obj.keyResults.length * 100) : 0
                  return (
                    <div key={obj.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[13px] font-semibold text-n-950 truncate flex-1 mr-2">{obj.title}</p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_BADGE[obj.priority]}`}>
                            {PRIORITY_LABEL[obj.priority]}
                          </span>
                          <span className="text-xs font-semibold text-n-800">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-1 bg-n-100 rounded-full overflow-hidden">
                        <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-[11px] text-n-600 mt-1">{done}/{obj.keyResults.length} key results · {new Date(obj.deadline).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Skill Gaps */}
        <div className="bg-white rounded-2xl shadow-4dp overflow-hidden hover:shadow-8dp transition-shadow">
          <div className="px-6 py-4 border-b border-n-100">
            <p className="text-sm font-semibold text-n-950">Top Brechas de Skills</p>
            <p className="text-xs text-n-800 mt-0.5">Diferencia entre nivel actual y requerido</p>
          </div>
          <div className="p-6">
            {criticalGaps.length === 0 ? (
              <p className="text-sm text-n-600 text-center py-4">Sin brechas detectadas</p>
            ) : (
              <div className="space-y-4">
                {criticalGaps.map((s, i) => {
                  const pctCurrent  = (s.current  / 10) * 100
                  const pctRequired = (s.required / 10) * 100
                  const colors = ['bg-r-100 text-r-600', 'bg-y-100 text-y-700', 'bg-g-100 text-g-800', 'bg-s-100 text-s-800']
                  const barColors = ['bg-r-400', 'bg-y-400', 'bg-g-400', 'bg-s-400']
                  return (
                    <div key={s.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-[10px] font-semibold flex items-center justify-center ${colors[i]}`}>{i + 1}</span>
                          <p className="text-[13px] font-semibold text-n-950">{s.name}</p>
                        </div>
                        <span className="text-xs text-n-800">{s.current} / {s.required}</span>
                      </div>
                      <div className="h-1.5 bg-n-100 rounded-full overflow-hidden relative">
                        <div className={`absolute top-0 left-0 h-full rounded-full opacity-30 ${barColors[i]}`} style={{ width: `${pctRequired}%` }} />
                        <div className={`absolute top-0 left-0 h-full rounded-full bar-fill ${barColors[i]}`} style={{ width: `${pctCurrent}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl shadow-4dp overflow-hidden hover:shadow-8dp transition-shadow">
          <div className="px-6 py-4 border-b border-n-100">
            <p className="text-sm font-semibold text-n-950">Próximos Vencimientos</p>
            <p className="text-xs text-n-800 mt-0.5">Objetivos con plazo en 60 días</p>
          </div>
          <div className="p-6">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-sm text-n-600 text-center py-4">Sin vencimientos próximos</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map(obj => {
                  const diff   = Math.ceil((new Date(obj.deadline) - new Date()) / 86400000)
                  const urgent = diff <= 14
                  return (
                    <div key={obj.id} className={`flex items-center gap-3 p-3 rounded-lg border ${urgent ? 'bg-r-50 border-r-100' : 'bg-n-50 border-n-100'}`}>
                      <Clock size={16} className={urgent ? 'text-r-600' : 'text-n-600'} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-n-950 truncate">{obj.title}</p>
                        <p className="text-[11px] text-n-800">{new Date(obj.deadline).toLocaleDateString('es', { day: 'numeric', month: 'long' })}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${urgent ? 'bg-r-100 text-r-600' : 'bg-n-100 text-n-800'}`}>
                        {diff}d
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-2xl shadow-4dp overflow-hidden hover:shadow-8dp transition-shadow">
          <div className="px-6 py-4 border-b border-n-100">
            <p className="text-sm font-semibold text-n-950">Acciones Pendientes</p>
            <p className="text-xs text-n-800 mt-0.5">{actionItems.filter(a => !a.done).length} tareas por completar</p>
          </div>
          <div className="p-5">
            {pendingItems.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-sm text-n-600 font-semibold">Todo completado</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingItems.map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-n-200 hover:border-h-400 hover:shadow-8dp cursor-pointer transition-all">
                    <div className="w-8 h-8 rounded-lg bg-h-50 flex items-center justify-center shrink-0 text-sm">
                      {item.type === 'curso' ? '📚' : item.type === 'proyecto' ? '💻' : item.type === 'libro' ? '📖' : '🎯'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-n-950 truncate">{item.title}</p>
                      <p className="text-[11px] text-n-800">{item.skill} · Semana {item.week}</p>
                    </div>
                    <ArrowRight size={14} className="text-n-400 shrink-0" />
                  </div>
                ))}
                {actionItems.filter(a => !a.done).length > 4 && (
                  <p className="text-xs text-n-600 text-center pt-1">+{actionItems.filter(a => !a.done).length - 4} más en Plan de Acción</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
