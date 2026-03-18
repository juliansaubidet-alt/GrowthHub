import { useState, useEffect } from 'react'

/* ─── shared helpers ─────────────────────────────────────────────── */
const CIRCUMFERENCE = 2 * Math.PI * 32

function ProgressRing({ pct, color = '#496be3', size = 80, r = 32, stroke = 7 }) {
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eeeef1" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="ring-progress"
      />
      <text x={size / 2} y={size / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#303036">{pct}%</text>
    </svg>
  )
}

function SkillBar({ name, pct, status }) {
  const barColor = status === 'Gap' ? '#d42e2e' : status === 'Low' ? '#de920c' : '#28c040'
  const badgeClass = status === 'Gap' ? 'bg-r-100 text-r-600' : status === 'Low' ? 'bg-y-100 text-y-600' : 'bg-g-100 text-g-800'
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 text-[12px] text-n-950 shrink-0">{name}</span>
      <div className="flex-1 h-2 bg-n-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bar-fill" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <span className="w-8 text-[11px] text-n-600 shrink-0 text-right">{pct}%</span>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-12 text-center shrink-0 ${badgeClass}`}>{status}</span>
    </div>
  )
}

/* ─── EMPLOYEE TAB ──────────────────────────────────────────────── */
const PATH_NODES = [
  { id: 'n1', label: 'Junior Designer', sub: 'Completado · L1', ring: '#28c040', done: true,    type: 'done'    },
  { id: 'n2', label: 'Product Designer', sub: 'Actual · L2',    ring: '#496be3', current: true, type: 'current' },
  { id: 'n3', label: 'Senior Designer', sub: 'Meta · L3',       ring: '#9db8f3', type: 'target' },
  { id: 'n4', label: 'Design Lead',     sub: 'Bloqueado · L4',  ring: '#cbcdd6', locked: true,  type: 'locked'  },
  { id: 'n5', label: 'UX Researcher',   sub: 'Lateral · L2',    ring: '#886bff', type: 'lateral' },
]

const CONNECTORS = ['solid', 'solid', 'dashed', 'dotted']

function PathNode({ node, filter }) {
  if (filter !== 'Todo') {
    if (filter === 'Vertical' && node.type === 'lateral') return null
    if (filter === 'Lateral' && node.type !== 'lateral' && node.type !== 'current') return null
  }
  const opacity = node.locked ? 'opacity-55' : 'opacity-100'
  return (
    <div className={`flex flex-col items-center gap-1.5 ${opacity}`}>
      {/* Badge above circle */}
      <div className="h-5 flex items-center justify-center">
        {node.current && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-h-600 bg-h-50 border border-h-200 px-2 py-0.5 rounded-full whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-h-500 shrink-0" />
            Estás aquí
          </span>
        )}
        {node.type === 'target' && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-g-700 bg-g-50 border border-g-200 px-2 py-0.5 rounded-full whitespace-nowrap">
            🎯 Tu meta
          </span>
        )}
      </div>
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xl relative"
        style={{
          border: `3px solid ${node.ring}`,
          boxShadow: node.current ? `0 0 0 4px ${node.ring}33` : node.type === 'target' ? `0 0 0 3px #28c04022` : undefined,
          background: node.done ? '#f5fdf6' : node.current ? '#f1f4fd' : node.type === 'lateral' ? '#f4f2ff' : '#fff',
        }}
      >
        {node.done && <span className="text-g-600 text-lg">✓</span>}
        {node.current && <span className="text-h-600 text-sm font-bold">L2</span>}
        {node.type === 'target' && <span className="text-h-400 text-sm font-bold">{node.level || 'L3'}</span>}
        {node.locked && <span className="text-n-400 text-lg">🔒</span>}
        {node.type === 'lateral' && <span className="text-p-500 text-sm font-bold">L2</span>}
      </div>
      <p className={`text-[11px] font-semibold text-center leading-tight max-w-[72px] ${node.current ? 'text-h-700' : node.type === 'target' ? 'text-n-950' : 'text-n-950'}`}>{node.label}</p>
      <p className="text-[10px] text-n-500 text-center">{node.sub}</p>
    </div>
  )
}

/* ─── WIZARD DATA ───────────────────────────────────────────────── */
const ROUTES_BY_TYPE = {
  vertical: [
    { value: 'senior-designer',    label: 'Senior Designer',    level: 'L3' },
    { value: 'design-lead',        label: 'Design Lead',        level: 'L4' },
    { value: 'ux-director',        label: 'UX Director',        level: 'L5' },
    { value: 'principal-designer', label: 'Principal Designer', level: 'L6' },
  ],
  lateral: [
    { value: 'ux-researcher',      label: 'UX Researcher',      level: 'L2' },
    { value: 'design-lead',        label: 'Design Lead',        level: 'L4' },
    { value: 'brand-designer',     label: 'Brand Designer',     level: 'L2' },
    { value: 'content-strategist', label: 'Content Strategist', level: 'L2' },
  ],
}

const SKILLS_BY_ROUTE = {
  'senior-designer':    ['Visual Design', 'Prototyping', 'UX Research', 'Design Systems', 'Stakeholder Mgmt', 'Figma Advanced', 'Design Critique'],
  'design-lead':        ['Team Leadership', 'Design Strategy', 'Stakeholder Mgmt', 'Mentorship', 'Design Systems', 'Roadmap Planning'],
  'ux-director':        ['Strategic Planning', 'Executive Communication', 'Team Building', 'Design Ops', 'Budget Management', 'Cross-functional Leadership'],
  'principal-designer': ['Design Vision', 'System Thinking', 'Research Strategy', 'Influence & Impact', 'Design Ops', 'Technical Fluency'],
  'ux-researcher':      ['User Research', 'Data Analysis', 'Interview Techniques', 'Usability Testing', 'Synthesis & Insights', 'Survey Design'],
  'product-manager':    ['Product Strategy', 'Roadmapping', 'Stakeholder Management', 'Data Analysis', 'Agile Methodologies', 'Market Research'],
  'brand-designer':     ['Brand Strategy', 'Typography', 'Illustration', 'Motion Design', 'Visual Identity', 'Art Direction'],
  'content-strategist': ['Content Planning', 'UX Writing', 'SEO Basics', 'Analytics', 'Storytelling', 'Information Architecture'],
}

const COURSES_BY_ROUTE = {
  'senior-designer': [
    { id: 'c1', emoji: '📗', title: 'Stakeholder Management Fundamentals', type: 'Curso',         duration: '4h',  provider: 'LinkedIn Learning' },
    { id: 'c2', emoji: '🎨', title: 'Advanced Design Systems',             type: 'Certificación', duration: '12h', provider: 'Figma Academy'     },
    { id: 'c3', emoji: '🔬', title: 'UX Research Methods',                 type: 'Curso',         duration: '8h',  provider: 'Humand Learn'      },
    { id: 'c4', emoji: '💡', title: 'Design Critique & Feedback',          type: 'Workshop',      duration: '3h',  provider: 'Humand Learn'      },
  ],
  'design-lead': [
    { id: 'c5', emoji: '👥', title: 'Design Team Leadership',   type: 'Curso',         duration: '6h',  provider: 'Humand Learn'      },
    { id: 'c6', emoji: '🗺️', title: 'Design Strategy & Vision', type: 'Certificación', duration: '10h', provider: 'IDEO U'            },
    { id: 'c7', emoji: '🧭', title: 'Product Roadmap Planning', type: 'Curso',         duration: '5h',  provider: 'LinkedIn Learning' },
    { id: 'c8', emoji: '🎓', title: 'Mentoring & Coaching',     type: 'Workshop',      duration: '4h',  provider: 'Humand Learn'      },
  ],
  'ux-researcher': [
    { id: 'c9',  emoji: '🔍', title: 'User Research Fundamentals',       type: 'Certificación', duration: '15h', provider: 'Nielsen Norman Group' },
    { id: 'c10', emoji: '📊', title: 'Quantitative Research Methods',    type: 'Curso',         duration: '8h',  provider: 'Humand Learn'         },
    { id: 'c11', emoji: '🎤', title: 'User Interview Mastery',           type: 'Workshop',      duration: '3h',  provider: 'Humand Learn'         },
  ],
  'product-manager': [
    { id: 'c12', emoji: '🚀', title: 'Product Management Fundamentals', type: 'Certificación', duration: '20h', provider: 'Product School'    },
    { id: 'c13', emoji: '📈', title: 'Data-Driven Product Decisions',   type: 'Curso',         duration: '8h',  provider: 'Humand Learn'      },
    { id: 'c14', emoji: '🏃', title: 'Agile & Scrum for PMs',           type: 'Curso',         duration: '6h',  provider: 'LinkedIn Learning' },
  ],
  'brand-designer': [
    { id: 'c15', emoji: '✏️', title: 'Brand Identity Design',  type: 'Certificación', duration: '10h', provider: 'Humand Learn'      },
    { id: 'c16', emoji: '🎬', title: 'Motion Design Basics',   type: 'Curso',         duration: '6h',  provider: 'LinkedIn Learning' },
    { id: 'c17', emoji: '🖋️', title: 'Typography Masterclass', type: 'Curso',         duration: '4h',  provider: 'Humand Learn'      },
  ],
  'content-strategist': [
    { id: 'c18', emoji: '📝', title: 'UX Writing Fundamentals',     type: 'Curso',    duration: '5h',  provider: 'Humand Learn'      },
    { id: 'c19', emoji: '🔎', title: 'Content Strategy & SEO',      type: 'Curso',    duration: '7h',  provider: 'LinkedIn Learning' },
    { id: 'c20', emoji: '📐', title: 'Information Architecture',    type: 'Workshop', duration: '3h',  provider: 'Humand Learn'      },
  ],
  'ux-director': [
    { id: 'c21', emoji: '🏛️', title: 'Design Operations Leadership', type: 'Certificación', duration: '12h', provider: 'IDEO U'       },
    { id: 'c22', emoji: '💼', title: 'Executive Communication',      type: 'Curso',         duration: '6h',  provider: 'Humand Learn' },
    { id: 'c23', emoji: '🌐', title: 'Cross-functional Leadership',  type: 'Workshop',      duration: '4h',  provider: 'Humand Learn' },
  ],
  'principal-designer': [
    { id: 'c24', emoji: '🧠', title: 'Systems Thinking for Designers', type: 'Certificación', duration: '14h', provider: 'IDEO U'       },
    { id: 'c25', emoji: '🔭', title: 'Design Vision & Strategy',       type: 'Curso',         duration: '8h',  provider: 'Humand Learn' },
    { id: 'c26', emoji: '💎', title: 'Influence & Impact at Scale',    type: 'Workshop',      duration: '3h',  provider: 'Humand Learn' },
  ],
}

const DEFAULT_COURSES = [
  { id: 'cd1', emoji: '🤝', title: 'Cross-functional Collaboration', type: 'Workshop',      duration: '2h',  provider: 'Humand Learn', priority: 2 },
  { id: 'cd2', emoji: '💬', title: 'Comunicación Ejecutiva',         type: 'Curso',         duration: '5h',  provider: 'Humand Learn', priority: 2 },
  { id: 'cd3', emoji: '🧩', title: 'Design Thinking Avanzado',       type: 'Certificación', duration: '10h', provider: 'IDEO U',       priority: 3 },
]

const MANAGERS = [
  { value: 'maria-gonzalez', label: 'María González', role: 'Design Director'   },
  { value: 'carlos-ruiz',    label: 'Carlos Ruiz',    role: 'VP of Product'     },
  { value: 'ana-garcia',     label: 'Ana García',     role: 'Head of Design'    },
  { value: 'luis-herrera',   label: 'Luis Herrera',   role: 'Engineering Lead'  },
  { value: 'mia-torres',     label: 'Mia Torres',     role: 'Product Lead'      },
]

const SOFT_SKILLS = [
  'Comunicación efectiva', 'Trabajo en equipo', 'Liderazgo', 'Gestión del tiempo',
  'Resolución de conflictos', 'Adaptabilidad', 'Pensamiento crítico', 'Empatía',
  'Proactividad', 'Negociación', 'Presentaciones', 'Mentoría',
]

const OBJECTIVES_BY_ROUTE = {
  'senior-designer': [
    { id: 'o1', text: 'Liderar al menos 1 proyecto de diseño de principio a fin', term: 'short' },
    { id: 'o2', text: 'Obtener una certificación en Design Systems o UX Research', term: 'medium' },
    { id: 'o3', text: 'Alcanzar el nivel Senior con aprobación del manager y HR',  term: 'long'  },
  ],
  'design-lead': [
    { id: 'o1', text: 'Dar mentoría formal a al menos 1 diseñador junior',         term: 'short'  },
    { id: 'o2', text: 'Co-liderar un proyecto estratégico cross-funcional',         term: 'medium' },
    { id: 'o3', text: 'Asumir responsabilidades de liderazgo de equipo',            term: 'long'   },
  ],
  'ux-researcher': [
    { id: 'o1', text: 'Conducir al menos 2 sesiones de entrevistas a usuarios',    term: 'short'  },
    { id: 'o2', text: 'Certificarme en métodos de investigación UX',               term: 'medium' },
    { id: 'o3', text: 'Liderar el área de research en un producto completo',        term: 'long'   },
  ],
  'product-manager': [
    { id: 'o1', text: 'Completar curso de Product Management y Agile',             term: 'short'  },
    { id: 'o2', text: 'Participar activamente en la definición de roadmap',        term: 'medium' },
    { id: 'o3', text: 'Asumir ownership de una feature o producto completo',       term: 'long'   },
  ],
  'brand-designer': [
    { id: 'o1', text: 'Crear al menos 1 pieza de identidad visual desde cero',     term: 'short'  },
    { id: 'o2', text: 'Desarrollar un brand book o sistema de identidad',          term: 'medium' },
    { id: 'o3', text: 'Liderar el rediseño visual de un producto o marca',         term: 'long'   },
  ],
  'content-strategist': [
    { id: 'o1', text: 'Definir la guía de voz y tono del producto',                term: 'short'  },
    { id: 'o2', text: 'Crear una estrategia de contenido para un flujo completo',  term: 'medium' },
    { id: 'o3', text: 'Ser referente de UX Writing en la organización',            term: 'long'   },
  ],
  'ux-director': [
    { id: 'o1', text: 'Presentar la visión de diseño a stakeholders ejecutivos',   term: 'short'  },
    { id: 'o2', text: 'Liderar la definición del design system corporativo',       term: 'medium' },
    { id: 'o3', text: 'Dirigir el área de diseño con ownership total',             term: 'long'   },
  ],
  'principal-designer': [
    { id: 'o1', text: 'Publicar un framework o metodología propia de diseño',      term: 'short'  },
    { id: 'o2', text: 'Influenciar decisiones de producto a nivel estratégico',    term: 'medium' },
    { id: 'o3', text: 'Ser reconocido como referente de diseño en la industria',   term: 'long'   },
  ],
}

const DEFAULT_OBJECTIVES = [
  { id: 'o1', text: 'Completar al menos 1 curso relacionado con el nuevo rol',    term: 'short'  },
  { id: 'o2', text: 'Participar en proyectos que desarrollen las skills requeridas', term: 'medium' },
  { id: 'o3', text: 'Alcanzar el rol objetivo con el apoyo del manager',           term: 'long'   },
]

/* ─── CAREER PLAN WIZARD ────────────────────────────────────────── */
const WIZARD_STEPS = ['Ruta profesional', 'Habilidades', 'Objetivos', 'Aprendizaje', 'Revisión']

const TERM_CONFIG = {
  short:  { label: 'Corto plazo',   badge: 'bg-g-100 text-g-800',  dot: 'bg-g-500'  },
  medium: { label: 'Mediano plazo', badge: 'bg-y-100 text-y-700',  dot: 'bg-y-500'  },
  long:   { label: 'Largo plazo',   badge: 'bg-p-100 text-p-800',  dot: 'bg-p-500'  },
}

const PRIORITY_CONFIG = {
  1: { label: 'Esencial',     badge: 'bg-r-100 text-r-600',  star: '★★★' },
  2: { label: 'Recomendado',  badge: 'bg-h-100 text-h-800',  star: '★★☆' },
  3: { label: 'Opcional',     badge: 'bg-n-100 text-n-600',  star: '★☆☆' },
}

function CareerPlanWizard({ onComplete, onCancel }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
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
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const routes           = ROUTES_BY_TYPE[form.growthType] || []
  const selectedRoute    = routes.find(r => r.value === form.route)
  const predefinedSkills = form.route ? (SKILLS_BY_ROUTE[form.route] || []) : []
  const suggestedCourses = [...(COURSES_BY_ROUTE[form.route] || []).map((c, i) => ({ ...c, priority: i === 0 ? 1 : i <= 2 ? 2 : 3 })), ...DEFAULT_COURSES]
    .sort((a, b) => a.priority - b.priority)
  const selectedManager  = MANAGERS.find(m => m.value === form.manager)

  // When route changes, seed default objectives
  const handleRouteChange = (val) => {
    const suggested = val ? [...(OBJECTIVES_BY_ROUTE[val] || DEFAULT_OBJECTIVES)] : []
    setForm(f => ({ ...f, route: val, objectives: suggested.map(o => ({ ...o, id: o.id + Date.now() })) }))
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

  const TYPE_COLOR = {
    'Certificación': 'bg-p-100 text-p-800',
    'Workshop':      'bg-y-100 text-y-700',
    'Curso':         'bg-t-100 text-t-800',
  }

  return (
    <div className="flex flex-col gap-5 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-bold text-n-950">Crear plan de carrera</h2>
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

          {/* ── STEP 1: Ruta profesional ── */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Tipo de crecimiento</p>
                <div className="flex gap-3">
                  {[
                    { val: 'vertical', label: 'Crecimiento vertical', desc: 'Ascender dentro de tu área actual', emoji: '📈' },
                    { val: 'lateral',  label: 'Movimiento lateral',   desc: 'Explorar un área o rol diferente',  emoji: '↔️' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => { set('growthType', opt.val); handleRouteChange('') }}
                      className={`flex-1 flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${form.growthType === opt.val ? 'border-h-500 bg-h-50' : 'border-n-200 hover:border-n-300'}`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{opt.emoji}</span>
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
                    {MANAGERS.map(m => (
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

          {/* ── STEP 2: Habilidades ── */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              {/* Hard skills */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">Habilidades técnicas requeridas</p>
                  {selectedRoute && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-h-100 text-h-800">{selectedRoute.label}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {predefinedSkills.map(skill => {
                    const sel = form.skills.includes(skill)
                    return (
                      <button key={skill} onClick={() => toggleSkill(skill)}
                        className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all ${sel ? 'bg-h-500 text-white border-h-500' : 'bg-white text-n-700 border-n-200 hover:border-h-400'}`}
                      >
                        {sel ? '✓ ' : ''}{skill}
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

              {/* Soft skills */}
              <div>
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Soft skills</p>
                <div className="flex flex-wrap gap-2">
                  {SOFT_SKILLS.map(skill => {
                    const sel = form.softSkills.includes(skill)
                    return (
                      <button key={skill} onClick={() => toggleSoftSkill(skill)}
                        className={`text-[12px] font-medium px-3 py-1.5 rounded-lg border transition-all ${sel ? 'bg-t-500 text-white border-t-500' : 'bg-white text-n-700 border-n-200 hover:border-t-400'}`}
                      >
                        {sel ? '✓ ' : ''}{skill}
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

              {/* Summary */}
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
          )}

          {/* ── STEP 3: Objetivos ── */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">Objetivos de desarrollo</p>
                  <p className="text-[11px] text-n-500 mt-0.5">Sugeridos según tu ruta — editá, eliminá o agregá los tuyos</p>
                </div>
                <span className="text-[11px] text-n-500">{form.objectives.length} objetivos</span>
              </div>

              {/* Objective list */}
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

              {/* Add / edit objective */}
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

          {/* ── STEP 4: Aprendizaje ── */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">Cursos disponibles en Humand</p>
                  <p className="text-[11px] text-n-500 mt-0.5">Ordenados por prioridad según tu ruta</p>
                </div>
                <span className="text-[11px] text-n-500">{form.selectedCourses.length} seleccionados</span>
              </div>

              {/* Priority legend */}
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
                      <div className="w-10 h-10 rounded-xl bg-white shadow-4dp flex items-center justify-center text-lg shrink-0">{course.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{course.type}</p>
                        <p className="text-[13px] font-semibold text-n-950 mt-0.5">{course.title}</p>
                        <p className="text-[11px] text-n-600 mt-0.5">{course.provider} · {course.duration}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${pcfg.badge}`}>{pcfg.label}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${sel ? 'bg-h-500 border-h-500' : 'border-n-300'}`}>
                          {sel && <span className="text-white text-[9px]">✓</span>}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── STEP 5: Revisión ── */}
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
                    {form.growthType === 'vertical' ? '↑ Vertical' : '↔ Lateral'}
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
              onClick={() => onComplete(form)}
              className="h-9 px-5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors"
            >
              Enviar plan ✓
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function EmployeeEmptyState({ onStart }) {
  return (
    <div className="flex gap-5">
      {/* LEFT: role hero */}
      <div className="flex flex-col gap-4" style={{ width: 260 }}>
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(140deg, #3851d8 0%, #29317f 100%)' }}>
          <p className="text-[9px] font-semibold uppercase tracking-widest opacity-65 mb-2">Current Role</p>
          <p className="text-lg font-bold mb-0.5">Product Designer</p>
          <p className="text-[12px] opacity-75 mb-3">Design Team · Mid-level</p>
          <div className="flex gap-2">
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">2.5 yr tenure</span>
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">Score 87%</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-4dp p-5">
          <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Lo que vas a desbloquear</p>
          <div className="flex flex-col gap-3">
            {[
              { emoji: '🗺️', text: 'Tu mapa de carrera personalizado' },
              { emoji: '📊', text: 'Análisis de brechas de skills' },
              { emoji: '🎯', text: 'Objetivos de desarrollo claros' },
              { emoji: '🚀', text: 'Acciones recomendadas por rol' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-base shrink-0">{item.emoji}</span>
                <p className="text-[12px] text-n-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: empty state */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-4dp h-full flex flex-col items-center justify-center px-12 py-16 text-center">
          {/* Illustration */}
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-h-50 flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="12" cy="36" r="6" stroke="#9db8f3" strokeWidth="2.5" fill="#f1f4fd" />
                <circle cx="24" cy="20" r="6" stroke="#496be3" strokeWidth="2.5" fill="#e8edfc" />
                <circle cx="36" cy="36" r="6" stroke="#cbcdd6" strokeWidth="2.5" fill="#f8f8fa" strokeDasharray="4 2" />
                <line x1="17.5" y1="33" x2="21" y2="23" stroke="#9db8f3" strokeWidth="2" strokeLinecap="round" />
                <line x1="27" y1="23" x2="30.5" y2="33" stroke="#cbcdd6" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
              </svg>
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-y-100 flex items-center justify-center">
              <span className="text-sm">✨</span>
            </div>
          </div>

          <h2 className="text-[17px] font-bold text-n-950 mb-2">Todavía no creaste tu plan de carrera</h2>
          <p className="text-[13px] text-n-600 max-w-xs leading-relaxed mb-8">
            Definí tu próximo rol, identificá tus brechas de skills y trazá el camino para llegar ahí.
          </p>

          {/* Current role pill */}
          <div className="flex items-center gap-2 bg-n-50 border border-n-200 rounded-full px-4 py-2 mb-8">
            <div className="w-2.5 h-2.5 rounded-full bg-h-500 shrink-0" />
            <span className="text-[12px] font-semibold text-n-950">Rol actual:</span>
            <span className="text-[12px] text-n-700">Product Designer · L2</span>
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
      {/* Success card */}
      <div className="bg-white rounded-2xl shadow-4dp p-12 flex flex-col items-center text-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-g-50 flex items-center justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-g-100 flex items-center justify-center">
            <span className="text-g-600 text-2xl">✓</span>
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

function EmployeeTab() {
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

  /* ── Derived from planData ─────────────────────────────────── */
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

  // Skill levels: deterministic simulation per skill name
  const skillLevel = (name) => ((name.charCodeAt(0) * 3 + name.length * 7) % 45) + 35
  const allSkills  = planData.skills.slice(0, 6).map(name => {
    const pct    = skillLevel(name)
    const gap    = 90 - pct
    const status = gap > 30 ? 'Gap' : gap > 10 ? 'Low' : 'OK'
    return { name, pct, status }
  })
  const gapCount = allSkills.filter(s => s.status === 'Gap').length

  // Career path nodes built from plan
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

  // Selected courses with priority
  const allCourses     = [...(COURSES_BY_ROUTE[planData.route] || []).map((c, i) => ({ ...c, priority: i === 0 ? 1 : i <= 2 ? 2 : 3 })), ...DEFAULT_COURSES]
  const coursesDisplay = allCourses.filter(c => planData.selectedCourses.includes(c.id))
  const TYPE_COLOR_MAP = { 'Certificación': 'bg-p-100 text-p-800', 'Workshop': 'bg-y-100 text-y-700', 'Curso': 'bg-t-100 text-t-800' }

  return (
    <div className="flex gap-5">
      {/* ── LEFT ── */}
      <div className="flex flex-col gap-4" style={{ width: 260 }}>

        {/* Role hero */}
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(140deg, #3851d8 0%, #29317f 100%)' }}>
          <p className="text-[9px] font-semibold uppercase tracking-widest opacity-65 mb-2">Rol Actual</p>
          <p className="text-lg font-bold mb-0.5">Product Designer</p>
          <p className="text-[12px] opacity-75 mb-1">Design Team · Mid-level</p>
          {selectedMgr && (
            <p className="text-[11px] opacity-60 mb-2">Manager: {selectedMgr.label}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">2.5 yr tenure</span>
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">Score 87%</span>
          </div>
        </div>

        {/* Overall progress */}
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

        {/* Skills */}
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

      {/* ── RIGHT ── */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">

        {/* Pending approval alert */}
        {planStatus === 'revision' && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-y-50 border border-y-200">
            <span className="text-y-600 text-base shrink-0">⏳</span>
            <p className="text-[12px] text-y-800">
              Tu plan de carrera está <span className="font-semibold">pendiente de aprobación</span> por {selectedMgr ? <span className="font-semibold">{selectedMgr.label}</span> : 'tu líder o manager directo'}.
            </p>
          </div>
        )}

        {/* Career path map */}
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

        {/* Objectives (interactive) */}
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
                    {done && !locked && <span className="text-white text-[9px]">✓</span>}
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

        {/* Courses */}
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
                      <div className="w-10 h-10 rounded-xl bg-white shadow-4dp flex items-center justify-center text-lg shrink-0">{c.emoji}</div>
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

/* ─── MANAGER TAB ───────────────────────────────────────────────── */
const TEAM = [
  { initials: 'AG', name: 'Ana García',   role: 'Product Designer',   badge: 'bg-y-100 text-y-700',  badgeLabel: 'Revisión',       color: 'bg-h-100 text-h-600' },
  { initials: 'LH', name: 'Luis Herrera', role: 'Frontend Engineer',  badge: 'bg-h-100 text-h-800',  badgeLabel: 'En progreso',    color: 'bg-t-100 text-t-800' },
  { initials: 'MT', name: 'Mia Torres',   role: 'UX Researcher',      badge: 'bg-h-100 text-h-800',  badgeLabel: 'Meta definida',  color: 'bg-p-100 text-p-800' },
  { initials: 'CR', name: 'Carlos Ruiz',  role: 'Backend Engineer',   badge: 'bg-h-100 text-h-800',  badgeLabel: 'En progreso',    color: 'bg-g-100 text-g-800' },
  { initials: 'SL', name: 'Sara López',   role: 'Data Analyst',       badge: 'bg-n-100 text-n-600',  badgeLabel: 'Sin plan',       color: 'bg-y-100 text-y-700' },
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

function ManagerTab() {
  const [selected, setSelected]         = useState(0)
  const [feedback, setFeedback]         = useState('')
  const [anaStatus, setAnaStatus]       = useState('revision')
  const [showSuggest, setShowSuggest]   = useState(false)
  const [suggestion, setSuggestion]     = useState('')
  const [savedSuggestion, setSavedSuggestion] = useState('')

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
            {/* Alert banner — pending approval */}
            {anaStatus === 'revision' && (
              <div className="rounded-2xl bg-y-50 border border-y-200 px-5 py-4 flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">⚠️</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-n-950">Ana García envió un plan de carrera para revisión</p>
                  <p className="text-[12px] text-n-600 mt-0.5">Objetivo: Senior Designer · Enviado 15 Mar 2026</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setAnaStatus('aprobado')}
                    className="h-8 px-3 text-[12px] font-semibold border border-g-600 text-g-800 rounded-lg hover:bg-g-50 transition-colors"
                  >✓ Aprobar</button>
                  <button
                    onClick={() => setShowSuggest(true)}
                    className="h-8 px-3 text-[12px] font-semibold border border-y-600 text-y-700 rounded-lg hover:bg-y-50 transition-colors"
                  >↩ Sugerir cambios</button>
                </div>
              </div>
            )}

            {/* Approved banner */}
            {anaStatus === 'aprobado' && (
              <div className="rounded-2xl bg-g-50 border border-g-200 px-5 py-3.5 flex items-center gap-3">
                <span className="text-xl shrink-0">✅</span>
                <p className="text-[13px] font-semibold text-g-800">Plan de carrera de Ana García aprobado</p>
              </div>
            )}

            {/* Changes requested banner */}
            {anaStatus === 'cambios' && (
              <div className="rounded-2xl bg-r-50 border border-r-200 px-5 py-4 flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">↩</span>
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

            {/* Suggest changes modal */}
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
                        <PathNode node={node} filter="Todo" />
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
                <p className="text-[11px] text-n-600">{ANA_HARD_SKILLS.length + ANA_SOFT_SKILLS.length} habilidades para el rol</p>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Habilidades técnicas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ANA_HARD_SKILLS.map(s => (
                      <span key={s} className="text-[11px] font-medium bg-h-50 text-h-800 border border-h-200 px-2.5 py-1 rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-n-100">
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Soft skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ANA_SOFT_SKILLS.map(s => (
                      <span key={s} className="text-[11px] font-medium bg-t-50 text-t-800 border border-t-200 px-2.5 py-1 rounded-lg">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100">
                <p className="text-[13px] font-semibold text-n-950">Objetivos</p>
                <p className="text-[11px] text-n-600">{ANA_GOALS.filter(g => g.done).length} de {ANA_GOALS.length} completados</p>
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                {ANA_GOALS.map((g, i) => {
                  const cfg = TERM_CONFIG[g.term]
                  return (
                    <div key={i} className={`flex items-start gap-2.5 p-2 rounded-lg ${g.done ? 'bg-h-50' : ''}`}>
                      <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center ${g.done ? 'bg-h-500' : 'border-2 border-n-300'}`}>
                        {g.done && <span className="text-white text-[9px]">✓</span>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12px] leading-tight text-n-950">{g.text}</p>
                        <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${cfg.badge}`}>{cfg.label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
                <p className="text-[13px] font-semibold text-n-950">Cursos y aprendizaje</p>
                <span className="text-[11px] text-n-500">{ANA_COURSES.length} cursos</span>
              </div>
              <div className="p-4 flex flex-col gap-2.5">
                {ANA_COURSES.map(c => {
                  const pcfg = PRIORITY_CONFIG[c.priority] || PRIORITY_CONFIG[3]
                  return (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-n-50">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-4dp flex items-center justify-center text-lg shrink-0">{c.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{c.type}</p>
                        <p className="text-[13px] font-semibold text-n-950 mt-0.5">{c.title}</p>
                        <p className="text-[11px] text-n-600">{c.provider} · {c.duration}</p>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${pcfg.badge}`}>{pcfg.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Assign opportunities + feedback */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100">
                <p className="text-[13px] font-semibold text-n-950">Acciones del manager</p>
              </div>
              <div className="p-5 flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Asignar oportunidades</p>
                  <div className="flex gap-2">
                    <button className="h-9 px-4 bg-white border border-n-200 shadow-4dp hover:shadow-8dp text-n-950 rounded-lg text-[13px] font-semibold transition-shadow">+ Asignar proyecto</button>
                    <button className="h-9 px-4 bg-white border border-n-200 shadow-4dp hover:shadow-8dp text-n-950 rounded-lg text-[13px] font-semibold transition-shadow">+ Asignar mentor</button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Dejar comentario</p>
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

/* ─── HR ADMIN TAB ──────────────────────────────────────────────── */
const HR_STATS = [
  { emoji: '🗺️', value: '12', label: 'Rutas de carrera definidas' },
  { emoji: '✅', value: '38', label: 'Empleados con plan activo' },
  { emoji: '🔄', value: '7',  label: 'Planes en revisión' },
  { emoji: '🏆', value: '4',  label: 'Listos para promoción' },
]

const CAREER_PATHS = [
  {
    section: 'DESIGN',
    items: [
      { id: 'sd', label: 'Senior Designer', level: 'Nivel 3', count: 8,  dot: '#496be3' },
      { id: 'pd', label: 'Product Designer', level: 'Nivel 2', count: 14, dot: '#9db8f3' },
      { id: 'jd', label: 'Junior Designer',  level: 'Nivel 1', count: 6,  dot: '#c5d4f8' },
      { id: 'dl', label: 'Design Lead',      level: 'Nivel 4', count: 3,  dot: '#29317f' },
    ],
  },
  {
    section: 'ENGINEERING',
    items: [
      { id: 'se', label: 'Senior Engineer',  level: 'Nivel 3', count: 12, dot: '#35a48e' },
      { id: 'le', label: 'Lead Engineer',    level: 'Nivel 4', count: 5,  dot: '#1f5049' },
    ],
  },
  {
    section: 'PRODUCT',
    items: [
      { id: 'pm', label: 'Product Manager',  level: 'Nivel 3', count: 7,  dot: '#886bff' },
    ],
  },
]

const PROGRESSION = [
  { initials: 'AG', name: 'Ana García',   role: 'Product Designer', pct: 60, status: 'En revisión',          statusClass: 'bg-y-100 text-y-700',  est: 'Q3 2026', color: 'bg-h-100 text-h-600' },
  { initials: 'RD', name: 'Raj Desai',    role: 'Product Designer', pct: 85, status: 'Listo para promoción',  statusClass: 'bg-g-100 text-g-800',  est: 'Q2 2026', color: 'bg-t-100 text-t-800' },
  { initials: 'PT', name: 'Paula Torres', role: 'Junior Designer',  pct: 30, status: 'En progreso',           statusClass: 'bg-h-100 text-h-800',  est: 'Q4 2026', color: 'bg-p-100 text-p-500' },
]

const REQUIRED_SKILLS = ['Visual Design', 'Prototyping', 'UX Research', 'Figma Advanced', 'Stakeholder Mgmt', 'Design Systems']

function HRAdminTab() {
  const [selectedPath, setSelectedPath] = useState('sd')

  return (
    <div className="flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {HR_STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4 flex items-center gap-3">
            <span className="text-2xl">{s.emoji}</span>
            <div>
              <p className="text-xl font-bold text-n-950">{s.value}</p>
              <p className="text-[11px] text-n-600">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* LEFT: career paths list */}
        <div style={{ width: 240 }}>
          <div className="bg-white rounded-2xl shadow-4dp">
            <div className="px-5 py-3.5 border-b border-n-100 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-n-950">Rutas de carrera</span>
              <button className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition-colors">+ Nueva</button>
            </div>
            <div className="p-3 flex flex-col gap-1">
              {CAREER_PATHS.map(group => (
                <div key={group.section}>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest px-2 py-1.5">{group.section}</p>
                  {group.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedPath(item.id)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${selectedPath === item.id ? 'bg-p-50' : 'hover:bg-n-50'}`}
                    >
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.dot }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-n-950 truncate">{item.label}</p>
                        <p className="text-[10px] text-n-600">{item.level}</p>
                      </div>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-n-100 text-n-600 shrink-0">{item.count}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: role editor + progression */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Role editor */}
          <div className="bg-white rounded-2xl shadow-4dp">
            <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-n-950">Senior Designer</p>
                <p className="text-[11px] text-n-600">Diseño · Nivel 3 · 8 empleados</p>
              </div>
              <div className="flex gap-2">
                <button className="h-9 px-4 bg-white border border-n-200 shadow-4dp hover:shadow-8dp text-n-950 rounded-lg text-[13px] font-semibold transition-shadow">Editar ruta</button>
                <button className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors">Guardar cambios</button>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Skills y competencias requeridas</p>
                <div className="flex flex-wrap gap-2">
                  {REQUIRED_SKILLS.map(s => (
                    <div key={s} className="flex items-center gap-1 bg-h-50 text-h-800 text-[12px] font-medium px-2.5 py-1 rounded-lg">
                      {s}
                      <button className="text-h-400 hover:text-r-600 ml-1 leading-none">×</button>
                    </div>
                  ))}
                  <button className="flex items-center gap-1 bg-n-100 text-n-600 text-[12px] font-medium px-2.5 py-1 rounded-lg hover:bg-n-200 transition-colors">+ Agregar skill</button>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Requisitos del rol</p>
                <div className="grid grid-cols-3 gap-3">
                  {[['Experiencia mínima', '3+ años'], ['Umbral de desempeño', '≥ 80%'], ['Aprobación requerida', 'Manager + HR']].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[11px] text-n-600 mb-1">{label}</p>
                      <input className="input-humand" defaultValue={val} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progression table */}
          <div className="bg-white rounded-2xl shadow-4dp">
            <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-n-950">Progresión del equipo</p>
                <p className="text-[11px] text-n-600">Con objetivo: Senior Designer</p>
              </div>
              <button className="text-[12px] text-h-600 font-medium hover:underline">Exportar →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-n-100">
                    {['Empleado', 'Rol actual', 'Progreso', 'Estado', 'Est. listo', ''].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-n-600 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROGRESSION.map((p, i) => (
                    <tr key={i} className="border-b border-n-50 hover:bg-n-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${p.color}`}>{p.initials}</div>
                          <span className="text-[13px] font-medium text-n-950">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-n-600">{p.role}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-n-100 rounded-full overflow-hidden">
                            <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${p.pct}%` }} />
                          </div>
                          <span className="text-[11px] text-n-600">{p.pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${p.statusClass}`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-n-600">{p.est}</td>
                      <td className="px-5 py-3">
                        <button className="text-[12px] text-h-600 font-medium hover:underline">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────── */
const ACTOR_TABS = [
  { id: 'employee', label: 'Empleado', dot: '#496be3' },
  { id: 'manager',  label: 'Manager',  dot: '#35a48e' },
  { id: 'hradmin',  label: 'HU Admin', dot: '#886bff' },
]

export default function CareerPath() {
  const [actor, setActor] = useState('employee')

  return (
    <div className="p-8 max-w-6xl mx-auto animate-slide-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-n-950">Plan de Carrera</h1>
          <p className="text-[13px] text-n-600 mt-0.5">Planificá y seguí tu desarrollo profesional</p>
        </div>

        {/* Actor switcher */}
        <div className="flex items-center gap-1 bg-n-100 p-1 rounded-xl">
          {ACTOR_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActor(tab.id)}
              className={`flex items-center gap-2 px-4 h-8 rounded-lg text-[13px] transition-all ${actor === tab.id ? 'bg-white shadow-4dp text-n-950 font-semibold' : 'text-n-600 font-normal hover:text-n-950'}`}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tab.dot }} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {actor === 'employee' && <EmployeeTab />}
      {actor === 'manager'  && <ManagerTab />}
      {actor === 'hradmin'  && <HRAdminTab />}
    </div>
  )
}
