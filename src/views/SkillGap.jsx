import { useState } from 'react'
import { Lightbulb, TrendingUp, AlertTriangle, Plus, Trash2, Activity } from 'lucide-react'
import { useApp } from '../App'

function RadarChart({ skills, size = 360 }) {
  const cx = size / 2, cy = size / 2, R = size * 0.34
  const n = skills.length
  if (n < 3) return null

  const angle   = (i) => (2 * Math.PI * i) / n - Math.PI / 2
  const point   = (i, val, max = 10) => ({ x: cx + (val / max) * R * Math.cos(angle(i)), y: cy + (val / max) * R * Math.sin(angle(i)) })
  const labelPt = (i) => ({ x: cx + (R + 32) * Math.cos(angle(i)), y: cy + (R + 32) * Math.sin(angle(i)) })
  const toPath  = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  const rings       = [2, 4, 6, 8, 10]
  const currentPts  = skills.map((s, i) => point(i, s.current))
  const requiredPts = skills.map((s, i) => point(i, s.required))

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {rings.map(v => (
        <polygon key={v}
          points={skills.map((_, i) => { const p = point(i, v); return `${p.x},${p.y}` }).join(' ')}
          fill="none" stroke="#eeeef1" strokeWidth="1" />
      ))}
      {rings.map(v => (
        <text key={`l${v}`} x={cx + 3} y={cy - (v / 10) * R + 4} fontSize="9" fill="#aaaaba">{v}</text>
      ))}
      {skills.map((_, i) => {
        const end = point(i, 10)
        return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="#dfe0e6" strokeWidth="1" />
      })}
      {/* Required */}
      <path d={toPath(requiredPts)} fill="rgba(73,107,227,0.08)" stroke="rgba(73,107,227,0.6)" strokeWidth="2" strokeLinejoin="round" />
      {/* Current */}
      <path d={toPath(currentPts)} fill="rgba(53,164,142,0.12)" stroke="rgba(53,164,142,0.8)" strokeWidth="2" strokeLinejoin="round" />
      {requiredPts.map((p, i) => <circle key={`rd${i}`} cx={p.x} cy={p.y} r="4" fill="#496be3" />)}
      {currentPts.map((p, i) => <circle key={`cd${i}`} cx={p.x} cy={p.y} r="4" fill="#35a48e" stroke="#fff" strokeWidth="1.5" />)}
      {skills.map((s, i) => {
        const lp = labelPt(i)
        const textAnchor = lp.x < cx - 5 ? 'end' : lp.x > cx + 5 ? 'start' : 'middle'
        return (
          <text key={`label${i}`} x={lp.x} y={lp.y} textAnchor={textAnchor} dominantBaseline="middle" fontSize="11" fill="#636271" fontWeight="600">
            {s.name}
          </text>
        )
      })}
    </svg>
  )
}

const AI_SUGGESTIONS = {
  'Liderazgo':    { action: 'Solicitá liderar el próximo proyecto del equipo, aunque sea pequeño. La práctica real supera cualquier curso.', resource: 'Curso "The Manager\'s Path" (O\'Reilly) + 1:1s semanales con tu líder actual.', time: '3-6 meses' },
  'Comunicación': { action: 'Presentá en la reunión semanal del equipo y buscá feedback inmediato. Incrementá gradualmente la audiencia.', resource: 'Toastmasters o curso de Storytelling (LinkedIn Learning). Practicá 15 min/día.', time: '2-4 meses' },
  'React':        { action: 'Construí un proyecto personal con React + TypeScript, usá hooks avanzados y code-splitting.', resource: 'Epic React (Kent C. Dodds) o documentación oficial + proyectos en GitHub.', time: '1-3 meses' },
  'Node.js':      { action: 'Desarrollá una API REST completa con autenticación y desplegala en producción.', resource: 'Curso Node.js en Udemy (Maximilian) + GitHub Projects.', time: '2-3 meses' },
  'SQL / Datos':  { action: 'Analizá datasets reales de tu empresa y presentá los insights al equipo.', resource: 'Mode Analytics SQL School (gratis) + Kaggle datasets para práctica.', time: '1-2 meses' },
  'Agile / Scrum':{ action: 'Obtené la certificación PSM I y proponé mejorar el proceso de tu equipo actual.', resource: 'scrum.org — PSM I (exam $150). Materiales de estudio gratuitos disponibles.', time: '1 mes' },
  'Inglés':       { action: 'Cambiá tu entorno al inglés: herramientas, podcasts, reuniones. Conversación nativa 3x/semana.', resource: 'iTalki (tutores nativos) + Podcasts técnicos en inglés + Shadowing method.', time: '4-8 meses' },
  'Negociación':  { action: 'Practicá en situaciones reales de bajo riesgo: negociá plazos, scope, recursos con compañeros.', resource: 'Libro "Never Split the Difference" (Chris Voss) + curso Coursera: Successful Negotiation.', time: '2-4 meses' },
}
const getDefault = (name) => ({ action: `Práctica deliberada enfocada en ${name} con proyectos reales y feedback constante.`, resource: `Buscá cursos especializados en ${name} en Coursera, Udemy o LinkedIn Learning.`, time: '2-4 meses' })

export default function SkillGap() {
  const { skills, setSkills } = useApp()
  const [activeSkill, setActiveSkill] = useState(null)
  const [newSkill, setNewSkill]       = useState('')
  const [showAdd, setShowAdd]         = useState(false)

  const updateSkill = (id, field, val) => setSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: Number(val) } : s))
  const addSkill    = () => {
    if (!newSkill.trim()) return
    setSkills(prev => [...prev, { id: Date.now(), name: newSkill.trim(), current: 5, required: 7, category: 'tech' }])
    setNewSkill(''); setShowAdd(false)
  }
  const removeSkill = (id) => { setSkills(prev => prev.filter(s => s.id !== id)); if (activeSkill === id) setActiveSkill(null) }

  const topGaps = [...skills].map(s => ({ ...s, gap: s.required - s.current })).filter(s => s.gap > 0).sort((a, b) => b.gap - a.gap).slice(0, 3)

  const sugColors = [
    { border: 'border-r-100', bg: 'bg-r-50', badge: 'bg-r-600', num: 'text-r-600' },
    { border: 'border-y-200', bg: 'bg-y-50', badge: 'bg-y-600', num: 'text-y-700' },
    { border: 'border-h-100', bg: 'bg-h-50', badge: 'bg-h-500', num: 'text-h-600' },
  ]

  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-n-950">Skill Gap Analysis</h1>
        <p className="text-sm text-n-800 mt-1">Visualizá la brecha entre tus habilidades actuales y las requeridas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 mb-6">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-4dp hover:shadow-8dp transition-shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-sm font-semibold text-n-950">Radar de Competencias</h2>
            <div className="flex items-center gap-4 ml-auto text-xs">
              <span className="flex items-center gap-1.5 text-t-500"><span className="w-3 h-0.5 bg-t-500 inline-block rounded" /> Actual</span>
              <span className="flex items-center gap-1.5 text-h-500"><span className="w-3 h-0.5 bg-h-500 inline-block rounded" /> Requerido</span>
            </div>
          </div>
          <div className="flex justify-center">
            <RadarChart skills={skills} size={340} />
          </div>
        </div>

        {/* Skills table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-4dp hover:shadow-8dp transition-shadow flex flex-col">
          <div className="px-5 py-4 border-b border-n-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-n-950">Ajustar Niveles</h2>
            <button onClick={() => setShowAdd(s => !s)} className="w-7 h-7 rounded-lg bg-h-50 text-h-600 hover:bg-h-100 flex items-center justify-center transition">
              <Plus size={14} />
            </button>
          </div>
          {showAdd && (
            <div className="flex gap-2 px-4 py-3 border-b border-n-100">
              <input value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="Nueva skill..." className="input-humand flex-1" />
              <button onClick={addSkill} className="h-10 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition">+</button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {skills.map(s => {
              const gap      = s.required - s.current
              const isActive = activeSkill === s.id || (!activeSkill && topGaps[0]?.id === s.id)
              return (
                <div key={s.id} onClick={() => setActiveSkill(s.id)}
                  className={`px-4 py-3 border-b border-n-100 last:border-0 cursor-pointer transition-all ${isActive ? 'bg-h-50' : 'hover:bg-n-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-semibold text-n-950">{s.name}</span>
                    <div className="flex items-center gap-2">
                      {gap > 0 && <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${gap >= 3 ? 'bg-r-100 text-r-600' : gap >= 2 ? 'bg-y-100 text-y-700' : 'bg-y-50 text-y-600'}`}>−{gap}</span>}
                      {gap <= 0 && <span className="text-[10px] font-semibold bg-g-100 text-g-800 px-1.5 py-0.5 rounded-full">✓</span>}
                      <button onClick={e => { e.stopPropagation(); removeSkill(s.id) }} className="text-n-400 hover:text-r-600 transition"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-n-600 block mb-1">Actual: <strong className="text-t-500">{s.current}</strong></label>
                      <input type="range" min="0" max="10" value={s.current}
                        onChange={e => { e.stopPropagation(); updateSkill(s.id, 'current', e.target.value) }}
                        onClick={e => e.stopPropagation()}
                        className="w-full h-1.5 accent-[#35a48e]" />
                    </div>
                    <div>
                      <label className="text-n-600 block mb-1">Requerido: <strong className="text-h-600">{s.required}</strong></label>
                      <input type="range" min="0" max="10" value={s.required}
                        onChange={e => { e.stopPropagation(); updateSkill(s.id, 'required', e.target.value) }}
                        onClick={e => e.stopPropagation()}
                        className="w-full h-1.5 accent-[#496be3]" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} className="text-y-600" />
          <h2 className="text-sm font-semibold text-n-950">Sugerencias IA — Top 3 Skills Críticas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topGaps.length === 0 ? (
            <div className="col-span-3 text-center py-10 bg-white rounded-2xl shadow-4dp text-n-600">
              <Activity size={32} className="mx-auto mb-2 opacity-20" />
              <p className="text-sm font-semibold">Sin brechas detectadas</p>
              <p className="text-xs mt-1 text-n-600">¡Tus skills están alineadas!</p>
            </div>
          ) : (
            topGaps.map((s, idx) => {
              const sug = AI_SUGGESTIONS[s.name] || getDefault(s.name)
              const c   = sugColors[idx]
              return (
                <div key={s.id} className={`rounded-2xl border p-5 ${c.bg} ${c.border} shadow-4dp`}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-6 h-6 rounded-full ${c.badge} text-white text-[10px] font-bold flex items-center justify-center`}>{idx + 1}</span>
                    <h3 className={`text-sm font-semibold ${c.num}`}>{s.name}</h3>
                    <span className="ml-auto text-[11px] text-n-600">{s.current} → {s.required}</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold text-n-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <TrendingUp size={10} /> Acción inmediata
                      </p>
                      <p className="text-xs text-n-800 leading-relaxed">{sug.action}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-n-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <AlertTriangle size={10} /> Recursos recomendados
                      </p>
                      <p className="text-xs text-n-800 leading-relaxed">{sug.resource}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-n-600 pt-2 border-t border-white/60">
                      ⏱ Tiempo estimado: <strong className="text-n-800">{sug.time}</strong>
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
