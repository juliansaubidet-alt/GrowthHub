import { useState } from 'react'
import { Check, Target, Map, TrendingUp, BarChart3, Rocket, Sparkles, Clock } from 'lucide-react'
import { ProgressRing, PathNode, CourseIcon } from './shared'
import { ROUTES_BY_TYPE, COURSES_BY_ROUTE, DEFAULT_COURSES, MANAGERS, TERM_CONFIG, PRIORITY_CONFIG } from './constants'
import CareerPlanWizard from './CareerPlanWizard'

function EmployeeEmptyState({ onStart }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-4" style={{ width: 260 }}>
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(140deg, #3851d8 0%, #29317f 100%)' }}>
          <p className="text-[9px] font-semibold uppercase tracking-widest opacity-65 mb-2">Current Role</p>
          <p className="text-lg font-bold mb-0.5">Product Designer</p>
          <p className="text-[12px] opacity-75 mb-3">Design Team</p>
          <div className="flex gap-2">
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">2.5 yr tenure</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-4dp p-5">
          <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Lo que vas a desbloquear</p>
          <div className="flex flex-col gap-3">
            {[
              { icon: Map,       text: 'Tu mapa de carrera personalizado' },
              { icon: BarChart3, text: 'Análisis de brechas de skills' },
              { icon: Target,    text: 'Objetivos de desarrollo claros' },
              { icon: Rocket,    text: 'Acciones recomendadas por rol' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Icon size={16} className="text-h-500 shrink-0" />
                <p className="text-[12px] text-n-700">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-4dp h-full flex flex-col items-center justify-center px-12 py-16 text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-h-50 flex items-center justify-center">
              <TrendingUp size={40} className="text-h-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-y-100 flex items-center justify-center">
              <Sparkles size={14} className="text-y-600" />
            </div>
          </div>

          <h2 className="text-[17px] font-bold text-n-950 mb-2">Todavía no creaste tu plan de carrera</h2>
          <p className="text-[13px] text-n-600 max-w-xs leading-relaxed mb-8">
            Definí tu próximo rol, identificá tus brechas de skills y trazá el camino para llegar ahí.
          </p>

          <div className="flex items-center gap-2 bg-n-50 border border-n-200 rounded-full px-4 py-2 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-h-500 shrink-0" />
            <span className="text-[12px] font-semibold text-n-950">Rol actual:</span>
            <span className="text-[12px] text-n-700">Product Designer</span>
          </div>

          <button
            onClick={onStart}
            className="h-11 px-7 bg-h-500 hover:bg-h-600 text-white rounded-xl text-[14px] font-semibold transition-colors shadow-4dp hover:shadow-8dp flex items-center gap-2"
          >
            <span>Crear mi plan de carrera</span>
            <span className="text-base">→</span>
          </button>

          <p className="text-[11px] text-n-500 mt-4">Tu manager podrá revisar y aprobar el plan una vez que lo envíes</p>
        </div>
      </div>
    </div>
  )
}

function SuccessScreen({ onView }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="bg-white rounded-2xl shadow-4dp p-12 flex flex-col items-center text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-g-50 flex items-center justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-g-100 flex items-center justify-center">
            <Check size={24} className="text-g-600" />
          </div>
        </div>
        <h2 className="text-[18px] font-bold text-n-950 mb-2">¡Plan enviado con éxito!</h2>
        <p className="text-[13px] text-n-600 leading-relaxed mb-2">
          Tu plan de carrera fue enviado para revisión.
        </p>
        <p className="text-[13px] text-n-600 leading-relaxed mb-8">
          Tu manager recibirá una notificación y podrá aprobarlo o sugerirte cambios.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onView}
            className="h-11 w-full bg-h-500 hover:bg-h-600 text-white rounded-xl text-[14px] font-semibold transition-colors"
          >
            Ver mi plan de carrera
          </button>
          <p className="text-[11px] text-n-400 mt-1">Recibirás una notificación cuando tu manager lo revise</p>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeTab() {
  const [hasPath, setHasPath]           = useState(false)
  const [showWizard, setShowWizard]     = useState(false)
  const [showSuccess, setShowSuccess]   = useState(false)
  const [planData, setPlanData]         = useState(null)
  const [completedObj, setCompletedObj] = useState(new Set())
  const [filter, setFilter]             = useState('Todo')
  const [planStatus, setPlanStatus]     = useState('revision')
  const [courseProgress, setCourseProgress] = useState({})
  const COURSE_STATES = ['pendiente', 'en-curso', 'finalizado']
  const cycleCourse = (id) => setCourseProgress(prev => {
    const cur = prev[id] || 'pendiente'
    const next = COURSE_STATES[(COURSE_STATES.indexOf(cur) + 1) % COURSE_STATES.length]
    return { ...prev, [id]: next }
  })
  const COURSE_STATE_CFG = {
    'pendiente':  { label: 'Pendiente',  cls: 'bg-y-100 text-y-700'  },
    'en-curso':   { label: 'En curso',   cls: 'bg-h-100 text-h-800'  },
    'finalizado': { label: 'Finalizado', cls: 'bg-g-100 text-g-800'  },
  }

  if (!hasPath && !showWizard && !showSuccess)
    return <EmployeeEmptyState onStart={() => setShowWizard(true)} />
  if (showWizard)
    return (
      <CareerPlanWizard
        onComplete={(data) => { setPlanData(data); setShowWizard(false); setShowSuccess(true) }}
        onCancel={() => setShowWizard(false)}
      />
    )
  if (showSuccess)
    return <SuccessScreen onView={() => { setHasPath(true); setShowSuccess(false) }} />

  const routes        = ROUTES_BY_TYPE[planData.growthType] || []
  const selectedRoute = routes.find(r => r.value === planData.route)
  const selectedMgr   = MANAGERS.find(m => m.value === planData.manager)

  const totalObj = planData.objectives.length
  const doneObj  = completedObj.size
  const progress = totalObj > 0 ? Math.round((doneObj / totalObj) * 100) : 0

  const toggleObj = (id) => setCompletedObj(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next
  })

  const estimateQuarter = () => {
    const map = { '6 meses': 6, '1 año': 12, '1.5 años': 18, '2 años': 24, '2.5 años': 30, '3 años': 36 }
    const months = map[planData.duration] || 12
    const d = new Date(); d.setMonth(d.getMonth() + months)
    return `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`
  }

  const skillLevel = (name) => ((name.charCodeAt(0) * 3 + name.length * 7) % 45) + 35

  const pathNodes = (() => {
    const nodes = [
      { id: 'p0', label: 'Junior Designer',         sub: 'Completado · L1',                             ring: '#28c040', done: true,    type: 'done'    },
      { id: 'p1', label: 'Product Designer',         sub: 'Actual · L2',                                ring: '#496be3', current: true, type: 'current' },
      { id: 'p2', label: selectedRoute?.label || '—', sub: `Meta · ${selectedRoute?.level || ''}`, level: selectedRoute?.level, ring: '#9db8f3', type: 'target' },
    ]
    if (planData.growthType === 'vertical') {
      const allV   = ROUTES_BY_TYPE.vertical
      const next   = allV[allV.findIndex(r => r.value === planData.route) + 1]
      if (next) nodes.push({ id: 'p3', label: next.label, sub: `Bloqueado · ${next.level}`, ring: '#cbcdd6', locked: true, type: 'locked' })
    } else {
      nodes.push({ id: 'p3', label: 'Más oportunidades', sub: 'Explorar →', ring: '#cbcdd6', locked: true, type: 'locked' })
    }
    return nodes
  })()
  const pathConnectors = ['solid', 'solid', 'dashed']

  const allCourses     = [...(COURSES_BY_ROUTE[planData.route] || []).map((c, i) => ({ ...c, priority: i === 0 ? 1 : i <= 2 ? 2 : 3 })), ...DEFAULT_COURSES]
  const coursesDisplay = allCourses.filter(c => planData.selectedCourses.includes(c.id))

  return (
    <div className="flex gap-5">
      {/* LEFT */}
      <div className="flex flex-col gap-4" style={{ width: 260 }}>
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(140deg, #3851d8 0%, #29317f 100%)' }}>
          <p className="text-[9px] font-semibold uppercase tracking-widest opacity-65 mb-2">Rol Actual</p>
          <p className="text-lg font-bold mb-0.5">Product Designer</p>
          <p className="text-[12px] opacity-75 mb-1">Design Team</p>
          {selectedMgr && (
            <p className="text-[11px] opacity-60 mb-2">Manager: {selectedMgr.label}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">2.5 yr tenure</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-5 py-3.5 border-b border-n-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-n-950">Progreso general</span>
            <button
              onClick={() => setPlanStatus(s => s === 'revision' ? 'aprobado' : 'revision')}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${planStatus === 'aprobado' ? 'bg-g-100 text-g-800' : 'bg-y-100 text-y-700'}`}
            >
              {planStatus === 'aprobado' ? 'Aprobado' : 'En revisión'}
            </button>
          </div>
          <div className="p-5 flex items-center gap-4">
            <ProgressRing pct={progress} />
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-n-950 mb-0.5">{selectedRoute?.label || '—'}</p>
              <p className="text-[13px] text-n-600 mb-0.5">Est. {estimateQuarter()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-5 py-3.5 border-b border-n-100">
            <p className="text-[13px] font-semibold text-n-950">Skills</p>
            <p className="text-[11px] text-n-600">{planData.skills.length + planData.softSkills.length} habilidades para el rol</p>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {planData.skills.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Habilidades técnicas</p>
                <div className="flex flex-wrap gap-1.5">
                  {planData.skills.map(s => (
                    <span key={s} className="text-[11px] font-medium bg-h-50 text-h-800 border border-h-200 px-2.5 py-1 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {planData.softSkills.length > 0 && (
              <div className={planData.skills.length > 0 ? 'pt-3 border-t border-n-100' : ''}>
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Soft skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {planData.softSkills.map(s => (
                    <span key={s} className="text-[11px] font-medium bg-t-50 text-t-800 border border-t-200 px-2.5 py-1 rounded-lg">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {planData.skills.length === 0 && planData.softSkills.length === 0 && (
              <p className="text-[12px] text-n-500 text-center py-2">No hay skills cargadas</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {planStatus === 'revision' && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-y-50 border border-y-200">
            <Clock size={16} className="text-y-600 shrink-0" />
            <p className="text-[12px] text-y-800">
              Tu plan de carrera está <span className="font-semibold">pendiente de aprobación</span> por {selectedMgr ? <span className="font-semibold">{selectedMgr.label}</span> : 'tu líder o manager directo'}.
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100">
            <p className="text-[13px] font-semibold text-n-950">Mapa de carrera</p>
            <p className="text-[11px] text-n-600">
              {planData.growthType === 'vertical' ? 'Crecimiento vertical' : 'Movimiento lateral'} · {planData.duration}
            </p>
          </div>
          <div className="p-6">
            <div className="flex items-start w-full">
              {pathNodes.flatMap((node, i) => {
                const items = []
                if (i > 0) {
                  const connColor = i === 1 ? '#28c040' : i === 2 ? '#496be3' : '#cbcdd6'
                  const connStyle = pathConnectors[i - 1] === 'dashed' ? 'dashed' : 'solid'
                  items.push(
                    <div key={`conn-${i}`} className="flex-1 mx-1 mt-[54px]" style={{ borderTop: `2px ${connStyle} ${connColor}` }} />
                  )
                }
                items.push(
                  <div key={node.id} className="flex flex-col items-center shrink-0">
                    <PathNode node={node} filter={filter} />
                  </div>
                )
                return items
              })}
            </div>
            {planData.description && (
              <p className="text-[11px] text-n-500 mt-4 italic border-t border-n-100 pt-3">"{planData.description}"</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-n-950">Objetivos</p>
              <p className="text-[11px] text-n-600">{doneObj} de {totalObj} completados</p>
            </div>
            {planStatus === 'revision' && (
              <span className="text-[10px] text-n-500 italic">Pendiente de aprobación</span>
            )}
          </div>
          <div className="p-4 flex flex-col gap-1.5">
            {planData.objectives.map(obj => {
              const done    = completedObj.has(obj.id)
              const cfg     = TERM_CONFIG[obj.term]
              const locked  = planStatus === 'revision'
              return (
                <button
                  key={obj.id}
                  onClick={() => !locked && toggleObj(obj.id)}
                  disabled={locked}
                  className={`flex items-start gap-2.5 p-2 rounded-lg text-left w-full transition-colors ${locked ? 'cursor-not-allowed opacity-60' : done ? 'bg-h-50 hover:bg-h-100' : 'hover:bg-n-50'}`}
                >
                  <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center transition-colors ${done && !locked ? 'bg-h-500' : 'border-2 border-n-300'}`}>
                    {done && !locked && <Check size={10} className="text-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] leading-tight text-n-950">{obj.text}</p>
                    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-n-950">Cursos y aprendizaje</p>
            <span className="text-[11px] text-n-500">{coursesDisplay.length} seleccionados</span>
          </div>
          <div className="p-4 flex flex-col gap-2.5">
            {coursesDisplay.length > 0
              ? coursesDisplay.map(c => {
                  const pcfg = PRIORITY_CONFIG[c.priority] || PRIORITY_CONFIG[3]
                  return (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-n-50 hover:bg-h-50 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-4dp flex items-center justify-center shrink-0"><CourseIcon type={c.type} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{c.type}</p>
                        <p className="text-[13px] font-semibold text-n-950 mt-0.5">{c.title}</p>
                        <p className="text-[11px] text-n-600">{c.provider} · {c.duration}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pcfg.badge}`}>{pcfg.label}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); cycleCourse(c.id) }}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${COURSE_STATE_CFG[courseProgress[c.id] || 'pendiente'].cls}`}
                        >
                          {COURSE_STATE_CFG[courseProgress[c.id] || 'pendiente'].label}
                        </button>
                      </div>
                    </div>
                  )
                })
              : <p className="text-[12px] text-n-500 text-center py-4">No se seleccionaron cursos</p>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
