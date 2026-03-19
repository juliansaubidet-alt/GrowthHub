import { useState, useEffect } from 'react'
import { Check, Target, Map, TrendingUp, BarChart3, Rocket, Sparkles, Clock } from 'lucide-react'
import { ProgressRing, PathNode, CourseIcon } from './shared'
import { TERM_CONFIG, PRIORITY_CONFIG } from './constants'
import { careerPlansApi } from '../../api/careerPlans'
import { coursesApi } from '../../api/courses'
import { useApp } from '../../App'
import CareerPlanWizard from './CareerPlanWizard'

function EmployeeEmptyState({ onStart, user }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-4" style={{ width: 260 }}>
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(140deg, #3851d8 0%, #29317f 100%)' }}>
          <p className="text-[9px] font-semibold uppercase tracking-widest opacity-65 mb-2">Current Role</p>
          <p className="text-lg font-bold mb-0.5">{user?.industry || user?.department || 'Colaborador'}</p>
          <p className="text-[12px] opacity-75 mb-3">{user?.department || ''} Team</p>
          <div className="flex gap-2">
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">{user?.experience || ''}</span>
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

          <h2 className="text-[17px] font-bold text-n-950 mb-2">Todavia no creaste tu plan de carrera</h2>
          <p className="text-[13px] text-n-600 max-w-xs leading-relaxed mb-8">
            Defini tu proximo rol, identifica tus brechas de skills y traza el camino para llegar ahi.
          </p>

          <div className="flex items-center gap-2 bg-n-50 border border-n-200 rounded-full px-4 py-2 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-h-500 shrink-0" />
            <span className="text-[12px] font-semibold text-n-950">Rol actual:</span>
            <span className="text-[12px] text-n-700">{user?.industry || user?.department || 'Colaborador'}</span>
          </div>

          <button
            onClick={onStart}
            className="h-11 px-7 bg-h-500 hover:bg-h-600 text-white rounded-xl text-[14px] font-semibold transition-colors shadow-4dp hover:shadow-8dp flex items-center gap-2"
          >
            <span>Crear mi plan de carrera</span>
            <span className="text-base">&rarr;</span>
          </button>

          <p className="text-[11px] text-n-500 mt-4">Tu manager podra revisar y aprobar el plan una vez que lo envies</p>
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
        <h2 className="text-[18px] font-bold text-n-950 mb-2">Plan enviado con exito!</h2>
        <p className="text-[13px] text-n-600 leading-relaxed mb-2">
          Tu plan de carrera fue enviado para revision.
        </p>
        <p className="text-[13px] text-n-600 leading-relaxed mb-8">
          Tu manager recibira una notificacion y podra aprobarlo o sugerirte cambios.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onView}
            className="h-11 w-full bg-h-500 hover:bg-h-600 text-white rounded-xl text-[14px] font-semibold transition-colors"
          >
            Ver mi plan de carrera
          </button>
          <p className="text-[11px] text-n-400 mt-1">Recibiras una notificacion cuando tu manager lo revise</p>
        </div>
      </div>
    </div>
  )
}

export default function EmployeeTab() {
  const { selectedUser } = useApp()
  const [hasPath, setHasPath]           = useState(false)
  const [showWizard, setShowWizard]     = useState(false)
  const [showSuccess, setShowSuccess]   = useState(false)
  const [planData, setPlanData]         = useState(null)
  const [loading, setLoading]           = useState(true)
  const [completedObj, setCompletedObj] = useState(new Set())
  const [filter, setFilter]             = useState('Todo')
  const [planStatus, setPlanStatus]     = useState('revision')
  const [courseProgress, setCourseProgress] = useState({})
  const [coursesDisplay, setCoursesDisplay] = useState([])
  const [editObjInput, setEditObjInput] = useState('')
  const [editObjTerm, setEditObjTerm] = useState('short')
  const [showEditWizard, setShowEditWizard] = useState(false)

  useEffect(() => {
    // Reset state for new user
    setHasPath(false)
    setShowWizard(false)
    setShowSuccess(false)
    setPlanData(null)
    setLoading(true)
    setCompletedObj(new Set())
    setCourseProgress({})
    setCoursesDisplay([])

    if (!selectedUser?._id) { setLoading(false); return }
    careerPlansApi.getByEmployee(selectedUser._id)
      .then(plan => {
        if (plan) {
          setPlanData(plan)
          setHasPath(true)
          setPlanStatus(plan.status === 'approved' ? 'aprobado' : plan.status === 'changes_requested' ? 'cambios' : 'revision')
          // Initialize completed objectives from plan data
          const completed = new Set(plan.objectives.filter(o => o.completed).map(o => o._id))
          setCompletedObj(completed)
          // Initialize course progress from plan data
          if (plan.selectedCourses) {
            const progress = {}
            plan.selectedCourses.forEach(sc => {
              if (sc.courseId && sc.status) progress[sc.courseId] = sc.status
            })
            setCourseProgress(progress)
          }
          // Fetch courses for display
          if (plan.route) {
            coursesApi.getByRoute(plan.route).then(courses => {
              const selected = plan.selectedCourses || []
              const display = courses.filter(c => selected.find(s => s.courseId === c._id))
                .map(c => {
                  const sel = selected.find(s => s.courseId === c._id)
                  return { ...c, id: c._id, priority: c.priority }
                })
              setCoursesDisplay(display)
            }).catch(console.error)
          }
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [selectedUser])

  const COURSE_STATES = ['pendiente', 'en-curso', 'finalizado']
  const COURSE_STATE_CFG = {
    'pendiente':  { label: 'Pendiente',  cls: 'bg-y-100 text-y-700'  },
    'en-curso':   { label: 'En curso',   cls: 'bg-h-100 text-h-800'  },
    'finalizado': { label: 'Finalizado', cls: 'bg-g-100 text-g-800'  },
  }

  const handleWizardComplete = async (data) => {
    try {
      const plan = await careerPlansApi.create({
        employeeId: selectedUser?._id,
        growthType: data.growthType,
        route: data.route,
        routeLabel: data.routeLabel || '',
        duration: data.duration,
        managerId: data.manager,
        description: data.description || '',
        skills: data.skills,
        softSkills: data.softSkills,
        objectives: data.objectives.map(o => ({ text: o.text, term: o.term })),
        selectedCourses: data.selectedCourses,
      })
      setPlanData(plan)
      setShowWizard(false)
      setShowSuccess(true)
    } catch (err) {
      console.error('Failed to create plan:', err)
    }
  }

  const toggleObj = async (id) => {
    try {
      await careerPlansApi.toggleObjective(planData._id, id)
      setCompletedObj(prev => {
        const next = new Set(prev)
        next.has(id) ? next.delete(id) : next.add(id)
        return next
      })
    } catch (err) {
      console.error(err)
    }
  }

  const cycleCourse = async (courseId) => {
    const cur = courseProgress[courseId] || 'pendiente'
    const next = COURSE_STATES[(COURSE_STATES.indexOf(cur) + 1) % COURSE_STATES.length]
    try {
      await careerPlansApi.updateCourseProgress(planData._id, courseId, next)
      setCourseProgress(prev => ({ ...prev, [courseId]: next }))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <div className="text-center py-8 text-n-500">Cargando...</div>

  if (!hasPath && !showWizard && !showSuccess)
    return <EmployeeEmptyState onStart={() => setShowWizard(true)} user={selectedUser} />
  if (showWizard)
    return (
      <CareerPlanWizard
        onComplete={handleWizardComplete}
        onCancel={() => setShowWizard(false)}
      />
    )
  if (showSuccess)
    return <SuccessScreen onView={() => { setHasPath(true); setShowSuccess(false) }} />

  const selectedRoute = { label: planData.routeLabel || planData.route }
  const managerName   = planData.managerId?.name || ''

  const totalObj = planData.objectives.length
  const doneObj  = completedObj.size
  const progress = totalObj > 0 ? Math.round((doneObj / totalObj) * 100) : 0

  const estimateQuarter = () => {
    const map = { '6 meses': 6, '1 año': 12, '1.5 años': 18, '2 años': 24, '2.5 años': 30, '3 años': 36 }
    const months = map[planData.duration] || 12
    const d = new Date(); d.setMonth(d.getMonth() + months)
    return `Q${Math.ceil((d.getMonth() + 1) / 3)} ${d.getFullYear()}`
  }

  const skillLevel = (name) => ((name.charCodeAt(0) * 3 + name.length * 7) % 45) + 35

  const currentRole = selectedUser?.industry || selectedUser?.department || 'Rol actual'
  const targetRole = selectedRoute?.label || '—'
  const growthLabel = planData.growthType === 'vertical' ? 'Crecimiento vertical' : 'Movimiento lateral'

  const pathNodes = (() => {
    const nodes = [
      { id: 'p0', label: currentRole, sub: 'Rol actual', ring: '#496be3', current: true, type: 'current' },
      { id: 'p1', label: targetRole, sub: `Meta · ${planData.duration || ''}`, ring: '#9db8f3', type: 'target' },
    ]
    if (planData.growthType === 'vertical') {
      nodes.push({ id: 'p2', label: 'Siguiente nivel', sub: 'Bloqueado', ring: '#cbcdd6', locked: true, type: 'locked' })
    } else {
      nodes.push({ id: 'p2', label: 'Más oportunidades', sub: 'Explorar →', ring: '#cbcdd6', locked: true, type: 'locked' })
    }
    return nodes
  })()
  const pathConnectors = ['solid', 'dashed']

  return (
    <div className="flex gap-5">
      {/* LEFT */}
      <div className="flex flex-col gap-4" style={{ width: 260 }}>
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(140deg, #3851d8 0%, #29317f 100%)' }}>
          <p className="text-[9px] font-semibold uppercase tracking-widest opacity-65 mb-2">Rol Actual</p>
          <p className="text-lg font-bold mb-0.5">{selectedUser?.industry || selectedUser?.department || 'Colaborador'}</p>
          <p className="text-[12px] opacity-75 mb-1">{selectedUser?.department || ''} Team</p>
          {managerName && (
            <p className="text-[11px] opacity-60 mb-2">Manager: {managerName}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">{selectedUser?.experience || ''}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-5 py-3.5 border-b border-n-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-n-950">Progreso general</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${planStatus === 'aprobado' ? 'bg-g-100 text-g-800' : planStatus === 'cambios' ? 'bg-r-100 text-r-600' : 'bg-y-100 text-y-700'}`}>
              {planStatus === 'aprobado' ? 'Aprobado' : planStatus === 'cambios' ? 'Cambios sugeridos' : 'En revisión'}
            </span>
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
              Tu plan de carrera está <span className="font-semibold">pendiente de aprobación</span> por {managerName ? <span className="font-semibold">{managerName}</span> : 'tu líder o manager directo'}.
            </p>
          </div>
        )}

        {planStatus === 'cambios' && (
          <>
            <div className="rounded-xl bg-r-50 border border-r-200 px-4 py-3">
              <p className="text-[12px] font-semibold text-r-700 mb-1">Tu manager sugirió cambios en tu plan</p>
              {planData.managerFeedback && (
                <p className="text-[12px] text-n-700 bg-white border border-r-100 rounded-lg px-3 py-2 italic">"{planData.managerFeedback}"</p>
              )}
            </div>

            {planData.feedbackHistory?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-4dp">
                <div className="px-5 py-3.5 border-b border-n-100">
                  <p className="text-[13px] font-semibold text-n-950">Historial de comunicación</p>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {planData.feedbackHistory.map((fb, i) => (
                    <div key={i} className={`flex gap-3 p-3 rounded-xl ${fb.role === 'manager' ? 'bg-y-50 border border-y-100' : 'bg-h-50 border border-h-100'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${fb.role === 'manager' ? 'bg-t-100 text-t-700' : 'bg-h-100 text-h-700'}`}>
                        {fb.from?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '??'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[12px] font-semibold text-n-950">{fb.from}</p>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${fb.role === 'manager' ? 'bg-t-100 text-t-700' : 'bg-h-100 text-h-700'}`}>
                            {fb.role === 'manager' ? 'Manager' : 'Colaborador'}
                          </span>
                          <span className="text-[10px] text-n-400">{fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                        </div>
                        <p className="text-[12px] text-n-700 leading-relaxed">{fb.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowEditWizard(true)}
              className="h-10 px-5 bg-h-500 hover:bg-h-600 text-white rounded-xl text-[13px] font-semibold transition-colors shadow-4dp self-start flex items-center gap-2"
            >
              Editar y reenviar plan →
            </button>
          </>
        )}

        {showEditWizard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-n-50 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
              <CareerPlanWizard
                initialData={planData}
                onCancel={() => setShowEditWizard(false)}
                onComplete={async (data) => {
                  try {
                    await careerPlansApi.update(planData._id, {
                      growthType: data.growthType,
                      route: data.route,
                      routeLabel: data.routeLabel || '',
                      duration: data.duration,
                      managerId: data.manager,
                      description: data.description || '',
                      skills: data.skills,
                      softSkills: data.softSkills,
                      objectives: data.objectives.map(o => ({ text: o.text, term: o.term })),
                      selectedCourses: data.selectedCourses,
                    })
                    await careerPlansApi.resubmit(planData._id, {
                      skills: data.skills,
                      softSkills: data.softSkills,
                      description: data.description || '',
                      employeeName: selectedUser?.name,
                    })
                    const updated = await careerPlansApi.getByEmployee(selectedUser._id)
                    if (updated) {
                      setPlanData(updated)
                      setPlanStatus('revision')
                    }
                    setShowEditWizard(false)
                  } catch (err) {
                    console.error('Failed to update and resubmit:', err)
                  }
                }}
              />
            </div>
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
                  const connColor = i === 1 ? '#496be3' : '#cbcdd6'
                  const connStyle = pathConnectors[i - 1] || 'dashed'
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
              const objId   = obj._id || obj.id
              const done    = completedObj.has(objId)
              const cfg     = TERM_CONFIG[obj.term]
              const canToggle = planStatus === 'aprobado'
              return (
                <div
                  key={objId}
                  className={`flex items-start gap-2.5 p-2 rounded-lg w-full transition-colors ${canToggle ? (done ? 'bg-h-50 hover:bg-h-100 cursor-pointer' : 'hover:bg-n-50 cursor-pointer') : ''}`}
                  onClick={() => canToggle && toggleObj(objId)}
                >
                  <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center transition-colors ${done && canToggle ? 'bg-h-500' : 'border-2 border-n-300'}`}>
                    {done && canToggle && <Check size={10} className="text-white" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] leading-tight text-n-950">{obj.text}</p>
                    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                </div>
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
                          disabled={planStatus !== 'aprobado'}
                          onClick={(e) => { e.stopPropagation(); cycleCourse(c.id) }}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${planStatus !== 'aprobado' ? 'opacity-60 cursor-not-allowed' : ''} ${COURSE_STATE_CFG[courseProgress[c.id] || 'pendiente'].cls}`}
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
