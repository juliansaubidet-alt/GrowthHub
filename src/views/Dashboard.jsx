import { Target, TrendingUp, CheckCircle2, AlertCircle, Clock, Flame, ArrowUpRight } from 'lucide-react'
import { useApp } from '../App'

const PRIORITY_COLOR = { high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-green-100 text-green-700' }
const PRIORITY_LABEL = { high: 'Alta', medium: 'Media', low: 'Baja' }

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
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
    .slice(0, 3)

  const doneActions = actionItems.filter(a => a.done).length
  const upcomingDeadlines = objectives
    .filter(o => {
      const diff = (new Date(o.deadline) - new Date()) / 86400000
      return diff >= 0 && diff <= 60
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting()}{profile.role ? `, ${profile.role.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-gray-500 mt-1">Aquí está el resumen de tu progreso profesional</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Target}       label="Objetivos OKR"    value={totalOKR}           sub={`${avgOKRProgress}% completado`} color="bg-indigo-100 text-indigo-600" />
        <StatCard icon={TrendingUp}   label="Progreso promedio" value={`${avgOKRProgress}%`} sub="de tus OKRs"              color="bg-violet-100 text-violet-600" />
        <StatCard icon={CheckCircle2} label="Acciones completadas" value={doneActions}    sub={`de ${actionItems.length} total`} color="bg-emerald-100 text-emerald-600" />
        <StatCard icon={Flame}        label="Brechas críticas" value={criticalGaps.length} sub="skills prioritarias"       color="bg-orange-100 text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OKR Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Objetivos OKR</h2>
            <span className="text-xs text-gray-400">{totalOKR} objetivos</span>
          </div>
          {objectives.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin objetivos aún</p>
          ) : (
            <div className="space-y-4">
              {objectives.slice(0, 3).map(obj => {
                const done = obj.keyResults.filter(k => k.done).length
                const pct = obj.keyResults.length ? Math.round(done / obj.keyResults.length * 100) : 0
                return (
                  <div key={obj.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-gray-700 truncate flex-1 mr-2">{obj.title}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLOR[obj.priority]}`}>
                          {PRIORITY_LABEL[obj.priority]}
                        </span>
                        <span className="text-xs text-gray-500">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{done}/{obj.keyResults.length} key results · vence {new Date(obj.deadline).toLocaleDateString('es', { day:'numeric', month:'short', year:'numeric' })}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Skill Gaps */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Top Brechas de Skills</h2>
            <span className="text-xs text-gray-400">gap = requerido − actual</span>
          </div>
          {criticalGaps.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin brechas detectadas</p>
          ) : (
            <div className="space-y-4">
              {criticalGaps.map((s, i) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : 'bg-amber-500'}`}>
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium text-gray-700">{s.name}</p>
                    </div>
                    <p className="text-xs text-gray-500">{s.current} → {s.required} <span className="text-red-500 font-medium">({s.gap > 0 ? '+' : ''}{s.gap})</span></p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden relative">
                    <div className="h-full bg-indigo-200 rounded-full" style={{ width: `${(s.required / 10) * 100}%` }} />
                    <div className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full" style={{ width: `${(s.current / 10) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-4">Próximos Vencimientos</h2>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin vencimientos en los próximos 60 días</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map(obj => {
                const diff = Math.ceil((new Date(obj.deadline) - new Date()) / 86400000)
                const urgent = diff <= 14
                return (
                  <div key={obj.id} className={`flex items-center gap-3 p-3 rounded-xl ${urgent ? 'bg-red-50 border border-red-100' : 'bg-gray-50'}`}>
                    <Clock size={16} className={urgent ? 'text-red-500' : 'text-gray-400'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{obj.title}</p>
                      <p className="text-xs text-gray-400">{new Date(obj.deadline).toLocaleDateString('es', { day:'numeric', month:'long' })}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${urgent ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-600'}`}>
                      {diff}d
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white">
          <h2 className="font-semibold mb-4">Acciones Pendientes</h2>
          {actionItems.filter(a => !a.done).length === 0 ? (
            <p className="text-indigo-200 text-sm text-center py-6">Todo completado 🎉</p>
          ) : (
            <div className="space-y-2.5">
              {actionItems.filter(a => !a.done).slice(0, 4).map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-2.5">
                  <AlertCircle size={14} className="text-indigo-200 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{item.title}</p>
                    <p className="text-[10px] text-indigo-300">{item.skill} · Semana {item.week}</p>
                  </div>
                  <ArrowUpRight size={13} className="text-indigo-300 shrink-0" />
                </div>
              ))}
              {actionItems.filter(a => !a.done).length > 4 && (
                <p className="text-xs text-indigo-300 text-center mt-1">+{actionItems.filter(a => !a.done).length - 4} más en Plan de Acción</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
