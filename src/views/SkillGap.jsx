import { useState } from 'react'
import { Activity, Lightbulb, TrendingUp, AlertTriangle, Plus, Trash2 } from 'lucide-react'
import { useApp } from '../App'

// Pure SVG Radar Chart — no external dependencies
function RadarChart({ skills, size = 380 }) {
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.34
  const n = skills.length
  if (n < 3) return null

  const angle = (i) => (2 * Math.PI * i) / n - Math.PI / 2
  const point = (i, val, max = 10) => ({
    x: cx + (val / max) * R * Math.cos(angle(i)),
    y: cy + (val / max) * R * Math.sin(angle(i)),
  })
  const labelPoint = (i) => ({
    x: cx + (R + 32) * Math.cos(angle(i)),
    y: cy + (R + 32) * Math.sin(angle(i)),
  })
  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  const rings = [2, 4, 6, 8, 10]
  const currentPts  = skills.map((s, i) => point(i, s.current))
  const requiredPts = skills.map((s, i) => point(i, s.required))

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Rings */}
      {rings.map(v => (
        <polygon
          key={v}
          points={skills.map((_, i) => { const p = point(i, v); return `${p.x},${p.y}` }).join(' ')}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}
      {/* Ring labels */}
      {rings.map(v => (
        <text key={`l${v}`} x={cx + 3} y={cy - (v / 10) * R + 4} fontSize="9" fill="#9ca3af">{v}</text>
      ))}
      {/* Axes */}
      {skills.map((_, i) => {
        const end = point(i, 10)
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#e5e7eb" strokeWidth="1" />
      })}
      {/* Required area */}
      <path d={toPath(requiredPts)} fill="rgba(99,102,241,0.15)" stroke="rgb(99,102,241)" strokeWidth="2" strokeLinejoin="round" />
      {/* Current area */}
      <path d={toPath(currentPts)} fill="rgba(16,185,129,0.25)" stroke="rgb(16,185,129)" strokeWidth="2" strokeLinejoin="round" />
      {/* Dots */}
      {requiredPts.map((p, i) => <circle key={`rd${i}`} cx={p.x} cy={p.y} r="4" fill="rgb(99,102,241)" />)}
      {currentPts.map((p, i) => <circle key={`cd${i}`} cx={p.x} cy={p.y} r="4" fill="rgb(16,185,129)" stroke="white" strokeWidth="1.5" />)}
      {/* Labels */}
      {skills.map((s, i) => {
        const lp = labelPoint(i)
        const textAnchor = lp.x < cx - 5 ? 'end' : lp.x > cx + 5 ? 'start' : 'middle'
        return (
          <text key={`label${i}`} x={lp.x} y={lp.y} textAnchor={textAnchor} dominantBaseline="middle" fontSize="11" fill="#374151" fontWeight="500">
            {s.name}
          </text>
        )
      })}
    </svg>
  )
}

const AI_SUGGESTIONS = {
  'Liderazgo':    { action: 'Solicita liderar el próximo proyecto del equipo, aunque sea pequeño. La práctica real supera cualquier curso.', resource: 'Curso "The Manager\'s Path" (O\'Reilly) + 1:1s semanales con tu líder actual.', time: '3-6 meses' },
  'Comunicación': { action: 'Presenta en la reunión semanal del equipo y busca feedback inmediato. Incrementa gradualmente la audiencia.', resource: 'Toastmasters o curso de Storytelling (LinkedIn Learning). Practica 15 min/día.', time: '2-4 meses' },
  'React':        { action: 'Construye un proyecto personal con React + TypeScript, usa hooks avanzados y code-splitting.', resource: 'Epic React (Kent C. Dodds) o documentación oficial + proyectos en GitHub.', time: '1-3 meses' },
  'Node.js':      { action: 'Desarrolla una API REST completa con autenticación y desplegala en producción.', resource: 'Curso Node.js en Udemy (Maximilian) + GitHub Projects.', time: '2-3 meses' },
  'SQL / Datos':  { action: 'Analiza datasets reales de tu empresa y presenta los insights al equipo.', resource: 'Mode Analytics SQL School (gratis) + Kaggle datasets para práctica.', time: '1-2 meses' },
  'Agile / Scrum':{ action: 'Obtén la certificación PSM I y propone mejorar el proceso de tu equipo actual.', resource: 'scrum.org — PSM I (exam $150). Materiales de estudio gratuitos disponibles.', time: '1 mes' },
  'Inglés':       { action: 'Cambia tu entorno al inglés: herramientas, podcasts, reuniones. Conversación nativa 3x/semana.', resource: 'iTalki (tutores nativos) + Podcasts técnicos en inglés + Shadowing method.', time: '4-8 meses' },
  'Negociación':  { action: 'Practica en situaciones reales de bajo riesgo: negociá plazos, scope, recursos con compañeros.', resource: 'Libro "Never Split the Difference" (Chris Voss) + curso Coursera: Successful Negotiation.', time: '2-4 meses' },
}

const getDefault = (name) => ({
  action: `Práctica deliberada enfocada en ${name} con proyectos reales y feedback constante.`,
  resource: `Busca cursos especializados en ${name} en Coursera, Udemy o LinkedIn Learning.`,
  time: '2-4 meses',
})

export default function SkillGap() {
  const { skills, setSkills } = useApp()
  const [activeSkill, setActiveSkill] = useState(null)
  const [newSkill, setNewSkill] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const updateSkill = (id, field, val) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: Number(val) } : s))
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    setSkills(prev => [...prev, { id: Date.now(), name: newSkill.trim(), current: 5, required: 7, category: 'tech' }])
    setNewSkill('')
    setShowAdd(false)
  }

  const removeSkill = (id) => {
    setSkills(prev => prev.filter(s => s.id !== id))
    if (activeSkill === id) setActiveSkill(null)
  }

  const topGaps = [...skills]
    .map(s => ({ ...s, gap: s.required - s.current }))
    .filter(s => s.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)

  const active = skills.find(s => s.id === activeSkill) || topGaps[0]
  const suggestion = active ? (AI_SUGGESTIONS[active.name] || getDefault(active.name)) : null

  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Skill Gap Analysis</h1>
        <p className="text-gray-500 mt-1">Visualizá la brecha entre tus habilidades actuales y las requeridas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Chart + Legend */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-semibold text-gray-800">Radar de Competencias</h2>
            <div className="flex items-center gap-4 ml-auto text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" /> Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" /> Requerido
              </span>
            </div>
          </div>
          <div className="flex justify-center">
            <RadarChart skills={skills} size={360} />
          </div>
        </div>

        {/* Skills table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Ajustar Niveles</h2>
            <button onClick={() => setShowAdd(s => !s)} className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition">
              <Plus size={16} />
            </button>
          </div>

          {showAdd && (
            <div className="flex gap-2 mb-3">
              <input
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="Nueva skill..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <button onClick={addSkill} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
                +
              </button>
            </div>
          )}

          <div className="space-y-4 flex-1 overflow-y-auto scrollbar-thin pr-1">
            {skills.map(s => {
              const gap = s.required - s.current
              const isActive = active?.id === s.id
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSkill(s.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">{s.name}</span>
                    <div className="flex items-center gap-2">
                      {gap > 0 && (
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${gap >= 3 ? 'bg-red-100 text-red-600' : gap >= 2 ? 'bg-amber-100 text-amber-600' : 'bg-yellow-100 text-yellow-700'}`}>
                          −{gap}
                        </span>
                      )}
                      {gap <= 0 && <span className="text-[10px] text-emerald-600 font-semibold">✓</span>}
                      <button onClick={e => { e.stopPropagation(); removeSkill(s.id) }} className="text-gray-200 hover:text-red-400 transition">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-gray-400 block mb-1">Actual: <strong className="text-emerald-600">{s.current}</strong></label>
                      <input
                        type="range" min="0" max="10" value={s.current}
                        onChange={e => { e.stopPropagation(); updateSkill(s.id, 'current', e.target.value) }}
                        onClick={e => e.stopPropagation()}
                        className="w-full accent-emerald-500 h-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 block mb-1">Requerido: <strong className="text-indigo-600">{s.required}</strong></label>
                      <input
                        type="range" min="0" max="10" value={s.required}
                        onChange={e => { e.stopPropagation(); updateSkill(s.id, 'required', e.target.value) }}
                        onClick={e => e.stopPropagation()}
                        className="w-full accent-indigo-500 h-1.5"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={18} className="text-amber-500" />
          <h2 className="font-semibold text-gray-800">Sugerencias IA — Top 3 Skills Críticas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topGaps.length === 0 ? (
            <div className="col-span-3 text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-400">
              <Activity size={32} className="mx-auto mb-2 opacity-30" />
              <p>No hay brechas detectadas. ¡Tus skills están alineadas con los requerimientos!</p>
            </div>
          ) : (
            topGaps.map((s, idx) => {
              const sug = AI_SUGGESTIONS[s.name] || getDefault(s.name)
              const colors = [
                { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500', title: 'text-red-700' },
                { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', title: 'text-orange-700' },
                { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-500', title: 'text-amber-700' },
              ][idx]
              return (
                <div key={s.id} className={`rounded-2xl border p-5 ${colors.bg} ${colors.border}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-6 h-6 rounded-full ${colors.badge} text-white text-xs font-bold flex items-center justify-center`}>
                      {idx + 1}
                    </span>
                    <h3 className={`font-semibold text-sm ${colors.title}`}>{s.name}</h3>
                    <span className="ml-auto text-xs text-gray-500">{s.current}→{s.required}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <TrendingUp size={10} /> Acción inmediata
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">{sug.action}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <AlertTriangle size={10} /> Recursos recomendados
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed">{sug.resource}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-1 border-t border-current/10">
                      ⏱ Tiempo estimado: <strong>{sug.time}</strong>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
