import { useState, useEffect } from 'react'
import { X, Plus, Check, ChevronDown, Search, AlertTriangle, CheckCircle, CornerDownLeft } from 'lucide-react'
import { PathNode, CourseIcon } from './shared'
import { TERM_CONFIG, PRIORITY_CONFIG } from './constants'
import { useApp } from '../../App'
import { usersApi } from '../../api/users'
import { careerPlansApi } from '../../api/careerPlans'
import { careerPathsApi } from '../../api/careerPaths'

function getStatusBadge(plan) {
  if (!plan) return { cls: 'bg-n-100 text-n-600', label: 'Sin plan' }
  if (plan.status === 'approved') return { cls: 'bg-g-100 text-g-700', label: 'Aprobado' }
  if (plan.status === 'changes_requested') return { cls: 'bg-r-100 text-r-600', label: 'Cambios sugeridos' }
  return { cls: 'bg-y-100 text-y-700', label: 'En revisión' }
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = ['bg-h-100 text-h-600', 'bg-t-100 text-t-800', 'bg-p-100 text-p-800', 'bg-g-100 text-g-800', 'bg-y-100 text-y-700']

export default function ManagerTab() {
  const { selectedUser } = useApp()
  const [team, setTeam] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState('')
  const [showSuggest, setShowSuggest] = useState(false)
  const [showConfirmApprove, setShowConfirmApprove] = useState(false)
  const [suggestion, setSuggestion] = useState('')
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [courseSearch, setCourseSearch] = useState('')
  const [pendingCourse, setPendingCourse] = useState(null)
  const [allCourses, setAllCourses] = useState([])
  const [goalInput, setGoalInput] = useState('')
  const [goalTerm, setGoalTerm] = useState('short')
  const [hardInput, setHardInput] = useState('')
  const [softInput, setSoftInput] = useState('')

  const [currentPlan, setCurrentPlan] = useState(null)
  const [planLoading, setPlanLoading] = useState(false)
  const [planStatusMap, setPlanStatusMap] = useState({})

  // Fetch team list + courses once, then fetch all statuses in background
  useEffect(() => {
    if (!selectedUser?._id) return
    setLoading(true)
    setPlanStatusMap({})
    Promise.all([
      usersApi.getTeam(selectedUser._id),
    ]).then(async ([members]) => {
      setTeam(members)
      setSelectedIdx(0)
      setLoading(false)
      // Fetch plan status for each member (lightweight, for badges)
      const statusMap = {}
      await Promise.all(members.map(async (m) => {
        const plan = await careerPlansApi.getByEmployee(m._id).catch(() => null)
        statusMap[m._id] = plan?.status || null
      }))
      setPlanStatusMap(statusMap)
    }).catch(err => { console.error(err); setLoading(false) })
  }, [selectedUser])

  // Fetch full plan only for the selected team member
  useEffect(() => {
    const m = team[selectedIdx]
    if (!m?._id) { setCurrentPlan(null); return }
    setPlanLoading(true)
    careerPlansApi.getByEmployee(m._id)
      .then(async plan => {
        setCurrentPlan(plan || null)
        // Load suggested courses from career path for this plan's route
        if (plan?.route) {
          try {
            const courses = await careerPathsApi.getSuggestedCourses(plan.route)
            setAllCourses(courses || [])
          } catch { setAllCourses([]) }
        } else { setAllCourses([]) }
        setPlanLoading(false)
        // Update status map
        setPlanStatusMap(prev => ({ ...prev, [m._id]: plan?.status || null }))
      })
      .catch(() => { setCurrentPlan(null); setPlanLoading(false) })
  }, [team, selectedIdx])

  const member = team[selectedIdx]
  const plan = currentPlan
  const planStatus = plan?.status || null
  const isEditable = planStatus === 'changes_requested'

  const refetchPlan = async () => {
    if (!member) return
    const updated = await careerPlansApi.getByEmployee(member._id).catch(() => null)
    setCurrentPlan(updated || null)
    setPlanStatusMap(prev => ({ ...prev, [member._id]: updated?.status || null }))
  }

  const handleApprove = async () => {
    if (!plan) return
    await careerPlansApi.approve(plan._id)
    await refetchPlan()
  }

  const handleRequestChanges = async () => {
    if (!plan || !suggestion.trim()) return
    await careerPlansApi.requestChanges(plan._id, suggestion, selectedUser?.name)
    setSuggestion('')
    setShowSuggest(false)
    await refetchPlan()
  }

  const handleAddObjective = async () => {
    if (!plan || !goalInput.trim()) return
    await careerPlansApi.addObjective(plan._id, { text: goalInput.trim(), term: goalTerm })
    setGoalInput('')
    await refetchPlan()
  }

  const handleRemoveObjective = async (objId) => {
    if (!plan) return
    await careerPlansApi.removeObjective(plan._id, objId)
    await refetchPlan()
  }

  const handleAddCourse = async (course, priority) => {
    if (!plan) return
    await careerPlansApi.addCourse(plan._id, { courseId: course._id, priority })
    setCourseSearch('')
    setPendingCourse(null)
    setShowAddCourse(false)
    await refetchPlan()
  }

  const handleRemoveCourse = async (courseId) => {
    if (!plan) return
    await careerPlansApi.removeCourse(plan._id, courseId)
    await refetchPlan()
  }

  const handleUpdateSkills = async (skills, softSkills) => {
    if (!plan) return
    await careerPlansApi.updateSkills(plan._id, { skills, softSkills })
    await refetchPlan()
  }

  const addHardSkill = () => {
    const t = hardInput.trim()
    if (!t || !plan) return
    if (plan.skills?.includes(t)) { setHardInput(''); return }
    const updated = [...(plan.skills || []), t]
    handleUpdateSkills(updated, plan.softSkills || [])
    setHardInput('')
  }

  const removeHardSkill = (skill) => {
    if (!plan) return
    const updated = (plan.skills || []).filter(s => s !== skill)
    handleUpdateSkills(updated, plan.softSkills || [])
  }

  const addSoftSkill = () => {
    const t = softInput.trim()
    if (!t || !plan) return
    if (plan.softSkills?.includes(t)) { setSoftInput(''); return }
    const updated = [...(plan.softSkills || []), t]
    handleUpdateSkills(plan.skills || [], updated)
    setSoftInput('')
  }

  const removeSoftSkill = (skill) => {
    if (!plan) return
    const updated = (plan.softSkills || []).filter(s => s !== skill)
    handleUpdateSkills(plan.skills || [], updated)
  }

  // Build course list from plan.selectedCourses — courseId is the course name
  const planCourses = (plan?.selectedCourses || []).map(sc => {
    const courseName = sc.courseId || sc
    const info = allCourses.find(c => c.name === courseName || c._id === courseName) || {}
    return {
      id: courseName,
      name: info.name || info.title || courseName,
      type: info.type || 'Curso',
      provider: info.provider || '',
      duration: info.duration || '',
      priority: info.priority || sc.priority || 2,
      status: sc.status || 'pendiente',
    }
  })

  // Available courses for the add dropdown (not already in plan)
  const planCourseNames = new Set(planCourses.map(c => c.name))
  const filteredAvailable = allCourses.filter(c =>
    !planCourseNames.has(c.name || c.title) &&
    ((c.name || c.title || '').toLowerCase().includes(courseSearch.toLowerCase()) || (c.type || '').toLowerCase().includes(courseSearch.toLowerCase()))
  )

  // Path nodes
  const pathNodes = plan ? [
    { id: 'n0', label: member.industry || 'Rol anterior', sub: 'Completado', ring: '#28c040', done: true, type: 'done' },
    { id: 'n1', label: member.industry || member.department, sub: 'Actual', ring: '#496be3', current: true, type: 'current' },
    { id: 'n2', label: plan.routeLabel || plan.route, sub: 'Meta', ring: '#9db8f3', type: 'target' },
    { id: 'n3', label: 'Siguiente nivel', sub: 'Bloqueado', ring: '#cbcdd6', locked: true, type: 'locked' },
  ] : []
  const pathConnectors = ['solid', 'solid', 'dashed']

  // Objectives
  const objectives = plan?.objectives || []
  const completedCount = objectives.filter(o => o.completed === true).length

  // Skills
  const hardSkills = plan?.skills || []
  const softSkills = plan?.softSkills || []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-[13px] text-n-500">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="flex gap-5">
      {/* LEFT: team list */}
      <div style={{ width: 280 }}>
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-5 py-3.5 border-b border-n-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-n-950">Mi equipo</span>
            <span className="text-[11px] text-n-600">{team.length} reportes directos</span>
          </div>
          <div className="p-3 flex flex-col gap-1">
            {team.map((t, i) => {
              const status = planStatusMap[t._id]
              const badge = getStatusBadge(status ? { status } : null)
              const color = AVATAR_COLORS[i % AVATAR_COLORS.length]
              const initials = getInitials(t.name || '')
              return (
                <button
                  key={t._id}
                  onClick={() => setSelectedIdx(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${selectedIdx === i ? 'bg-h-50' : 'hover:bg-n-50'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${color}`}>{initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-n-950 truncate">{t.name}</p>
                    <p className="text-[11px] text-n-600 truncate">{t.industry || t.department || ''}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${badge.cls}`}>
                    {badge.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: detail */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {!plan && member && (
          <div className="bg-white rounded-2xl shadow-4dp flex items-center justify-center h-40">
            <p className="text-[13px] text-n-500">Este colaborador aún no tiene un plan de carrera</p>
          </div>
        )}

        {!member && (
          <div className="bg-white rounded-2xl shadow-4dp flex items-center justify-center h-40">
            <p className="text-[13px] text-n-500">Seleccioná un integrante del equipo para ver su plan</p>
          </div>
        )}

        {plan && member && (
          <>
            {/* Alert banners */}
            {planStatus === 'submitted' && (
              <div className="rounded-2xl bg-y-50 border border-y-200 px-5 py-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-y-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-n-950">{member.name} envió un plan de carrera para revisión</p>
                  <p className="text-[12px] text-n-600 mt-0.5">Objetivo: {plan.routeLabel || plan.route}{plan.createdAt ? ` · Enviado ${new Date(plan.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setShowConfirmApprove(true)}
                    className="h-8 px-3 text-[12px] font-semibold border border-g-600 text-g-800 rounded-lg hover:bg-g-50 transition-colors"
                  ><Check size={13} className="inline mr-1" />Aprobar</button>
                  <button
                    onClick={() => setShowSuggest(true)}
                    className="h-8 px-3 text-[12px] font-semibold border border-y-600 text-y-700 rounded-lg hover:bg-y-50 transition-colors"
                  ><CornerDownLeft size={13} className="inline mr-1" />Sugerir cambios</button>
                </div>
              </div>
            )}

            {planStatus === 'approved' && (
              <div className="rounded-2xl bg-g-50 border border-g-200 px-5 py-3.5 flex items-center gap-3">
                <CheckCircle size={18} className="text-g-600 shrink-0" />
                <p className="text-[13px] font-semibold text-g-800">Plan de carrera de {member.name} aprobado</p>
              </div>
            )}

            {planStatus === 'changes_requested' && (
              <div className="rounded-2xl bg-r-50 border border-r-200 px-5 py-4 flex items-start gap-3">
                <CornerDownLeft size={18} className="text-r-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-r-700">Se solicitaron cambios al plan de carrera</p>
                  {plan.managerFeedback && (
                    <p className="text-[12px] text-n-700 mt-1.5 bg-white border border-r-100 rounded-lg px-3 py-2 italic">"{plan.managerFeedback}"</p>
                  )}
                  <p className="text-[11px] text-n-500 mt-1">Esperando que {member.name} reenvíe el plan con correcciones</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setShowConfirmApprove(true)}
                    className="h-8 px-3 text-[12px] font-semibold border border-g-600 text-g-800 rounded-lg hover:bg-g-50 transition-colors"
                  ><Check size={13} className="inline mr-1" />Aprobar igual</button>
                  <button
                    onClick={() => setShowSuggest(true)}
                    className="h-8 px-3 text-[12px] font-semibold border border-y-600 text-y-700 rounded-lg hover:bg-y-50 transition-colors"
                  ><CornerDownLeft size={13} className="inline mr-1" />Agregar feedback</button>
                </div>
              </div>
            )}

            {/* Confirm approve modal */}
            {showConfirmApprove && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-8dp w-full max-w-sm p-6 flex flex-col gap-4">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-g-50 flex items-center justify-center">
                      <Check size={24} className="text-g-600" />
                    </div>
                    <p className="text-[15px] font-bold text-n-950">Aprobar plan de carrera</p>
                    <p className="text-[13px] text-n-600">
                      ¿Confirmás la aprobación del plan de <span className="font-semibold">{member.name}</span> hacia <span className="font-semibold">{plan.routeLabel || plan.route}</span>?
                    </p>
                    <p className="text-[11px] text-n-500">Esta acción habilitará al colaborador a marcar objetivos y avanzar en su plan.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowConfirmApprove(false)}
                      className="flex-1 h-9 bg-white border border-n-200 text-n-700 rounded-lg text-[13px] font-medium hover:bg-n-50 transition-colors"
                    >Cancelar</button>
                    <button
                      onClick={async () => {
                        await handleApprove()
                        setShowConfirmApprove(false)
                      }}
                      className="flex-1 h-9 bg-g-600 hover:bg-g-700 text-white rounded-lg text-[13px] font-semibold transition-colors"
                    >Sí, aprobar</button>
                  </div>
                </div>
              </div>
            )}

            {/* Suggest changes modal */}
            {showSuggest && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-8dp w-full max-w-md p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-[16px] font-bold text-n-950">Sugerir cambios</p>
                    <p className="text-[12px] text-n-600 mt-0.5">{member.name} recibirá una notificación con tu feedback.</p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[11px] font-semibold text-n-700">¿Qué cambios sugerís?</p>
                    <textarea
                      autoFocus
                      className="textarea-humand"
                      rows={4}
                      placeholder="Ej: Revisá los objetivos a largo plazo, el plazo estimado parece corto para el nivel Senior..."
                      value={suggestion}
                      onChange={e => setSuggestion(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => { setShowSuggest(false); setSuggestion('') }}
                      className="h-9 px-4 bg-white border border-n-200 text-n-700 rounded-lg text-[13px] font-medium hover:bg-n-50 transition-colors"
                    >Cancelar</button>
                    <button
                      onClick={handleRequestChanges}
                      disabled={!suggestion.trim()}
                      className="h-9 px-4 bg-h-500 hover:bg-h-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-[13px] font-semibold transition-colors"
                    >Enviar sugerencia</button>
                  </div>
                </div>
              </div>
            )}

            {/* Career path map */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-n-950">{member.name} — Mapa de carrera</p>
                  <p className="text-[11px] text-n-600">{plan.type === 'lateral' ? 'Crecimiento lateral' : 'Crecimiento vertical'} · {plan.timeframe || '1 año'}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${planStatus === 'approved' ? 'bg-g-100 text-g-800' : planStatus === 'changes_requested' ? 'bg-r-100 text-r-600' : 'bg-y-100 text-y-700'}`}>
                  {planStatus === 'approved' ? 'Aprobado' : planStatus === 'changes_requested' ? 'Cambios sugeridos' : 'En revisión'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start w-full">
                  {pathNodes.flatMap((node, i) => {
                    const items = []
                    if (i > 0) {
                      const connColor = i === 1 ? '#28c040' : i === 2 ? '#496be3' : '#cbcdd6'
                      const connStyle = pathConnectors[i - 1] === 'dashed' ? 'dashed' : 'solid'
                      items.push(
                        <div key={`ac-${i}`} className="flex-1 mx-1 mt-[54px]" style={{ borderTop: `2px ${connStyle} ${connColor}` }} />
                      )
                    }
                    items.push(
                      <div key={node.id} className="flex flex-col items-center shrink-0">
                        <PathNode node={node} filter="Todo" thirdPerson />
                      </div>
                    )
                    return items
                  })}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100">
                <p className="text-[13px] font-semibold text-n-950">Skills</p>
                <p className="text-[11px] text-n-600">{hardSkills.length + softSkills.length} habilidades para el rol</p>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Habilidades técnicas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hardSkills.map(s => (
                      <div key={s} className="flex items-center gap-1 text-[11px] font-medium bg-h-50 text-h-800 border border-h-200 px-2.5 py-1 rounded-lg">
                        {s}{isEditable && <button onClick={() => removeHardSkill(s)} className="text-h-400 hover:text-r-600 ml-1"><X size={9} /></button>}
                      </div>
                    ))}
                    {isEditable && <div className="flex items-center gap-1">
                      <input
                        className="h-7 px-2 text-[11px] border border-n-200 rounded-lg outline-none focus:border-h-400 w-24 placeholder:text-n-400"
                        placeholder="+ Agregar..."
                        value={hardInput}
                        onChange={e => setHardInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHardSkill() } }}
                      />
                    </div>}
                  </div>
                </div>
                <div className="pt-3 border-t border-n-100">
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Soft skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {softSkills.map(s => (
                      <div key={s} className="flex items-center gap-1 text-[11px] font-medium bg-t-50 text-t-800 border border-t-200 px-2.5 py-1 rounded-lg">
                        {s}{isEditable && <button onClick={() => removeSoftSkill(s)} className="text-t-400 hover:text-r-600 ml-1"><X size={9} /></button>}
                      </div>
                    ))}
                    {isEditable && <div className="flex items-center gap-1">
                      <input
                        className="h-7 px-2 text-[11px] border border-n-200 rounded-lg outline-none focus:border-h-400 w-24 placeholder:text-n-400"
                        placeholder="+ Agregar..."
                        value={softInput}
                        onChange={e => setSoftInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSoftSkill() } }}
                      />
                    </div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100">
                <p className="text-[13px] font-semibold text-n-950">Objetivos</p>
                <p className="text-[11px] text-n-600">{completedCount} de {objectives.length} completados</p>
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                {objectives.map((g) => {
                  const cfg = TERM_CONFIG[g.term]
                  const isDone = g.completed === true
                  return (
                    <div key={g._id} className={`flex items-start gap-2.5 p-2 rounded-lg group ${isDone ? 'bg-h-50' : ''}`}>
                      <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center ${isDone ? 'bg-h-500' : 'border-2 border-n-300'}`}>
                        {isDone && <Check size={10} className="text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] leading-tight text-n-950">{g.text}</p>
                        {cfg && <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${cfg.badge}`}>{cfg.label}</span>}
                      </div>
                      {isEditable && <button onClick={() => handleRemoveObjective(g._id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-n-400 hover:text-r-600 shrink-0 mt-0.5"><X size={12} /></button>}
                    </div>
                  )
                })}
                {isEditable && <div className="flex items-center gap-2 mt-1 pt-2 border-t border-n-100">
                  <select className="h-8 px-2 text-[11px] border border-n-200 rounded-lg outline-none focus:border-h-400 bg-white shrink-0" value={goalTerm} onChange={e => setGoalTerm(e.target.value)}>
                    <option value="short">Corto</option>
                    <option value="medium">Mediano</option>
                    <option value="long">Largo</option>
                  </select>
                  <input
                    className="flex-1 h-8 px-2.5 text-[12px] border border-n-200 rounded-lg outline-none focus:border-h-400 placeholder:text-n-400"
                    placeholder="Nuevo objetivo..."
                    value={goalInput}
                    onChange={e => setGoalInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddObjective() } }}
                  />
                  <button onClick={handleAddObjective} className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0"><Plus size={13} /></button>
                </div>}
              </div>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-n-950">Cursos y aprendizaje</p>
                {isEditable && <button onClick={() => setShowAddCourse(o => !o)} className="h-7 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"><Plus size={11} /> Agregar</button>}
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                {showAddCourse && (
                  <div className="relative mb-1">
                    <div className="fixed inset-0 z-10" onClick={() => { setShowAddCourse(false); setCourseSearch(''); setPendingCourse(null) }} />
                    <div className="relative z-20 border border-h-200 rounded-xl overflow-hidden shadow-8dp bg-white">
                      {pendingCourse ? (
                        <>
                          <div className="flex items-center gap-2 px-3 py-2 border-b border-n-100">
                            <button onClick={() => setPendingCourse(null)} className="text-n-400 hover:text-n-700 shrink-0"><ChevronDown size={13} className="rotate-90" /></button>
                            <span className="text-[12px] font-semibold text-n-950 flex-1 truncate">{pendingCourse.title}</span>
                          </div>
                          <div className="p-3">
                            <p className="text-[11px] text-n-500 mb-2.5 text-center">¿Cómo clasificás este curso?</p>
                            <div className="flex flex-col gap-2">
                              {Object.entries(PRIORITY_CONFIG).map(([p, cfg]) => (
                                <button
                                  key={p}
                                  onClick={() => handleAddCourse(pendingCourse, Number(p))}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-n-200 hover:border-h-300 hover:bg-h-50 transition-all text-left"
                                >
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                                  <span className="text-[11px] text-n-600">
                                    {p === '1' ? 'Obligatorio para avanzar al siguiente nivel' : p === '2' ? 'Mejora el perfil, pero no es bloqueante' : 'Complementario, a criterio del colaborador'}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 px-3 py-2 border-b border-n-100">
                            <Search size={13} className="text-n-400 shrink-0" />
                            <input
                              autoFocus
                              className="flex-1 text-[12px] outline-none placeholder:text-n-400 bg-transparent"
                              placeholder="Buscar curso..."
                              value={courseSearch}
                              onChange={e => setCourseSearch(e.target.value)}
                            />
                            <button onClick={() => { setShowAddCourse(false); setCourseSearch('') }} className="text-n-400 hover:text-n-700"><X size={13} /></button>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {filteredAvailable.length === 0 && (
                              <p className="text-[12px] text-n-500 text-center py-4">Sin resultados</p>
                            )}
                            {filteredAvailable.map(c => (
                              <button
                                key={c._id}
                                onClick={() => setPendingCourse(c)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-n-50 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-n-100 flex items-center justify-center shrink-0"><CourseIcon type={c.type} size={15} /></div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{c.type}</p>
                                  <p className="text-[12px] font-semibold text-n-950 truncate">{c.title}</p>
                                  <p className="text-[11px] text-n-600">{c.provider} · {c.duration}</p>
                                </div>
                                <ChevronDown size={12} className="text-n-400 -rotate-90 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {planCourses.map((c, i) => {
                  const pcfg = PRIORITY_CONFIG[c.priority] || PRIORITY_CONFIG[3]
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-n-50 group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-4dp flex items-center justify-center shrink-0"><CourseIcon type={c.type} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{c.type || 'Curso'}</p>
                        <p className="text-[13px] font-semibold text-n-950 mt-0.5">{c.name}</p>
                        <p className="text-[11px] text-n-600">{c.provider}{c.duration ? ` · ${c.duration}` : ''}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${pcfg.badge}`}>{pcfg.label}</span>
                      {isEditable && <button onClick={() => handleRemoveCourse(c.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-n-400 hover:text-r-600 shrink-0"><X size={13} /></button>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Feedback history */}
            {plan.feedbackHistory?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-4dp">
                <div className="px-6 py-4 border-b border-n-100">
                  <p className="text-[13px] font-semibold text-n-950">Historial de comunicación</p>
                  <p className="text-[11px] text-n-600">{plan.feedbackHistory.length} mensajes</p>
                </div>
                <div className="p-4 flex flex-col gap-2">
                  {plan.feedbackHistory.map((fb, i) => (
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

            {/* Manager feedback */}
            {plan && <div className="bg-white rounded-2xl shadow-4dp">
              <div className="p-5 flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Agregar feedback</p>
                  <textarea
                    className="textarea-humand"
                    placeholder={`Compartí tu feedback sobre el plan de carrera de ${member.name}...`}
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                  />
                  <button
                    disabled={!feedback.trim()}
                    onClick={async () => {
                      if (!plan || !feedback.trim()) return
                      await careerPlansApi.addFeedback(plan._id, feedback, selectedUser?.name)
                      setFeedback('')
                      await refetchPlan()
                    }}
                    className="mt-2 h-9 px-4 bg-h-500 hover:bg-h-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-[13px] font-semibold transition-colors"
                  >Enviar comentario</button>
                </div>
              </div>
            </div>}
          </>
        )}
      </div>
    </div>
  )
}
