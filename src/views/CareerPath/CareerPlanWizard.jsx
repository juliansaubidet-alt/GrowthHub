import { useState, useEffect } from 'react'
import { Check, TrendingUp, ArrowLeftRight } from 'lucide-react'
import { CourseIcon } from './shared'
import { TERM_CONFIG, PRIORITY_CONFIG } from './constants'
import { careerPathsApi } from '../../api/careerPaths'
import { coursesApi } from '../../api/courses'
import { usersApi } from '../../api/users'

const WIZARD_STEPS = ['Ruta profesional', 'Habilidades', 'Objetivos', 'Aprendizaje', 'Revisión']

const SOFT_SKILLS = [
  'Comunicación efectiva', 'Trabajo en equipo', 'Liderazgo', 'Gestión del tiempo',
  'Resolución de conflictos', 'Adaptabilidad', 'Pensamiento crítico', 'Empatía',
  'Proactividad', 'Negociación', 'Presentaciones', 'Mentoría',
]

export default function CareerPlanWizard({ onComplete, onCancel, initialData }) {
  const isEdit = !!initialData
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(() => {
    if (initialData) {
      return {
        growthType:      initialData.growthType || 'vertical',
        route:           initialData.route || '',
        duration:        initialData.duration || '',
        manager:         initialData.managerId?._id || initialData.managerId || '',
        description:     initialData.description || '',
        skills:          initialData.skills || [],
        customSkillInput:'',
        softSkills:      initialData.softSkills || [],
        softSkillInput:  '',
        objectives:      (initialData.objectives || []).map(o => ({ id: o._id || o.id || (o.text + Date.now()), text: o.text, term: o.term })),
        objInput:        '',
        objTerm:         'short',
        editingObjId:    null,
        selectedCourses: (initialData.selectedCourses || []).map(sc => sc.courseId?._id || sc.courseId || sc),
      }
    }
    return {
      growthType:      'vertical',
      route:           '',
      duration:        '',
      manager:         '',
      description:     '',
      skills:          [],
      customSkillInput:'',
      softSkills:      [],
      softSkillInput:  '',
      objectives:      [],
      objInput:        '',
      objTerm:         'short',
      editingObjId:    null,
      selectedCourses: [],
    }
  })

  const [routes, setRoutes] = useState([])
  const [managers, setManagers] = useState([])
  const [predefinedSkills, setPredefinedSkills] = useState([])
  const [suggestedCourses, setSuggestedCourses] = useState([])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  // Fetch managers on mount
  useEffect(() => {
    usersApi.getManagers().then(data => {
      setManagers(data.map(m => ({ value: m._id, label: m.name, role: m.role || m.department })))
    }).catch(console.error)
  }, [])

  // Fetch routes when growthType changes
  useEffect(() => {
    careerPathsApi.getRoutes(form.growthType).then(data => {
      setRoutes(data.map(r => ({ value: r.value, label: r.label, level: r.level })))
    }).catch(console.error)
  }, [form.growthType])

  // Load predefined skills if route is pre-set (edit mode)
  useEffect(() => {
    if (form.route) {
      careerPathsApi.getSkills(form.route).then(skills => setPredefinedSkills(skills || [])).catch(console.error)
    }
  }, [])

  // Fetch courses when route changes
  useEffect(() => {
    if (!form.route) { setSuggestedCourses([]); return }
    coursesApi.getByRoute(form.route).then(data => {
      setSuggestedCourses(data.map((c, i) => ({ ...c, id: c._id, priority: c.priority || (i === 0 ? 1 : i <= 2 ? 2 : 3) })))
    }).catch(console.error)
  }, [form.route])

  const selectedRoute    = routes.find(r => r.value === form.route)
  const selectedManager  = managers.find(m => m.value === form.manager)

  const handleRouteChange = async (val) => {
    set('route', val)
    if (!val) {
      setPredefinedSkills([])
      set('objectives', [])
      return
    }
    try {
      const [skills, objectives] = await Promise.all([
        careerPathsApi.getSkills(val),
        careerPathsApi.getObjectives(val),
      ])
      setPredefinedSkills(skills || [])
      set('objectives', (objectives || []).map(o => ({ ...o, id: o._id || (o.text + Date.now()) })))
    } catch (err) {
      console.error(err)
      setPredefinedSkills([])
      set('objectives', [])
    }
  }

  const toggleSkill     = (skill) => set('skills',     form.skills.includes(skill)     ? form.skills.filter(s => s !== skill)     : [...form.skills, skill])
  const toggleSoftSkill = (skill) => set('softSkills', form.softSkills.includes(skill) ? form.softSkills.filter(s => s !== skill) : [...form.softSkills, skill])

  const addCustomSkill = () => {
    const v = form.customSkillInput.trim()
    if (v && !form.skills.includes(v)) { set('skills', [...form.skills, v]); set('customSkillInput', '') }
  }
  const addSoftSkill = () => {
    const v = form.softSkillInput.trim()
    if (v && !form.softSkills.includes(v)) { set('softSkills', [...form.softSkills, v]); set('softSkillInput', '') }
  }

  const addObjective = () => {
    const v = form.objInput.trim()
    if (!v) return
    if (form.editingObjId) {
      set('objectives', form.objectives.map(o => o.id === form.editingObjId ? { ...o, text: v, term: form.objTerm } : o))
      set('editingObjId', null)
    } else {
      set('objectives', [...form.objectives, { id: 'custom-' + Date.now(), text: v, term: form.objTerm }])
    }
    set('objInput', ''); set('objTerm', 'short')
  }
  const startEditObj = (obj) => { set('editingObjId', obj.id); set('objInput', obj.text); set('objTerm', obj.term) }
  const deleteObj    = (id)  => set('objectives', form.objectives.filter(o => o.id !== id))

  const toggleCourse = (id) =>
    set('selectedCourses', form.selectedCourses.includes(id) ? form.selectedCourses.filter(c => c !== id) : [...form.selectedCourses, id])

  const canNext = () => {
    if (step === 1) return form.route && form.duration && form.manager
    if (step === 2) return form.skills.length > 0
    if (step === 3) return form.objectives.length > 0
    return true
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-n-950">{isEdit ? 'Editar plan de carrera' : 'Crear plan de carrera'}</h2>
          <p className="text-[12px] text-n-600 mt-0.5">Paso {step} de {WIZARD_STEPS.length} · {WIZARD_STEPS[step - 1]}</p>
        </div>
        <button onClick={onCancel} className="text-[12px] text-n-500 hover:text-n-800 transition-colors">✕ Cancelar</button>
      </div>

      {/* Step progress */}
      <div className="flex gap-1.5">
        {WIZARD_STEPS.map((s, i) => (
          <div key={i} className="flex-1 flex flex-col gap-1.5">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${i < step ? 'bg-h-500' : 'bg-n-100'}`} />
            <p className={`text-[10px] text-center ${i + 1 === step ? 'text-h-600 font-semibold' : i < step ? 'text-n-600' : 'text-n-400'}`}>{s}</p>
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-4dp p-7 flex flex-col min-h-[460px]">
        <div className="flex-1">

          {/* STEP 1: Ruta profesional */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Tipo de crecimiento</p>
                <div className="flex gap-3">
                  {[
                    { val: 'vertical', label: 'Crecimiento vertical', desc: 'Ascender dentro de tu área actual', icon: TrendingUp },
                    { val: 'lateral',  label: 'Movimiento lateral',   desc: 'Explorar un área o rol diferente',  icon: ArrowLeftRight },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => { set('growthType', opt.val); handleRouteChange('') }}
                      className={`flex-1 flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${form.growthType === opt.val ? 'border-h-500 bg-h-50' : 'border-n-200 hover:border-n-300'}`}
                    >
                      <opt.icon size={20} className={`shrink-0 mt-0.5 ${form.growthType === opt.val ? 'text-h-600' : 'text-n-500'}`} />
                      <div>
                        <p className={`text-[13px] font-semibold ${form.growthType === opt.val ? 'text-h-700' : 'text-n-950'}`}>{opt.label}</p>
                        <p className="text-[11px] text-n-600 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Ruta profesional</label>
                  <div className="relative">
                    <select
                      className="input-humand w-full appearance-none pr-8"
                      value={form.route}
                      onChange={e => handleRouteChange(e.target.value)}
                    >
                      <option value="">Seleccionar ruta…</option>
                      {routes.map(r => (
                        <option key={r.value} value={r.value}>{r.label} · {r.level}</option>
                      ))}
                    </select>
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-n-400 pointer-events-none text-[11px]">▾</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Duración estimada</label>
                  <div className="relative">
                    <select
                      className="input-humand w-full appearance-none pr-8"
                      value={form.duration}
                      onChange={e => set('duration', e.target.value)}
                    >
                      <option value="">Seleccionar duración…</option>
                      {['6 meses', '1 año', '1.5 años', '2 años', '2.5 años', '3 años'].map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-n-400 pointer-events-none text-[11px]">▾</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Manager / Líder directo</label>
                <div className="relative">
                  <select
                    className="input-humand w-full appearance-none pr-8"
                    value={form.manager}
                    onChange={e => set('manager', e.target.value)}
                  >
                    <option value="">Seleccionar manager…</option>
                    {managers.map(m => (
                      <option key={m.value} value={m.value}>{m.label} · {m.role}</option>
                    ))}
                  </select>
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-n-400 pointer-events-none text-[11px]">▾</span>
                </div>
                {selectedManager && (
                  <p className="text-[11px] text-n-500 mt-1.5">
                    Se le notificará a <span className="font-semibold text-n-700">{selectedManager.label}</span> para revisar y aprobar tu plan.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">
                  Descripción <span className="normal-case font-normal text-n-400">(opcional)</span>
                </label>
                <textarea
                  className="textarea-humand w-full"
                  rows={3}
                  placeholder="¿Por qué querés alcanzar este rol? ¿Qué te motiva a dar este paso?"
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Habilidades */}
          {step === 2 && (() => {
            // Combine predefined + any existing plan skills (no duplicates)
            const allHardSkills = [...new Set([...predefinedSkills, ...form.skills])]
            const allSoftSkills = [...new Set([...SOFT_SKILLS, ...form.softSkills])]
            return (
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">Habilidades técnicas requeridas</p>
                  {selectedRoute && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-h-100 text-h-800">{selectedRoute.label}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {allHardSkills.map(skill => {
                    const sel = form.skills.includes(skill)
                    return (
                      <button key={skill} onClick={() => toggleSkill(skill)}
                        className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all ${sel ? 'bg-h-500 text-white border-h-500' : 'bg-white text-n-700 border-n-200 hover:border-h-400'}`}
                      >
                        {sel && <Check size={12} className="inline mr-1" />}{skill}
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-2 mt-3">
                  <input className="input-humand flex-1" placeholder="Agregar hard skill personalizada…"
                    value={form.customSkillInput} onChange={e => set('customSkillInput', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCustomSkill()} />
                  <button onClick={addCustomSkill} className="h-9 px-4 bg-n-100 hover:bg-n-200 text-n-950 rounded-lg text-[13px] font-semibold transition-colors">+ Agregar</button>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Soft skills</p>
                <div className="flex flex-wrap gap-2">
                  {allSoftSkills.map(skill => {
                    const sel = form.softSkills.includes(skill)
                    return (
                      <button key={skill} onClick={() => toggleSoftSkill(skill)}
                        className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all ${sel ? 'bg-t-500 text-white border-t-500' : 'bg-white text-n-700 border-n-200 hover:border-t-400'}`}
                      >
                        {sel && <Check size={12} className="inline mr-1" />}{skill}
                      </button>
                    )
                  })}
                </div>
                <div className="flex gap-2 mt-3">
                  <input className="input-humand flex-1" placeholder="Agregar soft skill personalizada…"
                    value={form.softSkillInput} onChange={e => set('softSkillInput', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addSoftSkill()} />
                  <button onClick={addSoftSkill} className="h-9 px-4 bg-n-100 hover:bg-n-200 text-n-950 rounded-lg text-[13px] font-semibold transition-colors">+ Agregar</button>
                </div>
              </div>

              {(form.skills.length > 0 || form.softSkills.length > 0) && (
                <div className="flex gap-3">
                  {form.skills.length > 0 && (
                    <div className="flex-1 bg-h-50 rounded-xl p-3">
                      <p className="text-[10px] font-semibold text-h-700 uppercase tracking-widest mb-2">Hard ({form.skills.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.skills.map(s => (
                          <span key={s} className="flex items-center gap-1 text-[11px] font-medium bg-white text-h-800 border border-h-200 px-2 py-1 rounded-lg">
                            {s} <button onClick={() => toggleSkill(s)} className="text-h-400 hover:text-r-600 leading-none">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {form.softSkills.length > 0 && (
                    <div className="flex-1 bg-t-50 rounded-xl p-3">
                      <p className="text-[10px] font-semibold text-t-700 uppercase tracking-widest mb-2">Soft ({form.softSkills.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.softSkills.map(s => (
                          <span key={s} className="flex items-center gap-1 text-[11px] font-medium bg-white text-t-800 border border-t-200 px-2 py-1 rounded-lg">
                            {s} <button onClick={() => toggleSoftSkill(s)} className="text-t-400 hover:text-r-600 leading-none">×</button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            )})()}

          {/* STEP 3: Objetivos */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">Objetivos de desarrollo</p>
                  <p className="text-[11px] text-n-500 mt-0.5">Sugeridos según tu ruta — editá, eliminá o agregá los tuyos</p>
                </div>
                <span className="text-[11px] text-n-500">{form.objectives.length} objetivos</span>
              </div>

              <div className="flex flex-col gap-2">
                {['short', 'medium', 'long'].map(term => {
                  const items = form.objectives.filter(o => o.term === term)
                  if (items.length === 0) return null
                  const cfg = TERM_CONFIG[term]
                  return (
                    <div key={term}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                        <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">{cfg.label}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 pl-3.5">
                        {items.map(obj => (
                          <div key={obj.id} className={`flex items-center gap-3 p-3 rounded-xl border ${form.editingObjId === obj.id ? 'border-h-400 bg-h-50' : 'border-n-200 bg-n-50'}`}>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                            <p className="text-[12px] text-n-950 flex-1">{obj.text}</p>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => startEditObj(obj)} className="text-[11px] text-n-500 hover:text-h-600 font-medium">Editar</button>
                              <button onClick={() => deleteObj(obj.id)} className="text-[11px] text-n-400 hover:text-r-600 font-medium">✕</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {form.objectives.length === 0 && (
                  <p className="text-[12px] text-n-500 text-center py-4">Aún no hay objetivos — agregá al menos uno</p>
                )}
              </div>

              <div className="bg-n-50 rounded-xl p-4 flex flex-col gap-3">
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">
                  {form.editingObjId ? 'Editar objetivo' : 'Agregar objetivo'}
                </p>
                <div className="flex gap-2">
                  <div className="relative shrink-0">
                    <select
                      className="input-humand appearance-none pr-7 text-[12px]"
                      value={form.objTerm}
                      onChange={e => set('objTerm', e.target.value)}
                    >
                      <option value="short">Corto plazo</option>
                      <option value="medium">Mediano plazo</option>
                      <option value="long">Largo plazo</option>
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-n-400 pointer-events-none text-[10px]">▾</span>
                  </div>
                  <input
                    className="input-humand flex-1"
                    placeholder="Describí el objetivo…"
                    value={form.objInput}
                    onChange={e => set('objInput', e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addObjective()}
                  />
                  <button onClick={addObjective} className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors shrink-0">
                    {form.editingObjId ? 'Guardar' : '+ Agregar'}
                  </button>
                </div>
                {form.editingObjId && (
                  <button onClick={() => { set('editingObjId', null); set('objInput', ''); set('objTerm', 'short') }}
                    className="text-[11px] text-n-500 hover:text-n-800 text-left">✕ Cancelar edición</button>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Aprendizaje */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">Cursos disponibles en Humand</p>
                  <p className="text-[11px] text-n-500 mt-0.5">Ordenados por prioridad según tu ruta</p>
                </div>
                <span className="text-[11px] text-n-500">{form.selectedCourses.length} seleccionados</span>
              </div>

              <div className="flex gap-3">
                {Object.entries(PRIORITY_CONFIG).map(([p, cfg]) => (
                  <div key={p} className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>{cfg.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2.5">
                {suggestedCourses.map(course => {
                  const sel   = form.selectedCourses.includes(course.id)
                  const pcfg  = PRIORITY_CONFIG[course.priority] || PRIORITY_CONFIG[3]
                  return (
                    <button
                      key={course.id}
                      onClick={() => toggleCourse(course.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${sel ? 'border-h-500 bg-h-50' : 'border-n-200 hover:border-n-300 bg-white'}`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-4dp flex items-center justify-center shrink-0"><CourseIcon type={course.type} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{course.type}</p>
                        <p className="text-[13px] font-semibold text-n-950 mt-0.5">{course.title}</p>
                        <p className="text-[11px] text-n-600 mt-0.5">{course.provider} · {course.duration}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pcfg.badge}`}>{pcfg.label}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${sel ? 'bg-h-500 border-h-500' : 'border-n-300'}`}>
                          {sel && <Check size={10} className="text-white" />}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Revisión */}
          {step === 5 && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-h-50 border border-h-200 px-5 py-4 flex items-start gap-3">
                <span className="text-xl shrink-0">🎉</span>
                <div>
                  <p className="text-[13px] font-semibold text-n-950">Todo listo — revisá tu plan antes de enviarlo</p>
                  <p className="text-[12px] text-n-600 mt-0.5">
                    Se le notificará a <span className="font-semibold">{selectedManager?.label || 'tu manager'}</span> para revisarlo y aprobarlo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-n-50 rounded-xl p-4">
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Ruta profesional</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${form.growthType === 'vertical' ? 'bg-h-100 text-h-800' : 'bg-p-100 text-p-800'}`}>
                    {form.growthType === 'vertical' ? 'Vertical' : 'Lateral'}
                  </span>
                  <p className="text-[14px] font-bold text-n-950 mt-2">{selectedRoute?.label || '—'}</p>
                  <p className="text-[12px] text-n-600 mt-0.5">Duración: {form.duration || '—'}</p>
                  {selectedManager && (
                    <p className="text-[11px] text-n-600 mt-0.5">Manager: <span className="font-semibold">{selectedManager.label}</span></p>
                  )}
                  {form.description && <p className="text-[11px] text-n-500 mt-2 leading-relaxed italic">"{form.description}"</p>}
                </div>

                <div className="bg-n-50 rounded-xl p-4">
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Objetivos ({form.objectives.length})</p>
                  <div className="flex flex-col gap-1.5">
                    {['short', 'medium', 'long'].map(term => {
                      const items = form.objectives.filter(o => o.term === term)
                      if (!items.length) return null
                      const cfg = TERM_CONFIG[term]
                      return items.map(obj => (
                        <div key={obj.id} className="flex items-start gap-2">
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${cfg.badge}`}>{cfg.label.split(' ')[0]}</span>
                          <p className="text-[11px] text-n-800 leading-tight">{obj.text}</p>
                        </div>
                      ))
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-n-50 rounded-xl p-4">
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">
                  Skills ({form.skills.length + form.softSkills.length})
                </p>
                <div className="flex flex-col gap-2">
                  {form.skills.length > 0 && (
                    <div>
                      <p className="text-[10px] text-n-500 mb-1.5">Hard skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.skills.map(s => <span key={s} className="text-[11px] font-medium bg-white border border-h-200 text-h-800 px-2.5 py-1 rounded-lg">{s}</span>)}
                      </div>
                    </div>
                  )}
                  {form.softSkills.length > 0 && (
                    <div>
                      <p className="text-[10px] text-n-500 mb-1.5">Soft skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {form.softSkills.map(s => <span key={s} className="text-[11px] font-medium bg-white border border-t-200 text-t-800 px-2.5 py-1 rounded-lg">{s}</span>)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {form.selectedCourses.length > 0 && (
                <div className="bg-n-50 rounded-xl p-4">
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Cursos ({form.selectedCourses.length})</p>
                  <div className="flex flex-col gap-1.5">
                    {suggestedCourses.filter(c => form.selectedCourses.includes(c.id)).map(c => {
                      const pcfg = PRIORITY_CONFIG[c.priority] || PRIORITY_CONFIG[3]
                      return (
                        <div key={c.id} className="flex items-center gap-2">
                          <span className="text-sm">{c.emoji}</span>
                          <p className="text-[12px] text-n-800 flex-1">{c.title}</p>
                          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${pcfg.badge}`}>{pcfg.label}</span>
                          <span className="text-[11px] text-n-500">{c.duration}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-7 pt-5 border-t border-n-100">
          <button
            onClick={() => step > 1 ? setStep(s => s - 1) : onCancel()}
            className="h-9 px-5 bg-white border border-n-200 text-n-700 rounded-lg text-[13px] font-medium hover:bg-n-50 transition-colors"
          >
            {step === 1 ? 'Cancelar' : '← Anterior'}
          </button>

          <div className="flex items-center gap-1.5">
            {WIZARD_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 === step ? 'bg-h-500 w-4' : i < step ? 'bg-h-300 w-1.5' : 'bg-n-200 w-1.5'}`}
              />
            ))}
          </div>

          {step < 5 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              className="h-9 px-5 bg-h-500 hover:bg-h-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-[13px] font-semibold transition-colors"
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={() => onComplete({ ...form, routeLabel: selectedRoute?.label || form.route })}
              className="h-9 px-5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors"
            >
              <span className="flex items-center gap-1.5">{isEdit ? 'Reenviar plan' : 'Enviar plan'} <Check size={14} /></span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
