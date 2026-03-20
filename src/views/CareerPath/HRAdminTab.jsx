import { useState, useEffect, useMemo } from 'react'
import { X, Plus, Check, ChevronDown, ChevronRight, Map, TrendingUp, CheckCircle, RotateCw, Award, Users, Heart } from 'lucide-react'
import { CourseIcon } from './shared'
import SaludOrganizacional from './SaludOrganizacional'
import MetricasImpacto from './MetricasImpacto'
import NewCareerPathWizard from './NewCareerPathWizard'
import { careerPathsApi } from '../../api/careerPaths'
import { hrMetricsApi } from '../../api/hrMetrics'

const DEPT_CONFIG = {
  'DESIGN': { dept: 'Diseño', deptColor: '#496be3', deptBg: 'bg-h-50' },
  'ENGINEERING': { dept: 'Ingeniería', deptColor: '#35a48e', deptBg: 'bg-t-50' },
  'PRODUCT': { dept: 'Producto', deptColor: '#886bff', deptBg: 'bg-p-50' },
  'MARKETING': { dept: 'Marketing', deptColor: '#e3498b', deptBg: 'bg-r-50' },
  'PEOPLE': { dept: 'People', deptColor: '#de920c', deptBg: 'bg-y-50' },
  'SALES': { dept: 'Ventas', deptColor: '#d42e2e', deptBg: 'bg-r-50' },
}

export default function HRAdminTab() {
  const [careerPaths, setCareerPaths] = useState([])
  const [stats, setStats] = useState({ totalPaths: 0, activePlans: 0, pendingReview: 0, readyForPromotion: 0 })
  const [loading, setLoading] = useState(true)

  const [selectedPath, setSelectedPath] = useState(null)
  const [section, setSection] = useState('paths')
  const [hasChanges, setHasChanges] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [savedPaths, setSavedPaths] = useState([])
  const [successPath, setSuccessPath] = useState(null)
  const [pathData, setPathData] = useState({})
  const [addSkillInput, setAddSkillInput] = useState('')
  const [addSoftSkillInput, setAddSoftSkillInput] = useState('')
  const [addObjInput, setAddObjInput] = useState('')
  const [addObjTerm, setAddObjTerm] = useState('short')
  const [addCourseInput, setAddCourseInput] = useState('')
  const [addCourseType, setAddCourseType] = useState('Curso')
  const [addCourseProvider, setAddCourseProvider] = useState('')
  const [addCourseDuration, setAddCourseDuration] = useState('')
  const [addCoursePriority, setAddCoursePriority] = useState(2)
  const [showAllRoles, setShowAllRoles] = useState(false)

  useEffect(() => {
    Promise.all([
      careerPathsApi.getAll(),
      hrMetricsApi.getStats(),
    ]).then(([paths, statsData]) => {
      setCareerPaths(paths)
      setStats(statsData)
      setLoading(false)
    }).catch(err => { console.error(err); setLoading(false) })
  }, [])

  // Populate pathData from API data
  useEffect(() => {
    const data = {}
    careerPaths.forEach(p => {
      data[p._id] = {
        skills: p.requiredSkills || [],
        softSkills: p.softSkills || [],
        suggestedObjectives: p.suggestedObjectives || [],
        suggestedCourses: p.suggestedCourses || [],
        minExp: p.minExperience || '',
        perf: p.performanceThreshold || '',
        approval: p.approvalRequired || '',
      }
    })
    setPathData(data)
    // Select the first path if none selected
    if (!selectedPath && careerPaths.length > 0) {
      setSelectedPath(careerPaths[0]._id)
    }
  }, [careerPaths])

  const HR_STATS_DISPLAY = [
    { icon: Map,         value: String(stats.totalPaths),        label: 'Rutas de carrera definidas', color: 'text-h-500'  },
    { icon: CheckCircle, value: String(stats.activePlans),       label: 'Empleados con plan activo',  color: 'text-g-600'  },
    { icon: RotateCw,    value: String(stats.pendingReview),     label: 'Planes en revisión',         color: 'text-y-600'  },
    { icon: Award,       value: String(stats.readyForPromotion), label: 'Listos para promoción',      color: 'text-p-600'  },
  ]

  // Derive grouped paths from flat array
  const groupedPaths = useMemo(() => {
    const groups = {}
    careerPaths.forEach(p => {
      const dept = p.area?.toUpperCase() || p.department || 'OTHER'
      if (!groups[dept]) groups[dept] = []
      groups[dept].push({
        id: p._id,
        label: p.name,
        level: p.level,
        count: p.headcount || 0,
        dot: p.dot || '#496be3',
        desc: p.description || '',
      })
    })
    return Object.entries(groups).map(([section, items]) => ({
      section,
      ...(DEPT_CONFIG[section] || { dept: section, deptColor: '#496be3', deptBg: 'bg-n-50' }),
      items,
    }))
  }, [careerPaths])

  const selectPath = (id) => { setSelectedPath(id); setHasChanges(false); setAddSkillInput('') }

  const curData = pathData[selectedPath] || { skills: [], softSkills: [], suggestedObjectives: [], suggestedCourses: [], minExp: '', perf: '', approval: '' }

  const updateField = (field, value) => {
    setPathData(prev => ({ ...prev, [selectedPath]: { ...prev[selectedPath], [field]: value } }))
    setHasChanges(true)
  }
  const removeSkill = (s) => updateField('skills', curData.skills.filter(x => x !== s))
  const addSkill = (s) => {
    const t = s.trim()
    if (t && !curData.skills.includes(t)) updateField('skills', [...curData.skills, t])
    setAddSkillInput('')
  }

  const handleSave = async () => {
    try {
      await careerPathsApi.update(selectedPath, {
        requiredSkills: curData.skills,
        softSkills: curData.softSkills,
        suggestedObjectives: curData.suggestedObjectives,
        suggestedCourses: curData.suggestedCourses,
        minExperience: curData.minExp,
        approvalRequired: curData.approval,
      })
      setHasChanges(false)
    } catch (err) {
      console.error('Error saving career path:', err)
    }
  }

  const allPathItems = groupedPaths.flatMap(g => g.items.map(i => ({ ...i, section: g.section })))
  const selectedPathItem = allPathItems.find(i => i.id === selectedPath)
  const filteredPathItems = groupedPaths.map(group => ({
    ...group,
    items: group.items.filter(i =>
      i.label.toLowerCase().includes(search.toLowerCase()) ||
      group.section.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(g => g.items.length > 0)

  const SUB_TABS = [
    { id: 'paths',      label: 'Roles',        icon: Users         },
    { id: 'salud',      label: 'Salud Org.',   icon: Heart        },
    { id: 'metricas',   label: 'Métricas',     icon: TrendingUp   },
  ]

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-h-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-[13px] text-n-600">Cargando datos...</p>
      </div>
    </div>
  )

  if (showAllRoles) return (
    <div className="flex flex-col gap-6 animate-slide-in">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowAllRoles(false)}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-n-200 bg-white hover:bg-n-50 transition-colors shrink-0"
        >
          <ChevronDown size={16} className="text-n-700 rotate-90" />
        </button>
        <div>
          <p className="text-[15px] font-bold text-n-950">Todos los roles</p>
          <p className="text-[12px] text-n-600">Roles disponibles en la organización, organizados por departamento</p>
        </div>
      </div>

      {groupedPaths.map(group => (
        <div key={group.section}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: group.deptColor }} />
            <p className="text-[11px] font-bold text-n-500 uppercase tracking-widest">{group.dept}</p>
            <div className="flex-1 h-px bg-n-100" />
            <span className="text-[10px] text-n-400">{group.items.length} roles</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {group.items.map(item => (
              <button
                key={item.id}
                onClick={() => { selectPath(item.id); setShowAllRoles(false) }}
                className="bg-white rounded-xl shadow-4dp p-4 text-left hover:shadow-8dp transition-shadow flex flex-col gap-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: item.dot }} />
                    <p className="text-[13px] font-bold text-n-950 group-hover:text-h-600 transition-colors">{item.label}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-n-100 text-n-600 shrink-0">{item.level}</span>
                </div>
                <p className="text-[11px] text-n-600 leading-relaxed pl-4">{item.desc}</p>
                <p className="text-[10px] text-n-400 pl-4">{item.count} personas en este rol</p>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {HR_STATS_DISPLAY.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4 flex items-center gap-3">
            <s.icon size={22} className={s.color} />
            <div>
              <p className="text-xl font-bold text-n-950">{s.value}</p>
              <p className="text-[11px] text-n-600">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1 bg-n-100 p-1 rounded-xl overflow-x-auto scrollbar-thin">
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)}
            className={`h-8 px-3 rounded-lg text-[12px] whitespace-nowrap transition-all flex items-center gap-1.5 ${section === t.id ? 'bg-white shadow-4dp text-h-500 font-semibold' : 'text-n-600 hover:text-n-950'}`}>
            <t.icon size={13} />{t.label}
          </button>
        ))}
      </div>

      {section === 'paths' && (
        <>
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-n-600">Seleccionar rol</p>
          <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <div
              className="flex items-center gap-3 h-10 px-3 bg-white border border-n-200 rounded-xl shadow-4dp cursor-pointer"
              onClick={() => setSearchOpen(o => !o)}
            >
              {selectedPathItem && <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: selectedPathItem.dot }} />}
              <input
                className="flex-1 text-[13px] text-n-950 bg-transparent outline-none placeholder:text-n-400"
                placeholder="Buscar career path..."
                value={searchOpen ? search : (selectedPathItem?.label || '')}
                onChange={e => { setSearch(e.target.value); setSearchOpen(true) }}
                onClick={e => { e.stopPropagation(); setSearchOpen(true); setSearch('') }}
              />
              <ChevronDown size={14} className="text-n-400" />
            </div>
            {searchOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => { setSearchOpen(false); setSearch('') }} />
                <div className="absolute top-11 left-0 right-0 bg-white border border-n-200 rounded-xl shadow-8dp z-20 overflow-hidden max-h-72 overflow-y-auto">
                  {filteredPathItems.map(group => (
                    <div key={group.section}>
                      <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest px-3 pt-3 pb-1">{group.section}</p>
                      {group.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => { selectPath(item.id); setSearchOpen(false); setSearch('') }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-n-50 ${selectedPath === item.id ? 'bg-p-50' : ''}`}
                        >
                          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.dot }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-n-950">{item.label}</p>
                            <p className="text-[11px] text-n-600">{item.level}</p>
                          </div>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-n-100 text-n-600 shrink-0">{item.count}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                  {filteredPathItems.length === 0 && (
                    <p className="text-[12px] text-n-500 text-center py-4">Sin resultados</p>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setShowAllRoles(true)}
            className="text-[13px] font-semibold text-h-500 hover:text-h-700 transition-colors shrink-0"
          >
            Ver todos
          </button>
        </div>
        </div>
        {selectedPathItem && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-n-950 leading-snug">{selectedPathItem.label}</p>
              <p className="text-[11px] text-n-600 mt-0.5">{selectedPathItem.section} · {selectedPathItem.level} · {selectedPathItem.count} empleados</p>
            </div>
            <button
              disabled={!hasChanges}
              onClick={handleSave}
              className="h-9 px-4 border rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-white border-h-400 text-h-600 hover:bg-h-50"
            >Guardar cambios</button>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-2xl shadow-4dp p-5">
              <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Skills requeridas</p>
              <div className="flex flex-wrap gap-2">
                {curData.skills.map(s => (
                  <div key={s} className="flex items-center gap-1 bg-h-50 text-h-800 text-[12px] font-medium px-2.5 py-1 rounded-lg">
                    {s}
                    <button onClick={() => removeSkill(s)} className="text-h-400 hover:text-r-600 ml-1 leading-none"><X size={10} /></button>
                  </div>
                ))}
                <input
                  className="h-7 px-2 text-[12px] border border-n-200 rounded-lg outline-none focus:border-h-400 w-28 placeholder:text-n-400"
                  placeholder="+ Agregar..."
                  value={addSkillInput}
                  onChange={e => setAddSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(addSkillInput) } }}
                />
              </div>
            </div>

            {/* Soft Skills */}
            <div className="bg-white rounded-2xl shadow-4dp p-5">
              <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Soft skills</p>
              <div className="flex flex-wrap gap-2">
                {(curData.softSkills || []).map(s => (
                  <div key={s} className="flex items-center gap-1 bg-t-50 text-t-800 text-[12px] font-medium px-2.5 py-1 rounded-lg">
                    {s}
                    <button onClick={() => { updateField('softSkills', curData.softSkills.filter(x => x !== s)) }} className="text-t-400 hover:text-r-600 ml-1 leading-none"><X size={10} /></button>
                  </div>
                ))}
                <input
                  className="h-7 px-2 text-[12px] border border-n-200 rounded-lg outline-none focus:border-t-400 w-28 placeholder:text-n-400"
                  placeholder="+ Agregar..."
                  value={addSoftSkillInput}
                  onChange={e => setAddSoftSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const t = addSoftSkillInput.trim(); if (t && !curData.softSkills.includes(t)) { updateField('softSkills', [...curData.softSkills, t]); setAddSoftSkillInput('') } } }}
                />
              </div>
            </div>

            {/* Objetivos sugeridos */}
            <div className="bg-white rounded-2xl shadow-4dp p-5">
              <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Objetivos sugeridos</p>
              <div className="flex flex-col gap-1.5 mb-3">
                {(curData.suggestedObjectives || []).map((obj, i) => {
                  const termCfg = { short: 'bg-g-100 text-g-800', medium: 'bg-y-100 text-y-700', long: 'bg-p-100 text-p-800' }
                  const termLabel = { short: 'Corto', medium: 'Mediano', long: 'Largo' }
                  return (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-n-50 group">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${termCfg[obj.term] || 'bg-n-100 text-n-600'}`}>{termLabel[obj.term] || obj.term}</span>
                      <p className="text-[12px] text-n-950 flex-1">{obj.text}</p>
                      <button onClick={() => updateField('suggestedObjectives', curData.suggestedObjectives.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 text-n-400 hover:text-r-600 shrink-0"><X size={12} /></button>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center gap-2">
                <select className="h-8 px-2 text-[11px] border border-n-200 rounded-lg outline-none focus:border-h-400 bg-white shrink-0" value={addObjTerm} onChange={e => setAddObjTerm(e.target.value)}>
                  <option value="short">Corto</option>
                  <option value="medium">Mediano</option>
                  <option value="long">Largo</option>
                </select>
                <input
                  className="flex-1 h-8 px-2.5 text-[12px] border border-n-200 rounded-lg outline-none focus:border-h-400 placeholder:text-n-400"
                  placeholder="Nuevo objetivo sugerido..."
                  value={addObjInput}
                  onChange={e => setAddObjInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); const t = addObjInput.trim(); if (t) { updateField('suggestedObjectives', [...(curData.suggestedObjectives || []), { text: t, term: addObjTerm }]); setAddObjInput('') } } }}
                />
                <button onClick={() => { const t = addObjInput.trim(); if (t) { updateField('suggestedObjectives', [...(curData.suggestedObjectives || []), { text: t, term: addObjTerm }]); setAddObjInput('') } }} className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0"><Plus size={13} /></button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-4dp p-5">
              <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Requisitos del rol</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className="text-[11px] text-n-600 mb-1">Experiencia mínima</p>
                  <input className="input-humand w-full" value={curData.minExp} onChange={e => updateField('minExp', e.target.value)} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-n-600 mb-1">Aprobación requerida</p>
                  <select className="input-humand w-full" value={curData.approval} onChange={e => updateField('approval', e.target.value)}>
                    <option>Manager</option>
                    <option>Manager + HR</option>
                    <option>HR solamente</option>
                    <option>Automática</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cursos sugeridos */}
            <div className="bg-white rounded-2xl shadow-4dp p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">Cursos sugeridos</p>
                <span className="text-[11px] text-n-500">{(curData.suggestedCourses || []).length} cursos</span>
              </div>
              <div className="flex flex-col gap-2.5 mb-3">
                {(curData.suggestedCourses || []).map((c, i) => {
                  const pCfg = { 1: { label: 'Esencial', cls: 'bg-g-100 text-g-700' }, 2: { label: 'Recomendado', cls: 'bg-h-100 text-h-800' }, 3: { label: 'Opcional', cls: 'bg-p-100 text-p-700' } }
                  const pcfg = pCfg[c.priority] || pCfg[2]
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-n-50 group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-4dp flex items-center justify-center shrink-0"><CourseIcon type={c.type} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{c.type || 'Curso'}</p>
                        <p className="text-[13px] font-semibold text-n-950 mt-0.5">{c.name}</p>
                        <p className="text-[11px] text-n-600">{c.provider || ''}{c.duration ? ` · ${c.duration}` : ''}</p>
                      </div>
                      <select className="h-7 px-1.5 text-[10px] border border-n-200 rounded-lg outline-none bg-white shrink-0" value={c.priority} onChange={e => { const updated = [...curData.suggestedCourses]; updated[i] = { ...c, priority: Number(e.target.value) }; updateField('suggestedCourses', updated) }}>
                        <option value={1}>Esencial</option>
                        <option value={2}>Recomendado</option>
                        <option value={3}>Opcional</option>
                      </select>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${pcfg.cls}`}>{pcfg.label}</span>
                      <button onClick={() => updateField('suggestedCourses', curData.suggestedCourses.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-100 text-n-400 hover:text-r-600 shrink-0"><X size={13} /></button>
                    </div>
                  )
                })}
              </div>
              <div className="bg-n-50 rounded-xl p-3 flex flex-col gap-2">
                <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">Agregar curso</p>
                <div className="flex items-center gap-2">
                  <input className="flex-1 h-8 px-2.5 text-[12px] border border-n-200 rounded-lg outline-none focus:border-h-400 placeholder:text-n-400 bg-white" placeholder="Nombre del curso..." value={addCourseInput} onChange={e => setAddCourseInput(e.target.value)} />
                  <select className="h-8 px-2 text-[11px] border border-n-200 rounded-lg outline-none bg-white shrink-0" value={addCourseType} onChange={e => setAddCourseType(e.target.value)}>
                    <option value="Curso">Curso</option>
                    <option value="Certificación">Certificación</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                  <select className="h-8 px-2 text-[11px] border border-n-200 rounded-lg outline-none bg-white shrink-0" value={addCoursePriority} onChange={e => setAddCoursePriority(Number(e.target.value))}>
                    <option value={1}>Esencial</option>
                    <option value={2}>Recomendado</option>
                    <option value={3}>Opcional</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input className="flex-1 h-8 px-2.5 text-[12px] border border-n-200 rounded-lg outline-none focus:border-h-400 placeholder:text-n-400 bg-white" placeholder="Provider..." value={addCourseProvider} onChange={e => setAddCourseProvider(e.target.value)} />
                  <input className="w-20 h-8 px-2.5 text-[12px] border border-n-200 rounded-lg outline-none focus:border-h-400 placeholder:text-n-400 bg-white" placeholder="Duración" value={addCourseDuration} onChange={e => setAddCourseDuration(e.target.value)} />
                  <button onClick={() => { const t = addCourseInput.trim(); if (t) { updateField('suggestedCourses', [...(curData.suggestedCourses || []), { name: t, type: addCourseType, provider: addCourseProvider, duration: addCourseDuration, priority: addCoursePriority }]); setAddCourseInput(''); setAddCourseProvider(''); setAddCourseDuration('') } }} className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0"><Plus size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {savedPaths.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">Creados recientemente</p>
            {savedPaths.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-4dp px-5 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-[13px] shrink-0" style={{ borderColor: p.dot, color: p.dot }}>
                  {p.level}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-n-950">{p.name}</p>
                  <p className="text-[12px] text-n-600">{p.area} · {p.level}</p>
                  {p.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.skills.slice(0, 5).map(s => (
                        <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-h-50 text-h-800">{s}</span>
                      ))}
                      {p.skills.length > 5 && <span className="text-[10px] text-n-500">+{p.skills.length - 5}</span>}
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-g-100 text-g-800 shrink-0">Activo</span>
              </div>
            ))}
          </div>
        )}
        </>
      )}

      {section === 'salud' && <SaludOrganizacional />}
      {section === 'metricas' && <MetricasImpacto />}

      {showWizard && (
        <NewCareerPathWizard
          onClose={() => setShowWizard(false)}
          onSave={async (data) => {
            try {
              const created = await careerPathsApi.create(data)
              setSavedPaths(prev => [...prev, { ...data, id: created._id || Date.now() }])
              setShowWizard(false)
              setSuccessPath(data)
              setTimeout(() => setSuccessPath(null), 4000)
              // Refetch career paths
              const paths = await careerPathsApi.getAll()
              setCareerPaths(paths)
            } catch (err) {
              console.error('Error creating career path:', err)
            }
          }}
        />
      )}

      {successPath && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-n-950 text-white px-5 py-3.5 rounded-2xl shadow-8dp animate-fade-in">
          <div className="w-6 h-6 rounded-full bg-g-500 flex items-center justify-center shrink-0">
            <Check size={13} className="text-white" />
          </div>
          <p className="text-[13px] font-semibold">Career path <span className="text-g-400">"{successPath.name}"</span> creado con éxito</p>
          <button onClick={() => setSuccessPath(null)} className="ml-2 text-n-400 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
