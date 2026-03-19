import { useState } from 'react'
import { X, Plus, Check, ChevronDown, ChevronRight, Map, TrendingUp, CheckCircle, RotateCw, Award, Users, Heart } from 'lucide-react'
import CompetencyBuilder from './CompetencyBuilder'
import SaludOrganizacional from './SaludOrganizacional'
import MetricasImpacto from './MetricasImpacto'
import NewCareerPathWizard from './NewCareerPathWizard'

const HR_STATS = [
  { icon: Map,         value: '12', label: 'Rutas de carrera definidas', color: 'text-h-500'  },
  { icon: CheckCircle, value: '38', label: 'Empleados con plan activo',  color: 'text-g-600'  },
  { icon: RotateCw,    value: '7',  label: 'Planes en revisión',         color: 'text-y-600'  },
  { icon: Award,       value: '4',  label: 'Listos para promoción',      color: 'text-p-600'  },
]

const CAREER_PATHS = [
  {
    section: 'DESIGN', dept: 'Diseño', deptColor: '#496be3', deptBg: 'bg-h-50',
    items: [
      { id: 'jd', label: 'Junior Designer',    level: 'Nivel 1', count: 6,  dot: '#c5d4f8', desc: 'Aprendizaje y ejecución de tareas de diseño con supervisión.' },
      { id: 'pd', label: 'Product Designer',   level: 'Nivel 2', count: 14, dot: '#9db8f3', desc: 'Diseño de flujos y componentes con autonomía creciente.' },
      { id: 'sd', label: 'Senior Designer',    level: 'Nivel 3', count: 8,  dot: '#496be3', desc: 'Referente técnico de diseño y mentor del equipo.' },
      { id: 'dl', label: 'Design Lead',        level: 'Nivel 4', count: 3,  dot: '#29317f', desc: 'Liderazgo del equipo de diseño y visión estratégica.' },
    ],
  },
  {
    section: 'ENGINEERING', dept: 'Ingeniería', deptColor: '#35a48e', deptBg: 'bg-t-50',
    items: [
      { id: 'je', label: 'Junior Engineer',    level: 'Nivel 1', count: 9,  dot: '#a8ddd5', desc: 'Desarrollo de tareas técnicas bajo supervisión directa.' },
      { id: 'mie', label: 'Mid Engineer',      level: 'Nivel 2', count: 15, dot: '#6bc4b5', desc: 'Desarrollo autónomo de features de mediana complejidad.' },
      { id: 'se', label: 'Senior Engineer',    level: 'Nivel 3', count: 12, dot: '#35a48e', desc: 'Referente técnico, define estándares y revisa código.' },
      { id: 'le', label: 'Lead Engineer',      level: 'Nivel 4', count: 5,  dot: '#1f5049', desc: 'Liderazgo técnico del equipo e impacto cross-funcional.' },
    ],
  },
  {
    section: 'PRODUCT', dept: 'Producto', deptColor: '#886bff', deptBg: 'bg-p-50',
    items: [
      { id: 'apm', label: 'Associate PM',      level: 'Nivel 2', count: 4,  dot: '#c5b8ff', desc: 'Soporte en la definición y seguimiento de producto.' },
      { id: 'pm',  label: 'Product Manager',   level: 'Nivel 3', count: 7,  dot: '#886bff', desc: 'Ownership de producto, roadmap y stakeholders.' },
      { id: 'spm', label: 'Senior PM',         level: 'Nivel 4', count: 3,  dot: '#5a3fd4', desc: 'Visión estratégica de producto y liderazgo de área.' },
    ],
  },
  {
    section: 'MARKETING', dept: 'Marketing', deptColor: '#e3498b', deptBg: 'bg-r-50',
    items: [
      { id: 'mc',  label: 'Marketing Coordinator', level: 'Nivel 1', count: 5, dot: '#f4a8c9', desc: 'Ejecución de campañas y apoyo en estrategia de marca.' },
      { id: 'ms',  label: 'Marketing Specialist',  level: 'Nivel 2', count: 8, dot: '#e3498b', desc: 'Gestión de canales, análisis de métricas y campañas.' },
      { id: 'ml',  label: 'Marketing Lead',         level: 'Nivel 3', count: 3, dot: '#a0205f', desc: 'Estrategia de marketing y liderazgo del equipo.' },
    ],
  },
  {
    section: 'PEOPLE', dept: 'People', deptColor: '#de920c', deptBg: 'bg-y-50',
    items: [
      { id: 'hrbp', label: 'HR Business Partner', level: 'Nivel 3', count: 4, dot: '#de920c', desc: 'Partner estratégico de negocio para el área de personas.' },
      { id: 'po',   label: 'People Operations',   level: 'Nivel 2', count: 6, dot: '#f5c06a', desc: 'Operaciones de RRHH, onboarding y procesos internos.' },
    ],
  },
  {
    section: 'SALES', dept: 'Ventas', deptColor: '#d42e2e', deptBg: 'bg-r-50',
    items: [
      { id: 'sdr', label: 'SDR',                level: 'Nivel 1', count: 10, dot: '#f4a0a0', desc: 'Prospección y generación de oportunidades de venta.' },
      { id: 'ae',  label: 'Account Executive',  level: 'Nivel 2', count: 8,  dot: '#d42e2e', desc: 'Cierre de ventas y gestión de cuentas estratégicas.' },
      { id: 'sm',  label: 'Sales Manager',      level: 'Nivel 3', count: 3,  dot: '#8b1c1c', desc: 'Liderazgo del equipo comercial y estrategia de ventas.' },
    ],
  },
]

const DEFAULT_PATH_DATA = {
  sd: { skills: ['Visual Design','Prototyping','UX Research','Figma Advanced','Stakeholder Mgmt','Design Systems'], minExp: '3+ años', perf: '≥ 80%', approval: 'Manager + HR' },
  pd: { skills: ['Visual Design','Prototyping','Figma','User Research','Communication'], minExp: '1+ años', perf: '≥ 70%', approval: 'Manager' },
  jd: { skills: ['Figma Basics','Visual Design','Teamwork'], minExp: '0+ años', perf: '≥ 60%', approval: 'Manager' },
  dl: { skills: ['Team Leadership','Design Strategy','Mentorship','Design Systems','Stakeholder Mgmt','Roadmap Planning'], minExp: '5+ años', perf: '≥ 85%', approval: 'Manager + HR' },
  se: { skills: ['React','TypeScript','Node.js','System Design','Code Review','Agile/Scrum'], minExp: '3+ años', perf: '≥ 80%', approval: 'Manager + HR' },
  le: { skills: ['Technical Leadership','Architecture','Mentorship','React','TypeScript','Roadmap Planning'], minExp: '5+ años', perf: '≥ 85%', approval: 'Manager + HR' },
  pm: { skills: ['Product Strategy','Roadmapping','Stakeholder Mgmt','Data Analysis','Agile/Scrum','Market Research'], minExp: '3+ años', perf: '≥ 80%', approval: 'Manager + HR' },
}

export default function HRAdminTab() {
  const [selectedPath, setSelectedPath] = useState('sd')
  const [section, setSection] = useState('paths')
  const [hasChanges, setHasChanges] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [showWizard, setShowWizard] = useState(false)
  const [savedPaths, setSavedPaths] = useState([])
  const [successPath, setSuccessPath] = useState(null)
  const [pathData, setPathData] = useState(DEFAULT_PATH_DATA)
  const [addSkillInput, setAddSkillInput] = useState('')
  const [showAllRoles, setShowAllRoles] = useState(false)

  const selectPath = (id) => { setSelectedPath(id); setHasChanges(false); setAddSkillInput('') }

  const curData = pathData[selectedPath] || { skills: [], minExp: '', perf: '', approval: '' }

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

  const allPathItems = CAREER_PATHS.flatMap(g => g.items.map(i => ({ ...i, section: g.section })))
  const selectedPathItem = allPathItems.find(i => i.id === selectedPath)
  const filteredPathItems = CAREER_PATHS.map(group => ({
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

      {CAREER_PATHS.map(group => (
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
        {HR_STATS.map(s => (
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
              onClick={() => setHasChanges(false)}
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

            <div className="bg-white rounded-2xl shadow-4dp p-5">
              <CompetencyBuilder naked />
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
          onSave={(data) => {
            const newPath = { ...data, id: Date.now() }
            setSavedPaths(prev => [...prev, newPath])
            setShowWizard(false)
            setSuccessPath(newPath)
            setTimeout(() => setSuccessPath(null), 4000)
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
