import { useState } from 'react'
import { X, Plus, Check, ChevronDown, Search, AlertTriangle, CheckCircle, CornerDownLeft } from 'lucide-react'
import { PathNode, CourseIcon } from './shared'
import { COURSES_BY_ROUTE, DEFAULT_COURSES, TERM_CONFIG, PRIORITY_CONFIG } from './constants'

const TEAM = [
  { initials: 'AG', name: 'Ana García',   role: 'Product Designer',   badge: 'bg-y-100 text-y-700',  badgeLabel: 'En revisión',  color: 'bg-h-100 text-h-600' },
  { initials: 'LH', name: 'Luis Herrera', role: 'Frontend Engineer',  badge: 'bg-g-100 text-g-700',  badgeLabel: 'Aprobado',     color: 'bg-t-100 text-t-800' },
  { initials: 'MT', name: 'Mia Torres',   role: 'UX Researcher',      badge: 'bg-y-100 text-y-700',  badgeLabel: 'En revisión',  color: 'bg-p-100 text-p-800' },
  { initials: 'CR', name: 'Carlos Ruiz',  role: 'Backend Engineer',   badge: 'bg-n-100 text-n-600',  badgeLabel: 'Sin plan',     color: 'bg-g-100 text-g-800' },
  { initials: 'SL', name: 'Sara López',   role: 'Data Analyst',       badge: 'bg-n-100 text-n-600',  badgeLabel: 'Sin plan',     color: 'bg-y-100 text-y-700' },
]

const ANA_HARD_SKILLS = ['Visual Design', 'Prototyping', 'UX Research', 'Design Systems', 'Figma Advanced']
const ANA_SOFT_SKILLS = ['Comunicación efectiva', 'Trabajo en equipo', 'Pensamiento crítico']
const ANA_GOALS = [
  { done: true,  text: 'Completar curso de UX Research',         term: 'short'  },
  { done: false, text: 'Liderar Design Sprint Q3',               term: 'medium' },
  { done: false, text: 'Sesiones de mentoría (×6)',              term: 'medium' },
  { done: false, text: 'Alcanzar el nivel Senior con aprobación', term: 'long'  },
]
const ANA_COURSES = [
  { id: 'ac1', emoji: '📗', title: 'Stakeholder Management Fundamentals', type: 'Curso',         duration: '4h',  provider: 'LinkedIn Learning', priority: 1 },
  { id: 'ac2', emoji: '🎨', title: 'Advanced Design Systems',             type: 'Certificación', duration: '12h', provider: 'Figma Academy',     priority: 1 },
  { id: 'ac3', emoji: '🔬', title: 'UX Research Methods',                 type: 'Curso',         duration: '8h',  provider: 'Humand Learn',      priority: 2 },
]
const ANA_PATH_NODES = [
  { id: 'ap0', label: 'Junior Designer',  sub: 'Completado · L1', ring: '#28c040', done: true,    type: 'done'    },
  { id: 'ap1', label: 'Product Designer', sub: 'Actual · L2',     ring: '#496be3', current: true, type: 'current' },
  { id: 'ap2', label: 'Senior Designer',  sub: 'Meta · L3',       ring: '#9db8f3', level: 'L3',   type: 'target'  },
  { id: 'ap3', label: 'Design Lead',      sub: 'Bloqueado · L4',  ring: '#cbcdd6', locked: true,  type: 'locked'  },
]
const ANA_PATH_CONNECTORS = ['solid', 'solid', 'dashed']

export default function ManagerTab() {
  const [selected, setSelected]         = useState(0)
  const [feedback, setFeedback]         = useState('')
  const [anaStatus, setAnaStatus]       = useState('revision')
  const [showSuggest, setShowSuggest]   = useState(false)
  const [suggestion, setSuggestion]     = useState('')
  const [savedSuggestion, setSavedSuggestion] = useState('')

  const [hardSkills, setHardSkills] = useState([...ANA_HARD_SKILLS])
  const [softSkills, setSoftSkills] = useState([...ANA_SOFT_SKILLS])
  const [goals, setGoals]           = useState([...ANA_GOALS])
  const [courses, setCourses]       = useState([...ANA_COURSES])

  const [hardInput, setHardInput]   = useState('')
  const [softInput, setSoftInput]   = useState('')
  const [goalInput, setGoalInput]   = useState('')
  const [goalTerm, setGoalTerm]     = useState('short')
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [courseSearch, setCourseSearch]   = useState('')
  const [pendingCourse, setPendingCourse] = useState(null)

  const allAvailableCourses = Object.values(COURSES_BY_ROUTE).flat().concat(DEFAULT_COURSES)
    .filter((c, i, arr) => arr.findIndex(x => x.id === c.id) === i)

  const filteredAvailable = allAvailableCourses.filter(c =>
    !courses.find(x => x.id === c.id) &&
    (c.title.toLowerCase().includes(courseSearch.toLowerCase()) || c.type.toLowerCase().includes(courseSearch.toLowerCase()))
  )

  const addHardSkill = () => { const t = hardInput.trim(); if (t && !hardSkills.includes(t)) setHardSkills(p => [...p, t]); setHardInput('') }
  const addSoftSkill = () => { const t = softInput.trim(); if (t && !softSkills.includes(t)) setSoftSkills(p => [...p, t]); setSoftInput('') }
  const addGoal = () => { const t = goalInput.trim(); if (!t) return; setGoals(p => [...p, { done: false, text: t, term: goalTerm }]); setGoalInput('') }
  const addCourse = (c, priority) => {
    setCourses(p => [...p, { ...c, priority }])
    setCourseSearch('')
    setPendingCourse(null)
    setShowAddCourse(false)
  }

  const handleSuggest = () => {
    if (!suggestion.trim()) return
    setSavedSuggestion(suggestion)
    setSuggestion('')
    setAnaStatus('cambios')
    setShowSuggest(false)
  }

  return (
    <div className="flex gap-5">
      {/* LEFT: team list */}
      <div style={{ width: 280 }}>
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-5 py-3.5 border-b border-n-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-n-950">Mi equipo</span>
            <span className="text-[11px] text-n-600">5 reportes directos</span>
          </div>
          <div className="p-3 flex flex-col gap-1">
            {TEAM.map((m, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${selected === i ? 'bg-h-50' : 'hover:bg-n-50'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${m.color}`}>{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-n-950 truncate">{m.name}</p>
                  <p className="text-[11px] text-n-600 truncate">{m.role}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  i === 0 && anaStatus === 'aprobado' ? 'bg-g-100 text-g-800' :
                  i === 0 && anaStatus === 'cambios'  ? 'bg-r-100 text-r-600' : m.badge}`}>
                  {i === 0 && anaStatus === 'aprobado' ? 'Aprobado' :
                   i === 0 && anaStatus === 'cambios'  ? 'Cambios sugeridos' : m.badgeLabel}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: detail */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {selected === 0 && (
          <>
            {anaStatus === 'revision' && (
              <div className="rounded-2xl bg-y-50 border border-y-200 px-5 py-4 flex items-start gap-3">
                <AlertTriangle size={18} className="text-y-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-n-950">Ana García envió un plan de carrera para revisión</p>
                  <p className="text-[12px] text-n-600 mt-0.5">Objetivo: Senior Designer · Enviado 15 Mar 2026</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setAnaStatus('aprobado')}
                    className="h-8 px-3 text-[12px] font-semibold border border-g-600 text-g-800 rounded-lg hover:bg-g-50 transition-colors"
                  ><Check size={13} className="inline mr-1" />Aprobar</button>
                  <button
                    onClick={() => setShowSuggest(true)}
                    className="h-8 px-3 text-[12px] font-semibold border border-y-600 text-y-700 rounded-lg hover:bg-y-50 transition-colors"
                  ><CornerDownLeft size={13} className="inline mr-1" />Sugerir cambios</button>
                </div>
              </div>
            )}

            {anaStatus === 'aprobado' && (
              <div className="rounded-2xl bg-g-50 border border-g-200 px-5 py-3.5 flex items-center gap-3">
                <CheckCircle size={18} className="text-g-600 shrink-0" />
                <p className="text-[13px] font-semibold text-g-800">Plan de carrera de Ana García aprobado</p>
              </div>
            )}

            {anaStatus === 'cambios' && (
              <div className="rounded-2xl bg-r-50 border border-r-200 px-5 py-4 flex items-start gap-3">
                <CornerDownLeft size={18} className="text-r-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-r-700">Se solicitaron cambios al plan de carrera</p>
                  {savedSuggestion && (
                    <p className="text-[12px] text-n-700 mt-1.5 bg-white border border-r-100 rounded-lg px-3 py-2 italic">"{savedSuggestion}"</p>
                  )}
                </div>
                <button
                  onClick={() => setAnaStatus('revision')}
                  className="h-8 px-3 text-[12px] font-semibold border border-n-300 text-n-600 rounded-lg hover:bg-n-50 transition-colors shrink-0"
                >Reabrir</button>
              </div>
            )}

            {showSuggest && (
              <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-8dp w-full max-w-md p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-[16px] font-bold text-n-950">Sugerir cambios</p>
                    <p className="text-[12px] text-n-600 mt-0.5">Ana García recibirá una notificación con tu feedback.</p>
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
                      onClick={handleSuggest}
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
                  <p className="text-[13px] font-semibold text-n-950">Ana García — Mapa de carrera</p>
                  <p className="text-[11px] text-n-600">Crecimiento vertical · 1 año</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${anaStatus === 'aprobado' ? 'bg-g-100 text-g-800' : 'bg-y-100 text-y-700'}`}>
                  {anaStatus === 'aprobado' ? 'Aprobado' : 'En revisión'}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-start w-full">
                  {ANA_PATH_NODES.flatMap((node, i) => {
                    const items = []
                    if (i > 0) {
                      const connColor = i === 1 ? '#28c040' : i === 2 ? '#496be3' : '#cbcdd6'
                      const connStyle = ANA_PATH_CONNECTORS[i - 1] === 'dashed' ? 'dashed' : 'solid'
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
                        {s}<button onClick={() => setHardSkills(p => p.filter(x => x !== s))} className="text-h-400 hover:text-r-600 ml-1"><X size={9} /></button>
                      </div>
                    ))}
                    <div className="flex items-center gap-1">
                      <input
                        className="h-7 px-2 text-[11px] border border-n-200 rounded-lg outline-none focus:border-h-400 w-24 placeholder:text-n-400"
                        placeholder="+ Agregar..."
                        value={hardInput}
                        onChange={e => setHardInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHardSkill() } }}
                      />
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-n-100">
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Soft skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {softSkills.map(s => (
                      <div key={s} className="flex items-center gap-1 text-[11px] font-medium bg-t-50 text-t-800 border border-t-200 px-2.5 py-1 rounded-lg">
                        {s}<button onClick={() => setSoftSkills(p => p.filter(x => x !== s))} className="text-t-400 hover:text-r-600 ml-1"><X size={9} /></button>
                      </div>
                    ))}
                    <div className="flex items-center gap-1">
                      <input
                        className="h-7 px-2 text-[11px] border border-n-200 rounded-lg outline-none focus:border-h-400 w-24 placeholder:text-n-400"
                        placeholder="+ Agregar..."
                        value={softInput}
                        onChange={e => setSoftInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSoftSkill() } }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100">
                <p className="text-[13px] font-semibold text-n-950">Objetivos</p>
                <p className="text-[11px] text-n-600">{goals.filter(g => g.done).length} de {goals.length} completados</p>
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                {goals.map((g, i) => {
                  const cfg = TERM_CONFIG[g.term]
                  return (
                    <div key={i} className={`flex items-start gap-2.5 p-2 rounded-lg group ${g.done ? 'bg-h-50' : ''}`}>
                      <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center ${g.done ? 'bg-h-500' : 'border-2 border-n-300'}`}>
                        {g.done && <Check size={10} className="text-white" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] leading-tight text-n-950">{g.text}</p>
                        <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${cfg.badge}`}>{cfg.label}</span>
                      </div>
                      <button onClick={() => setGoals(p => p.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 transition-opacity text-n-400 hover:text-r-600 shrink-0 mt-0.5"><X size={12} /></button>
                    </div>
                  )
                })}
                <div className="flex items-center gap-2 mt-1 pt-2 border-t border-n-100">
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
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addGoal() } }}
                  />
                  <button onClick={addGoal} className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0"><Plus size={13} /></button>
                </div>
              </div>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-n-950">Cursos y aprendizaje</p>
                <button onClick={() => setShowAddCourse(o => !o)} className="h-7 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"><Plus size={11} /> Agregar</button>
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
                                  onClick={() => addCourse(pendingCourse, Number(p))}
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
                                key={c.id}
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
                {courses.map(c => {
                  const pcfg = PRIORITY_CONFIG[c.priority] || PRIORITY_CONFIG[3]
                  return (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-n-50 group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-4dp flex items-center justify-center shrink-0"><CourseIcon type={c.type} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{c.type}</p>
                        <p className="text-[13px] font-semibold text-n-950 mt-0.5">{c.title}</p>
                        <p className="text-[11px] text-n-600">{c.provider} · {c.duration}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${pcfg.badge}`}>{pcfg.label}</span>
                      <button onClick={() => setCourses(p => p.filter(x => x.id !== c.id))} className="opacity-0 group-hover:opacity-100 transition-opacity text-n-400 hover:text-r-600 shrink-0"><X size={13} /></button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Manager actions */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100">
                <p className="text-[13px] font-semibold text-n-950">Acciones del manager</p>
              </div>
              <div className="p-5 flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Sugerir cambios</p>
                  <textarea
                    className="textarea-humand"
                    placeholder="Compartí tu feedback sobre el plan de carrera de Ana..."
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                  />
                  <button className="mt-2 h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors">Enviar comentario</button>
                </div>
              </div>
            </div>
          </>
        )}

        {selected !== 0 && (
          <div className="bg-white rounded-2xl shadow-4dp flex items-center justify-center h-40">
            <p className="text-[13px] text-n-500">Seleccioná un integrante del equipo para ver su plan</p>
          </div>
        )}
      </div>
    </div>
  )
}
