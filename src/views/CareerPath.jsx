import { useState, useEffect } from 'react'
import { useApp } from '../App'
import { Lock, Eye, EyeOff, X, Plus, Trash2, Edit3, ChevronDown, ChevronRight, Check, Target, Map, TrendingUp, TrendingDown, ArrowLeftRight, BarChart3, Rocket, BookOpen, Palette, Microscope, Lightbulb, Users, Compass, GraduationCap, Search, Mic, Zap, Film, FileText, LayoutGrid, Building2, Briefcase, Globe, Brain, Gem, MessageCircle, CheckCircle, RotateCw, Award, AlertTriangle, AlertCircle, Heart, Clock, Sparkles, CornerDownLeft, AlertOctagon, RefreshCw } from 'lucide-react'

/* ─── shared helpers ─────────────────────────────────────────────── */
const COURSE_ICON_MAP = {
  'Curso': BookOpen, 'Certificación': Award, 'Workshop': Users,
}
function CourseIcon({ type, size = 20 }) {
  const Icon = COURSE_ICON_MAP[type] || BookOpen
  return <Icon size={size} className="text-n-500" />
}
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

function PathNode({ node, filter, thirdPerson = false }) {
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
            {thirdPerson ? 'Está aquí' : 'Estás aquí'}
          </span>
        )}
        {node.type === 'target' && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-g-700 bg-g-50 border border-g-200 px-2 py-0.5 rounded-full whitespace-nowrap">
            <Target size={10} /> {thirdPerson ? 'Su meta' : 'Tu meta'}
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
        {node.done && <Check size={18} className="text-g-600" />}
        {node.current && <span className="text-h-600 text-sm font-bold">L2</span>}
        {node.type === 'target' && <span className="text-h-400 text-sm font-bold">{node.level || 'L3'}</span>}
        {node.locked && <Lock size={14} className="text-n-400" />}
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
  1: { label: 'Esencial',     badge: 'bg-g-100 text-g-700',  star: '★★★' },
  2: { label: 'Recomendado',  badge: 'bg-h-100 text-h-800',  star: '★★☆' },
  3: { label: 'Opcional',     badge: 'bg-p-100 text-p-700',  star: '★☆☆' },
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
              onClick={() => onComplete(form)}
              className="h-9 px-5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors"
            >
              <span className="flex items-center gap-1.5">Enviar plan <Check size={14} /></span>
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

      {/* RIGHT: empty state */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl shadow-4dp h-full flex flex-col items-center justify-center px-12 py-16 text-center">
          {/* Illustration */}
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

          {/* Current role pill */}
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
      {/* Success card */}
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
          <p className="text-[12px] opacity-75 mb-1">Design Team</p>
          {selectedMgr && (
            <p className="text-[11px] opacity-60 mb-2">Manager: {selectedMgr.label}</p>
          )}
          <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">2.5 yr tenure</span>
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
            <Clock size={16} className="text-y-600 shrink-0" />
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

/* ─── MANAGER TAB ───────────────────────────────────────────────── */
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

function ManagerTab() {
  const [selected, setSelected]         = useState(0)
  const [feedback, setFeedback]         = useState('')
  const [anaStatus, setAnaStatus]       = useState('revision')
  const [showSuggest, setShowSuggest]   = useState(false)
  const [suggestion, setSuggestion]     = useState('')
  const [savedSuggestion, setSavedSuggestion] = useState('')

  // Editable lists
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
            {/* Alert banner — pending approval */}
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

            {/* Approved banner */}
            {anaStatus === 'aprobado' && (
              <div className="rounded-2xl bg-g-50 border border-g-200 px-5 py-3.5 flex items-center gap-3">
                <CheckCircle size={18} className="text-g-600 shrink-0" />
                <p className="text-[13px] font-semibold text-g-800">Plan de carrera de Ana García aprobado</p>
              </div>
            )}

            {/* Changes requested banner */}
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
                {/* Add goal */}
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

            {/* Assign opportunities + feedback */}
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

/* ─── HR ADMIN TAB ──────────────────────────────────────────────── */
const HR_STATS = [
  { icon: Map,         value: '12', label: 'Rutas de carrera definidas', color: 'text-h-500'  },
  { icon: CheckCircle, value: '38', label: 'Empleados con plan activo',  color: 'text-g-600'  },
  { icon: RotateCw,    value: '7',  label: 'Planes en revisión',         color: 'text-y-600'  },
  { icon: Award,       value: '4',  label: 'Listos para promoción',      color: 'text-p-600'  },
]

const CAREER_PATHS = [
  {
    section: 'DESIGN',
    dept: 'Diseño',
    deptColor: '#496be3',
    deptBg: 'bg-h-50',
    items: [
      { id: 'jd', label: 'Junior Designer',    level: 'Nivel 1', count: 6,  dot: '#c5d4f8', desc: 'Aprendizaje y ejecución de tareas de diseño con supervisión.' },
      { id: 'pd', label: 'Product Designer',   level: 'Nivel 2', count: 14, dot: '#9db8f3', desc: 'Diseño de flujos y componentes con autonomía creciente.' },
      { id: 'sd', label: 'Senior Designer',    level: 'Nivel 3', count: 8,  dot: '#496be3', desc: 'Referente técnico de diseño y mentor del equipo.' },
      { id: 'dl', label: 'Design Lead',        level: 'Nivel 4', count: 3,  dot: '#29317f', desc: 'Liderazgo del equipo de diseño y visión estratégica.' },
    ],
  },
  {
    section: 'ENGINEERING',
    dept: 'Ingeniería',
    deptColor: '#35a48e',
    deptBg: 'bg-t-50',
    items: [
      { id: 'je', label: 'Junior Engineer',    level: 'Nivel 1', count: 9,  dot: '#a8ddd5', desc: 'Desarrollo de tareas técnicas bajo supervisión directa.' },
      { id: 'mie', label: 'Mid Engineer',      level: 'Nivel 2', count: 15, dot: '#6bc4b5', desc: 'Desarrollo autónomo de features de mediana complejidad.' },
      { id: 'se', label: 'Senior Engineer',    level: 'Nivel 3', count: 12, dot: '#35a48e', desc: 'Referente técnico, define estándares y revisa código.' },
      { id: 'le', label: 'Lead Engineer',      level: 'Nivel 4', count: 5,  dot: '#1f5049', desc: 'Liderazgo técnico del equipo e impacto cross-funcional.' },
    ],
  },
  {
    section: 'PRODUCT',
    dept: 'Producto',
    deptColor: '#886bff',
    deptBg: 'bg-p-50',
    items: [
      { id: 'apm', label: 'Associate PM',      level: 'Nivel 2', count: 4,  dot: '#c5b8ff', desc: 'Soporte en la definición y seguimiento de producto.' },
      { id: 'pm',  label: 'Product Manager',   level: 'Nivel 3', count: 7,  dot: '#886bff', desc: 'Ownership de producto, roadmap y stakeholders.' },
      { id: 'spm', label: 'Senior PM',         level: 'Nivel 4', count: 3,  dot: '#5a3fd4', desc: 'Visión estratégica de producto y liderazgo de área.' },
    ],
  },
  {
    section: 'MARKETING',
    dept: 'Marketing',
    deptColor: '#e3498b',
    deptBg: 'bg-r-50',
    items: [
      { id: 'mc',  label: 'Marketing Coordinator', level: 'Nivel 1', count: 5, dot: '#f4a8c9', desc: 'Ejecución de campañas y apoyo en estrategia de marca.' },
      { id: 'ms',  label: 'Marketing Specialist',  level: 'Nivel 2', count: 8, dot: '#e3498b', desc: 'Gestión de canales, análisis de métricas y campañas.' },
      { id: 'ml',  label: 'Marketing Lead',         level: 'Nivel 3', count: 3, dot: '#a0205f', desc: 'Estrategia de marketing y liderazgo del equipo.' },
    ],
  },
  {
    section: 'PEOPLE',
    dept: 'People',
    deptColor: '#de920c',
    deptBg: 'bg-y-50',
    items: [
      { id: 'hrbp', label: 'HR Business Partner', level: 'Nivel 3', count: 4, dot: '#de920c', desc: 'Partner estratégico de negocio para el área de personas.' },
      { id: 'po',   label: 'People Operations',   level: 'Nivel 2', count: 6, dot: '#f5c06a', desc: 'Operaciones de RRHH, onboarding y procesos internos.' },
    ],
  },
  {
    section: 'SALES',
    dept: 'Ventas',
    deptColor: '#d42e2e',
    deptBg: 'bg-r-50',
    items: [
      { id: 'sdr', label: 'SDR',                level: 'Nivel 1', count: 10, dot: '#f4a0a0', desc: 'Prospección y generación de oportunidades de venta.' },
      { id: 'ae',  label: 'Account Executive',  level: 'Nivel 2', count: 8,  dot: '#d42e2e', desc: 'Cierre de ventas y gestión de cuentas estratégicas.' },
      { id: 'sm',  label: 'Sales Manager',      level: 'Nivel 3', count: 3,  dot: '#8b1c1c', desc: 'Liderazgo del equipo comercial y estrategia de ventas.' },
    ],
  },
]

const PROGRESSION = [
  { initials: 'AG', name: 'Ana García',   role: 'Product Designer', pct: 60, status: 'En revisión',          statusClass: 'bg-y-100 text-y-700',  est: 'Q3 2026', color: 'bg-h-100 text-h-600' },
  { initials: 'RD', name: 'Raj Desai',    role: 'Product Designer', pct: 85, status: 'Listo para promoción',  statusClass: 'bg-g-100 text-g-800',  est: 'Q2 2026', color: 'bg-t-100 text-t-800' },
  { initials: 'PT', name: 'Paula Torres', role: 'Junior Designer',  pct: 30, status: 'En progreso',           statusClass: 'bg-h-100 text-h-800',  est: 'Q4 2026', color: 'bg-p-100 text-p-500' },
]

const REQUIRED_SKILLS = ['Visual Design', 'Prototyping', 'UX Research', 'Figma Advanced', 'Stakeholder Mgmt', 'Design Systems']

const DEFAULT_PATH_DATA = {
  sd: { skills: ['Visual Design','Prototyping','UX Research','Figma Advanced','Stakeholder Mgmt','Design Systems'], minExp: '3+ años', perf: '≥ 80%', approval: 'Manager + HR' },
  pd: { skills: ['Visual Design','Prototyping','Figma','User Research','Communication'], minExp: '1+ años', perf: '≥ 70%', approval: 'Manager' },
  jd: { skills: ['Figma Basics','Visual Design','Teamwork'], minExp: '0+ años', perf: '≥ 60%', approval: 'Manager' },
  dl: { skills: ['Team Leadership','Design Strategy','Mentorship','Design Systems','Stakeholder Mgmt','Roadmap Planning'], minExp: '5+ años', perf: '≥ 85%', approval: 'Manager + HR' },
  se: { skills: ['React','TypeScript','Node.js','System Design','Code Review','Agile/Scrum'], minExp: '3+ años', perf: '≥ 80%', approval: 'Manager + HR' },
  le: { skills: ['Technical Leadership','Architecture','Mentorship','React','TypeScript','Roadmap Planning'], minExp: '5+ años', perf: '≥ 85%', approval: 'Manager + HR' },
  pm: { skills: ['Product Strategy','Roadmapping','Stakeholder Mgmt','Data Analysis','Agile/Scrum','Market Research'], minExp: '3+ años', perf: '≥ 80%', approval: 'Manager + HR' },
}


/* ─── COMPETENCY FRAMEWORK BUILDER ─────────────────────────────── */
const CAT_OPTIONS = ['Técnico', 'Liderazgo', 'Soft Skills', 'Estrategia', 'Otro']
const CAT_COLORS  = { 'Técnico': 'bg-h-50 text-h-800', 'Liderazgo': 'bg-p-50 text-p-800', 'Soft Skills': 'bg-t-50 text-t-800', 'Estrategia': 'bg-y-50 text-y-700', 'Otro': 'bg-n-100 text-n-800' }

function CompetencyBuilder({ naked = false }) {
  const { competencies, setCompetencies } = useApp()
  const [selected, setSelected]   = useState(competencies[0]?.id ?? null)
  const [editingComp, setEditingComp] = useState(null)   // id being edited, or 'new'
  const [compDraft, setCompDraft] = useState({ name: '', category: 'Técnico', description: '' })
  const [newSkillText, setNewSkillText] = useState('')
  const [editingSkill, setEditingSkill] = useState(null) // { compId, skillId }
  const [skillDraft, setSkillDraft]     = useState({ name: '', description: '' })

  const selComp = competencies.find(c => c.id === selected)

  /* Competency CRUD */
  const saveComp = () => {
    if (!compDraft.name.trim()) return
    if (editingComp === 'new') {
      const next = { ...compDraft, id: Date.now(), skills: [] }
      setCompetencies(p => [...p, next])
      setSelected(next.id)
    } else {
      setCompetencies(p => p.map(c => c.id === editingComp ? { ...c, ...compDraft } : c))
    }
    setEditingComp(null)
  }
  const deleteComp = (id) => {
    setCompetencies(p => p.filter(c => c.id !== id))
    if (selected === id) setSelected(competencies.find(c => c.id !== id)?.id ?? null)
  }
  const startNewComp = () => { setCompDraft({ name: '', category: 'Técnico', description: '' }); setEditingComp('new') }
  const startEditComp = (c) => { setCompDraft({ name: c.name, category: c.category, description: c.description }); setEditingComp(c.id) }

  /* Skill CRUD */
  const addSkill = (compId) => {
    if (!newSkillText.trim()) return
    setCompetencies(p => p.map(c => c.id === compId
      ? { ...c, skills: [...c.skills, { id: Date.now(), name: newSkillText.trim(), description: '' }] }
      : c))
    setNewSkillText('')
  }
  const deleteSkill = (compId, skillId) => {
    setCompetencies(p => p.map(c => c.id === compId ? { ...c, skills: c.skills.filter(s => s.id !== skillId) } : c))
  }
  const saveSkill = () => {
    if (!skillDraft.name.trim() || !editingSkill) return
    setCompetencies(p => p.map(c => c.id === editingSkill.compId
      ? { ...c, skills: c.skills.map(s => s.id === editingSkill.skillId ? { ...s, ...skillDraft } : s) }
      : c))
    setEditingSkill(null)
  }

  return (
    <div className="flex gap-5">
      {/* LEFT: list */}
      <div style={{ width: 240 }} className="shrink-0">
        <div className={naked ? '' : 'bg-white rounded-2xl shadow-4dp overflow-hidden'}>
          <div className={`flex items-center justify-between ${naked ? 'mb-2' : 'px-4 py-3.5 border-b border-n-100'}`}>
            <span className="text-[13px] font-semibold text-n-950">Competencias</span>
            <button onClick={startNewComp} className="h-7 px-2.5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1">
              <Plus size={11} /> Nueva
            </button>
          </div>
          <div className={`flex flex-col gap-0.5 ${naked ? '' : 'p-2'}`}>
            {competencies.map(c => (
              <div key={c.id} onClick={() => setSelected(c.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors group ${selected === c.id ? 'bg-h-50' : 'hover:bg-n-50'}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-n-950 truncate">{c.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0 rounded-full ${CAT_COLORS[c.category] || 'bg-n-100 text-n-800'}`}>{c.category}</span>
                </div>
                <span className="text-[10px] text-n-500 shrink-0">{c.skills.length} skills</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: detail / editor */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {/* Inline form for new/edit competency */}
        {editingComp && (
          <div className="bg-h-50 border-2 border-h-200 rounded-2xl p-5 animate-slide-in">
            <p className="text-[13px] font-semibold text-h-800 mb-3">{editingComp === 'new' ? 'Nueva Competencia' : 'Editar Competencia'}</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] font-semibold text-n-700 uppercase tracking-wide mb-1 block">Nombre *</label>
                <input value={compDraft.name} onChange={e => setCompDraft(d => ({ ...d, name: e.target.value }))} placeholder="Ej: Diseño Visual" className="input-humand" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-n-700 uppercase tracking-wide mb-1 block">Categoría</label>
                <select value={compDraft.category} onChange={e => setCompDraft(d => ({ ...d, category: e.target.value }))} className="input-humand">
                  {CAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-semibold text-n-700 uppercase tracking-wide mb-1 block">Descripción</label>
                <input value={compDraft.description} onChange={e => setCompDraft(d => ({ ...d, description: e.target.value }))} placeholder="Descripción breve..." className="input-humand" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingComp(null)} className="h-8 px-3 text-[12px] font-semibold text-n-800 hover:text-n-950 rounded-lg hover:bg-n-100 transition">Cancelar</button>
              <button onClick={saveComp} className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition">Guardar</button>
            </div>
          </div>
        )}

        {selComp && !editingComp && (
          <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
            <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-n-950">{selComp.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CAT_COLORS[selComp.category] || 'bg-n-100 text-n-800'}`}>{selComp.category}</span>
                </div>
                {selComp.description && <p className="text-[11px] text-n-600 mt-0.5">{selComp.description}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEditComp(selComp)} className="p-1.5 text-n-500 hover:text-h-600 hover:bg-h-50 rounded-lg transition"><Edit3 size={14} /></button>
                <button onClick={() => deleteComp(selComp.id)} className="p-1.5 text-n-500 hover:text-r-600 hover:bg-r-50 rounded-lg transition"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Habilidades ({selComp.skills.length})</p>
              <div className="flex flex-col gap-2 mb-4">
                {selComp.skills.length === 0 && <p className="text-xs text-n-500 italic">Sin habilidades aún. Agregá la primera abajo.</p>}
                {selComp.skills.map(sk => (
                  <div key={sk.id}>
                    {editingSkill?.skillId === sk.id ? (
                      <div className="flex gap-2 items-center bg-n-50 p-2 rounded-lg">
                        <input value={skillDraft.name} onChange={e => setSkillDraft(d => ({ ...d, name: e.target.value }))} className="input-humand flex-1" style={{ height: 32 }} />
                        <input value={skillDraft.description} onChange={e => setSkillDraft(d => ({ ...d, description: e.target.value }))} placeholder="Descripción" className="input-humand flex-1" style={{ height: 32 }} />
                        <button onClick={saveSkill} className="h-8 px-3 bg-h-500 text-white rounded-lg text-[12px] font-semibold hover:bg-h-600 transition shrink-0">OK</button>
                        <button onClick={() => setEditingSkill(null)} className="text-n-500 hover:text-n-950"><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-n-100 hover:border-n-200 group transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-h-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-n-950">{sk.name}</p>
                          {sk.description && <p className="text-[11px] text-n-600">{sk.description}</p>}
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingSkill({ compId: selComp.id, skillId: sk.id }); setSkillDraft({ name: sk.name, description: sk.description }) }}
                            className="p-1 text-n-500 hover:text-h-600 rounded transition"><Edit3 size={12} /></button>
                          <button onClick={() => deleteSkill(selComp.id, sk.id)}
                            className="p-1 text-n-500 hover:text-r-600 rounded transition"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Add skill inline */}
              <div className="flex gap-2">
                <input value={newSkillText} onChange={e => setNewSkillText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill(selComp.id)}
                  placeholder="Nombre de nueva habilidad..." className="input-humand flex-1" style={{ height: 36 }} />
                <button onClick={() => addSkill(selComp.id)}
                  className="h-9 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition flex items-center gap-1">
                  <Plus size={13} /> Agregar
                </button>
              </div>
            </div>
          </div>
        )}

        {!selComp && !editingComp && (
          <div className="bg-white rounded-2xl shadow-4dp flex items-center justify-center py-16 text-n-500">
            <p className="text-sm">Seleccioná una competencia o creá una nueva</p>
          </div>
        )}
      </div>
    </div>
  )
}

const SEVERITY_STYLE = {
  alto:  { bar: 'border-l-4 border-r-600 bg-r-50',  badge: 'bg-r-50 text-r-600',  btn: 'bg-r-600 hover:bg-r-700' },
  medio: { bar: 'border-l-4 border-y-400 bg-y-50',  badge: 'bg-y-50 text-y-700',  btn: 'bg-y-500 hover:bg-y-600' },
}

/* ─── SALUD ORGANIZACIONAL ───────────────────────────────────────── */
const TEAM_HEALTH = [
  {
    team: 'Product Design', engagement: 82, planActivo: 75, retencion: 91, riesgo: 'bajo', manager: 'Valentina Cruz',
    members: [
      { name: 'Sofia Carro',    initials: 'SC', color: 'bg-h-100 text-h-700', role: 'Mid Designer',    plan: { active: true,  title: 'Avanzar a Senior Designer',     progress: 68, nextLevel: 'Senior' } },
      { name: 'Ana Martínez',   initials: 'AM', color: 'bg-p-100 text-p-700', role: 'Senior Designer', plan: { active: true,  title: 'Avanzar a Lead Designer',       progress: 45, nextLevel: 'Lead'   } },
      { name: 'Tomás Ríos',     initials: 'TR', color: 'bg-g-100 text-g-800', role: 'Junior Designer', plan: { active: true,  title: 'Avanzar a Mid Designer',        progress: 30, nextLevel: 'Mid'    } },
      { name: 'Lucía Pérez',    initials: 'LP', color: 'bg-y-100 text-y-700', role: 'Junior Designer', plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
    ],
  },
  {
    team: 'Frontend Engineering', engagement: 74, planActivo: 60, retencion: 84, riesgo: 'medio', manager: 'Martina Sol',
    members: [
      { name: 'Carlos Ruiz',    initials: 'CR', color: 'bg-h-100 text-h-700', role: 'Mid Frontend',    plan: { active: true,  title: 'Avanzar a Senior Frontend',     progress: 55, nextLevel: 'Senior' } },
      { name: 'Martina Sol',    initials: 'MS', color: 'bg-t-100 text-t-700', role: 'Senior Frontend', plan: { active: true,  title: 'Especialización en Arquitectura', progress: 72, nextLevel: 'Lead'  } },
      { name: 'Diego Vega',     initials: 'DV', color: 'bg-p-100 text-p-700', role: 'Junior Frontend', plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Paula Méndez',   initials: 'PM', color: 'bg-r-100 text-r-600', role: 'Mid Frontend',    plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Nicolás Vidal',  initials: 'NV', color: 'bg-g-100 text-g-800', role: 'Junior Frontend', plan: { active: true,  title: 'Avanzar a Mid Frontend',        progress: 22, nextLevel: 'Mid'    } },
    ],
  },
  {
    team: 'Backend Engineering', engagement: 68, planActivo: 45, retencion: 78, riesgo: 'alto', manager: 'Fernanda Ortiz',
    members: [
      { name: 'Rodrigo Blanco', initials: 'RB', color: 'bg-n-200 text-n-700', role: 'Mid Backend',     plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Fernanda Ortiz', initials: 'FO', color: 'bg-h-100 text-h-700', role: 'Senior Backend',  plan: { active: true,  title: 'Tech Lead Backend',             progress: 40, nextLevel: 'Lead'   } },
      { name: 'Gustavo Sosa',   initials: 'GS', color: 'bg-n-200 text-n-700', role: 'Junior Backend',  plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Emilia Castro',  initials: 'EC', color: 'bg-p-100 text-p-700', role: 'Mid Backend',     plan: { active: true,  title: 'Avanzar a Senior Backend',      progress: 60, nextLevel: 'Senior' } },
    ],
  },
  {
    team: 'Data & Analytics', engagement: 79, planActivo: 70, retencion: 88, riesgo: 'bajo', manager: 'Matías Leal',
    members: [
      { name: 'Valentina Cruz', initials: 'VC', color: 'bg-t-100 text-t-700', role: 'Data Analyst',    plan: { active: true,  title: 'Avanzar a Senior Analyst',      progress: 65, nextLevel: 'Senior' } },
      { name: 'Matías Leal',    initials: 'ML', color: 'bg-h-100 text-h-700', role: 'Senior Analyst',  plan: { active: true,  title: 'Data Science Lead',             progress: 50, nextLevel: 'Lead'   } },
      { name: 'Camila Rojas',   initials: 'CR', color: 'bg-g-100 text-g-800', role: 'Junior Analyst',  plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
    ],
  },
  {
    team: 'People & Culture', engagement: 88, planActivo: 90, retencion: 94, riesgo: 'bajo', manager: 'Sebastián Gil',
    members: [
      { name: 'Laura Romero',   initials: 'LR', color: 'bg-p-100 text-p-700', role: 'HR Specialist',   plan: { active: true,  title: 'Avanzar a HR Business Partner', progress: 80, nextLevel: 'Senior' } },
      { name: 'Sebastián Gil',  initials: 'SG', color: 'bg-h-100 text-h-700', role: 'Talent Manager',  plan: { active: true,  title: 'Head of People',                progress: 55, nextLevel: 'Lead'   } },
      { name: 'Agustina Mora',  initials: 'AM', color: 'bg-g-100 text-g-800', role: 'HR Analyst',      plan: { active: true,  title: 'Avanzar a HR Specialist',       progress: 70, nextLevel: 'Mid'    } },
    ],
  },
  {
    team: 'Growth Marketing', engagement: 65, planActivo: 40, retencion: 75, riesgo: 'alto', manager: 'Renata Lagos',
    members: [
      { name: 'Ignacio Funes',  initials: 'IF', color: 'bg-n-200 text-n-700', role: 'Growth Analyst',  plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Renata Lagos',   initials: 'RL', color: 'bg-y-100 text-y-700', role: 'Growth Manager',  plan: { active: true,  title: 'Head of Growth',                progress: 35, nextLevel: 'Lead'   } },
      { name: 'Bruno Espejo',   initials: 'BE', color: 'bg-n-200 text-n-700', role: 'Junior Growth',   plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Daniela Vera',   initials: 'DV', color: 'bg-r-100 text-r-600', role: 'Content Manager', plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Tomás Herrera',  initials: 'TH', color: 'bg-h-100 text-h-700', role: 'SEO Specialist',  plan: { active: true,  title: 'Avanzar a Senior Growth',       progress: 28, nextLevel: 'Senior' } },
    ],
  },
]
const RIESGO_BADGE = { bajo: 'bg-g-50 text-g-800', medio: 'bg-y-50 text-y-700', alto: 'bg-r-50 text-r-600' }
const ENG_THRESHOLD = 70   // engagement < 70 = bajo
const PLAN_THRESHOLD = 0.5 // > 50% sin plan = baja actividad

function computeRiskAlerts() {
  const alerts = []
  TEAM_HEALTH.forEach(t => {
    const sinPlan = t.members.filter(m => !m.plan.active).length
    const sinPlanPct = sinPlan / t.members.length
    if (t.engagement < ENG_THRESHOLD)
      alerts.push({ id: `eng-${t.team}`, team: t.team, manager: t.manager, severity: t.engagement < 60 ? 'alto' : 'medio',
        type: 'Engagement bajo', message: `Engagement del equipo en ${t.engagement}% (umbral: ${ENG_THRESHOLD}%)`, Icon: TrendingDown })
    if (sinPlanPct > PLAN_THRESHOLD)
      alerts.push({ id: `plan-${t.team}`, team: t.team, manager: t.manager, severity: sinPlanPct > 0.7 ? 'alto' : 'medio',
        type: 'Baja actividad', message: `${sinPlan} de ${t.members.length} integrantes sin plan activo`, Icon: AlertTriangle })
    if (t.riesgo === 'alto' && t.engagement >= ENG_THRESHOLD && sinPlanPct <= PLAN_THRESHOLD)
      alerts.push({ id: `riesgo-${t.team}`, team: t.team, manager: t.manager, severity: 'alto',
        type: 'Equipo en riesgo', message: `Retención proyectada en ${t.retencion}% — requiere atención`, Icon: AlertCircle })
  })
  return alerts
}

function SaludOrganizacional() {
  const { resolvedAlerts, setResolvedAlerts } = useApp()
  const [expanded, setExpanded] = useState(null)
  const [sent, setSent] = useState({})          // { alertId: true } = notificación enviada
  const toggle = (team) => setExpanded(e => e === team ? null : team)
  const avg = (key) => Math.round(TEAM_HEALTH.reduce((a, t) => a + t[key], 0) / TEAM_HEALTH.length)
  const riesgoAlto = TEAM_HEALTH.filter(t => t.riesgo === 'alto').length

  const allAlerts   = computeRiskAlerts()
  const activeAlerts = allAlerts.filter(a => !resolvedAlerts.includes(a.id))

  const sendNotification = (alert) => {
    setSent(s => ({ ...s, [alert.id]: true }))
    // persiste en resolvedAlerts después de 3s para simular "enviada y procesada"
    setTimeout(() => setResolvedAlerts(r => [...r, alert.id]), 3000)
  }
  const resolveAlert = (id) => setResolvedAlerts(r => [...r, id])

  return (
    <div className="flex flex-col gap-5">

      {/* ── Alertas de riesgo automáticas ── */}
      {activeAlerts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
          <div className="px-5 py-3.5 border-b border-n-100 flex items-center gap-2">
            <AlertOctagon size={16} className="text-r-600" />
            <p className="text-[13px] font-semibold text-n-950 flex-1">Alertas de riesgo detectadas</p>
            <span className="text-[11px] font-bold bg-r-50 text-r-600 px-2 py-0.5 rounded-full">{activeAlerts.length} activas</span>
          </div>
          <div className="divide-y divide-n-50">
            {activeAlerts.map(alert => {
              const st = SEVERITY_STYLE[alert.severity]
              const wasSent = sent[alert.id]
              return (
                <div key={alert.id} className={`flex items-start gap-4 px-5 py-4 ${st.bar}`}>
                  <alert.Icon size={18} className="shrink-0 mt-0.5 text-current" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.badge}`}>{alert.severity.toUpperCase()}</span>
                      <span className="text-[12px] font-semibold text-n-950">{alert.type} — {alert.team}</span>
                    </div>
                    <p className="text-[12px] text-n-600">{alert.message}</p>
                    <p className="text-[11px] text-n-500 mt-0.5">Manager: <span className="font-semibold text-n-800">{alert.manager}</span></p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {wasSent ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-g-700 bg-g-50 px-3 py-1.5 rounded-lg">
                        <Check size={13} /> Notificación enviada
                      </span>
                    ) : (
                      <button onClick={() => sendNotification(alert)}
                        className={`h-8 px-3 text-white text-[12px] font-semibold rounded-lg transition ${st.btn}`}>
                        Notificar a {alert.manager.split(' ')[0]}
                      </button>
                    )}
                    <button onClick={() => resolveAlert(alert.id)} className="text-n-400 hover:text-n-700 text-xs transition px-2">Ignorar</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeAlerts.length === 0 && (
        <div className="flex items-center gap-3 px-5 py-4 bg-g-50 border border-g-200 rounded-2xl">
          <CheckCircle size={18} className="text-g-600" />
          <p className="text-[13px] font-semibold text-g-800">Sin alertas activas — todos los equipos dentro de los umbrales normales</p>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Engagement promedio', value: `${avg('engagement')}%`, sub: '+3% vs mes anterior',    color: 'text-h-600' },
          { label: '% con plan activo',    value: `${avg('planActivo')}%`, sub: `${TEAM_HEALTH.filter(t => t.planActivo >= 60).length}/${TEAM_HEALTH.length} equipos`, color: 'text-g-800' },
          { label: 'Retención proyectada', value: `${avg('retencion')}%`, sub: 'Próximos 12 meses',      color: 'text-t-700' },
          { label: 'Equipos en riesgo',    value: riesgoAlto,             sub: 'Requieren atención',     color: 'text-r-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[12px] font-semibold text-n-950 mt-1">{s.label}</p>
            <p className="text-[11px] text-n-600">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Accordion by team */}
      <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
        <div className="px-6 py-4 border-b border-n-100">
          <p className="text-[13px] font-semibold text-n-950">Salud por equipo</p>
          <p className="text-[11px] text-n-600">Hacé click en un equipo para ver sus integrantes y planes de carrera</p>
        </div>
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_32px] items-center px-6 py-2.5 border-b border-n-100 bg-n-50">
          {['Equipo','Engagement','Plan activo','Riesgo',''].map(h => (
            <span key={h} className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">{h}</span>
          ))}
        </div>
        {/* Rows */}
        <div className="divide-y divide-n-50">
          {TEAM_HEALTH.map(t => {
            const open = expanded === t.team
            const withPlan = t.members.filter(m => m.plan.active).length
            return (
              <div key={t.team}>
                {/* Team row */}
                <button
                  onClick={() => toggle(t.team)}
                  className={`w-full grid grid-cols-[2fr_1fr_1fr_1fr_32px] items-center px-6 py-3.5 text-left transition-colors ${open ? 'bg-h-50' : 'hover:bg-n-50'}`}
                >
                  <div className="flex items-center gap-2">
                    {open ? <ChevronDown size={14} className="text-h-500 shrink-0" /> : <ChevronRight size={14} className="text-n-400 shrink-0" />}
                    <span className="text-[13px] font-semibold text-n-950">{t.team}</span>
                    <span className="text-[10px] text-n-500 font-medium">{t.members.length} personas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-n-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${t.engagement}%`, backgroundColor: t.engagement >= 80 ? '#35a48e' : t.engagement >= 70 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                    <span className="text-[12px] text-n-600">{t.engagement}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-n-100 rounded-full overflow-hidden">
                      <div className="h-full bg-h-500 rounded-full" style={{ width: `${t.planActivo}%` }} />
                    </div>
                    <span className="text-[12px] text-n-600">{withPlan}/{t.members.length}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize w-fit ${RIESGO_BADGE[t.riesgo]}`}>{t.riesgo}</span>
                  <span />
                </button>

                {/* Members panel */}
                {open && (
                  <div className="bg-h-50 border-t border-h-100 px-6 py-4 animate-fade-in">
                    <div className="grid grid-cols-[2fr_2fr_1fr_80px] gap-2 px-3 pb-2">
                      {['Integrante','Plan de carrera','Siguiente nivel','Progreso'].map(h => (
                        <span key={h} className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">{h}</span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {t.members.map(m => (
                        <div key={m.name} className={`grid grid-cols-[2fr_2fr_1fr_80px] gap-2 items-center px-3 py-2.5 rounded-xl border ${m.plan.active ? 'bg-white border-n-100' : 'bg-n-50 border-n-100 opacity-75'}`}>
                          {/* Member */}
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${m.color}`}>{m.initials}</div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-semibold text-n-950 truncate">{m.name}</p>
                              <p className="text-[10px] text-n-500 truncate">{m.role}</p>
                            </div>
                          </div>
                          {/* Plan title */}
                          <div className="flex items-center gap-1.5">
                            {m.plan.active
                              ? <span className="text-[12px] text-n-800 truncate">{m.plan.title}</span>
                              : <span className="text-[11px] text-n-400 italic">Sin plan asignado</span>}
                          </div>
                          {/* Next level */}
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${m.plan.active ? 'bg-h-50 text-h-700' : 'bg-n-100 text-n-400'}`}>{m.plan.nextLevel}</span>
                          {/* Progress */}
                          {m.plan.active ? (
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 h-1.5 bg-n-100 rounded-full overflow-hidden">
                                <div className="h-full bg-h-500 rounded-full" style={{ width: `${m.plan.progress}%` }} />
                              </div>
                              <span className="text-[11px] font-semibold text-h-600 w-7 text-right shrink-0">{m.plan.progress}%</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-n-300">—</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}

/* ─── HEADCOUNT PLANNING ─────────────────────────────────────────── */
const ROLES_CATALOG = [
  { id: 'sr-designer', label: 'Senior Designer',      area: 'Design',      requiredSkills: ['Figma','Prototyping','Design Systems','UX Research','Stakeholder Mgmt'] },
  { id: 'tech-lead',   label: 'Tech Lead Frontend',   area: 'Engineering', requiredSkills: ['React','TypeScript','Liderazgo','Arquitectura','Mentoring'] },
  { id: 'pm',          label: 'Product Manager',      area: 'Product',     requiredSkills: ['Roadmapping','Stakeholder Mgmt','Agile','Data Analysis','Comunicación'] },
]
const INT_CANDIDATES = [
  { name: 'Ana Martínez', current: 'Mid Designer',     initials: 'AM', color: 'bg-h-100 text-h-700', skills: ['Figma','Prototyping','Design Systems','UX Research'] },
  { name: 'Luis Torres',  current: 'Senior Designer',  initials: 'LT', color: 'bg-p-100 text-p-700', skills: ['Figma','Prototyping','Design Systems','UX Research','Stakeholder Mgmt'] },
  { name: 'María Gómez',  current: 'Mid Designer',     initials: 'MG', color: 'bg-g-100 text-g-800', skills: ['Figma','Prototyping','UX Research'] },
  { name: 'Carlos Ruiz',  current: 'Junior Designer',  initials: 'CR', color: 'bg-y-100 text-y-700', skills: ['Figma','Prototyping'] },
]
function HeadcountPlanning() {
  const [selectedRole, setSelectedRole] = useState(ROLES_CATALOG[0].id)
  const role = ROLES_CATALOG.find(r => r.id === selectedRole)
  const candidates = INT_CANDIDATES.map(c => {
    const matched = c.skills.filter(s => role.requiredSkills.includes(s)).length
    const pct     = Math.round((matched / role.requiredSkills.length) * 100)
    return { ...c, pct, missingForRole: role.requiredSkills.filter(s => !c.skills.includes(s)) }
  }).sort((a, b) => b.pct - a.pct)
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-h-50 border border-h-100 rounded-2xl p-5 flex items-start gap-3">
        <span className="text-2xl shrink-0">🔍</span>
        <div>
          <p className="text-[13px] font-semibold text-h-800">Antes de abrir una búsqueda externa</p>
          <p className="text-[12px] text-h-700 mt-0.5">El sistema evalúa el alineamiento de competencias de candidatos internos al rol objetivo. Si hay candidatos con ≥ 80% de alineación, priorizá el desarrollo interno.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-4dp p-5">
        <p className="text-[11px] font-semibold text-n-600 uppercase tracking-widest mb-2">Rol a cubrir</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {ROLES_CATALOG.map(r => (
            <button key={r.id} onClick={() => setSelectedRole(r.id)}
              className={`h-9 px-4 rounded-xl text-[13px] font-semibold border transition-all ${selectedRole === r.id ? 'bg-h-500 text-white border-h-500 shadow-4dp' : 'bg-white text-n-800 border-n-200 hover:border-h-300'}`}>
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[11px] text-n-600 font-semibold">Skills requeridas:</span>
          {role.requiredSkills.map(s => (
            <span key={s} className="text-[11px] bg-h-500 text-white px-2.5 py-0.5 rounded-lg font-medium">{s}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold text-n-600 uppercase tracking-widest">Candidatos internos — ordenados por alineación</p>
        {candidates.map((c, i) => (
          <div key={c.name} className={`bg-white rounded-2xl shadow-4dp p-5 border transition-all ${c.pct >= 80 ? 'border-g-200 hover:shadow-8dp' : c.pct >= 60 ? 'border-y-200' : 'border-n-100'}`}>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${c.color}`}>{c.initials}</div>
                {i === 0 && <span className="absolute -top-1 -right-1 text-xs">⭐</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13px] font-semibold text-n-950">{c.name}</p>
                  {c.pct >= 80 && <span className="text-[10px] font-bold bg-g-50 text-g-800 px-2 py-0.5 rounded-full">Listo para promover</span>}
                  {c.pct >= 60 && c.pct < 80 && <span className="text-[10px] font-bold bg-y-50 text-y-700 px-2 py-0.5 rounded-full">Desarrollo a corto plazo</span>}
                  {c.pct < 60 && <span className="text-[10px] font-bold bg-n-100 text-n-600 px-2 py-0.5 rounded-full">Desarrollo a largo plazo</span>}
                </div>
                <p className="text-[11px] text-n-600">{c.current}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-2xl font-bold ${c.pct >= 80 ? 'text-g-700' : c.pct >= 60 ? 'text-y-600' : 'text-n-500'}`}>{c.pct}%</p>
                <p className="text-[10px] text-n-600">alineación</p>
              </div>
            </div>
            <div className="mt-3 w-full h-1.5 bg-n-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bar-fill" style={{ width: `${c.pct}%`, backgroundColor: c.pct >= 80 ? '#35a48e' : c.pct >= 60 ? '#f59e0b' : '#9ca3af' }} />
            </div>
            {c.missingForRole.length > 0 && (
              <div className="mt-2 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-n-500 font-semibold">Gaps:</span>
                {c.missingForRole.map(s => (
                  <span key={s} className="text-[10px] bg-h-500 text-white px-2.5 py-0.5 rounded-lg font-medium">{s}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── CONFIGURACIÓN DE VISIBILIDAD ──────────────────────────────── */
const VIS_MATRIX_DEFAULT = {
  L2:      { L1: true,  L2: false, L3: false, L4: false },
  L3:      { L1: true,  L2: true,  L3: false, L4: false },
  L4:      { L1: true,  L2: true,  L3: true,  L4: false },
  Manager: { L1: true,  L2: true,  L3: true,  L4: true  },
  HR:      { L1: true,  L2: true,  L3: true,  L4: true  },
}
const VIS_FIELDS_DEFAULT = {
  plan:     { label: 'Plan de carrera completo',   on: true  },
  progress: { label: 'Progreso en objetivos',      on: true  },
  goals:    { label: 'Objetivos personales',       on: true  },
  salary:   { label: 'Información salarial',       on: false },
  feedback: { label: 'Feedback recibido',          on: false },
  perf:     { label: 'Evaluaciones de desempeño',  on: true  },
}
function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${on ? 'bg-h-500' : 'bg-n-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  )
}
function ConfigVisibilidad() {
  const [matrix, setMatrix] = useState(VIS_MATRIX_DEFAULT)
  const [fields, setFields] = useState(VIS_FIELDS_DEFAULT)
  const [saved, setSaved]   = useState(false)
  const LEVELS  = ['L1','L2','L3','L4']
  const VIEWERS = ['L2','L3','L4','Manager','HR']
  const VIEWER_LABELS = { L2:'Mid (L2)', L3:'Senior (L3)', L4:'Lead (L4)', Manager:'Manager', HR:'HR Admin' }
  const toggle = (viewer, target) => setMatrix(m => ({ ...m, [viewer]: { ...m[viewer], [target]: !m[viewer][target] } }))
  const save   = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-y-50 border border-y-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle size={18} className="text-y-600 shrink-0" />
        <p className="text-[12px] text-y-800">Estas reglas definen qué información puede ver cada nivel sobre los planes del nivel inferior. Los cambios tienen impacto en toda la organización.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
        <div className="px-6 py-4 border-b border-n-100">
          <p className="text-[13px] font-semibold text-n-950">Matriz de visibilidad</p>
          <p className="text-[11px] text-n-600 mt-0.5">Filas = quién observa · Columnas = a quién puede ver</p>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-[10px] font-semibold text-n-600 uppercase tracking-widest pb-3 pr-8">Puede ver →</th>
                {LEVELS.map(l => <th key={l} className="text-center text-[10px] font-semibold text-n-600 uppercase tracking-widest pb-3 px-4">{l}</th>)}
              </tr>
            </thead>
            <tbody>
              {VIEWERS.map(viewer => (
                <tr key={viewer} className="border-t border-n-50">
                  <td className="py-3 pr-8 text-[12px] font-semibold text-n-950">{VIEWER_LABELS[viewer]}</td>
                  {LEVELS.map(target => {
                    const has = matrix[viewer]?.[target] !== undefined
                    return (
                      <td key={target} className="py-3 px-4 text-center">
                        {!has ? <span className="text-n-300 text-xs">—</span>
                          : <Toggle on={matrix[viewer][target]} onToggle={() => toggle(viewer, target)} />}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-4dp p-5">
        <p className="text-[13px] font-semibold text-n-950 mb-4">Visibilidad por tipo de dato</p>
        <div className="flex flex-col gap-1">
          {Object.entries(fields).map(([key, meta]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-n-50 last:border-0">
              <div>
                <p className="text-[13px] text-n-950">{meta.label}</p>
                {!meta.on && <p className="text-[11px] text-r-500">Solo visible para HR Admin</p>}
              </div>
              <Toggle on={meta.on} onToggle={() => setFields(f => ({ ...f, [key]: { ...f[key], on: !f[key].on } }))} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={save} className={`h-9 px-6 rounded-lg text-[13px] font-semibold transition-all shadow-4dp ${saved ? 'bg-g-500 text-white' : 'bg-h-500 hover:bg-h-600 text-white'}`}>
          {saved ? <span className="flex items-center gap-1"><Check size={14} /> Guardado</span> : 'Guardar configuración'}
        </button>
      </div>
    </div>
  )
}

/* ─── MÉTRICAS DE IMPACTO ────────────────────────────────────────── */
const MONTHLY_ADOPTION = [
  { month: 'Oct', pct: 38 }, { month: 'Nov', pct: 45 }, { month: 'Dic', pct: 52 },
  { month: 'Ene', pct: 58 }, { month: 'Feb', pct: 65 }, { month: 'Mar', pct: 72 },
]
const COMP_EVOLUTION = [
  { area: 'Diseño Visual',      before: 52, after: 71 },
  { area: 'Liderazgo',          before: 41, after: 63 },
  { area: 'Comunicación',       before: 60, after: 74 },
  { area: 'Desarrollo Técnico', before: 55, after: 78 },
  { area: 'Soft Skills',        before: 48, after: 65 },
]
const NPS_BY_TEAM = [
  { team: 'Product Design',       nps: 71, responses: 9  },
  { team: 'Frontend Engineering', nps: 58, responses: 12 },
  { team: 'Backend Engineering',  nps: 42, responses: 10 },
  { team: 'Data & Analytics',     nps: 65, responses: 8  },
  { team: 'People & Culture',     nps: 80, responses: 5  },
  { team: 'Growth Marketing',     nps: 38, responses: 4  },
]

function MetricasImpacto() {
  const NPS = 62
  const npsColor = NPS >= 50 ? 'text-g-700' : NPS >= 30 ? 'text-y-600' : 'text-r-600'
  const [showNPSDetail, setShowNPSDetail] = useState(false)
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '% con plan activo',    value: '72%',  sub: '+14% vs inicio año',     color: 'text-h-600' },
          { label: 'NPS del módulo',        value: NPS,    sub: 'Basado en 48 respuestas', color: npsColor    },
          { label: 'Retención (con plan)',  value: '91%',  sub: 'vs 74% sin plan',         color: 'text-g-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[12px] font-semibold text-n-950 mt-1">{s.label}</p>
            <p className="text-[11px] text-n-600">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-4dp p-5">
          <p className="text-[13px] font-semibold text-n-950 mb-1">Adopción — últimos 6 meses</p>
          <p className="text-[11px] text-n-600 mb-4">% de empleados con plan activo</p>
          <div className="flex items-end gap-2 h-32">
            {MONTHLY_ADOPTION.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-h-600">{m.pct}%</span>
                <div className="w-full bg-h-500 rounded-t-md" style={{ height: `${(m.pct / 100) * 96}px`, opacity: 0.55 + (m.pct / 250) }} />
                <span className="text-[10px] text-n-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-4dp p-5">
          <p className="text-[13px] font-semibold text-n-950 mb-1">NPS del módulo Career Path</p>
          <p className="text-[11px] text-n-600 mb-3">¿Recomendarías usar esta herramienta?</p>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <p className={`text-5xl font-bold ${npsColor}`}>{NPS}</p>
              <p className="text-[12px] text-n-600 mt-1">NPS Score</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Promotores (9-10)',  pct: 68, color: 'bg-g-400'  },
              { label: 'Neutrales (7-8)',     pct: 26, color: 'bg-y-400'  },
              { label: 'Detractores (0-6)',   pct:  6, color: 'bg-r-400'  },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-2">
                <span className="text-[11px] text-n-600 w-36 shrink-0">{r.label}</span>
                <div className="flex-1 h-1.5 bg-n-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.color} bar-fill`} style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-[11px] font-semibold text-n-950 w-7 text-right shrink-0">{r.pct}%</span>
              </div>
            ))}
          </div>

          {/* Team detail dropdown */}
          <div className="mt-3 border-t border-n-100 pt-3">
            <button
              onClick={() => setShowNPSDetail(o => !o)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-h-600 hover:text-h-700 transition-colors"
            >
              {showNPSDetail ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              Ver detalle por equipo
            </button>
            {showNPSDetail && (
              <div className="mt-3 flex flex-col gap-4">
                {[
                  { label: 'Promotores',  filter: t => t.nps >= 50, dot: 'bg-g-400', score: 'text-g-700' },
                  { label: 'Neutrales',   filter: t => t.nps >= 30 && t.nps < 50, dot: 'bg-y-400', score: 'text-y-600' },
                  { label: 'Detractores', filter: t => t.nps < 30,  dot: 'bg-r-400', score: 'text-r-600' },
                ].map(group => {
                  const teams = NPS_BY_TEAM.filter(group.filter)
                  if (!teams.length) return null
                  return (
                    <div key={group.label}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className={`w-2 h-2 rounded-full ${group.dot}`} />
                        <span className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{group.label}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 pl-3.5">
                        {teams.map(t => (
                          <div key={t.team} className="flex items-center gap-3">
                            <span className="text-[11px] text-n-700 flex-1">{t.team}</span>
                            <span className={`text-[11px] font-bold w-8 text-right shrink-0 ${group.score}`}>{t.nps}</span>
                            <span className="text-[10px] text-n-400 w-14 text-right shrink-0">{t.responses} resp.</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-4dp p-5">
        <p className="text-[13px] font-semibold text-n-950 mb-1">Planes de carrera más utilizados</p>
        <p className="text-[11px] text-n-600 mb-4">Rutas con mayor adopción activa en la organización</p>
        {(() => {
          const data = [
            { label: 'Mid → Sr. Designer',  count: 18 },
            { label: 'Jr. → Mid Engineer',  count: 15 },
            { label: 'Sr. → Lead Eng.',     count: 11 },
            { label: 'Assoc. → PM',         count: 9  },
            { label: 'Mid → Sr. Frontend',  count: 8  },
            { label: 'Growth → Manager',    count: 5  },
          ]
          const maxVal = Math.max(...data.map(d => d.count))
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-n-400">Ruta</span>
                <span className="text-[10px] text-n-400">Nº de colaboradores activos</span>
              </div>
              {data.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="text-[12px] text-n-700 w-40 shrink-0">{d.label}</span>
                  <div className="flex-1 h-6 bg-n-50 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-h-500 rounded-lg bar-fill flex items-center justify-end pr-2"
                      style={{ width: `${(d.count / maxVal) * 100}%` }}
                    >
                      <span className="text-[11px] font-bold text-white">{d.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })()}
      </div>
      <div className="bg-white rounded-2xl shadow-4dp p-5">
        <p className="text-[13px] font-semibold text-n-950 mb-1">Correlación con retención</p>
        <p className="text-[11px] text-n-600 mb-4">Empleados con plan activo tienen 17pp más de retención proyectada</p>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Con plan activo', value: 91, color: 'bg-h-500', textColor: 'text-h-600' },
            { label: 'Sin plan activo', value: 74, color: 'bg-n-300', textColor: 'text-n-500' },
          ].map(b => (
            <div key={b.label} className="flex flex-col items-center gap-2">
              <p className={`text-4xl font-bold ${b.textColor}`}>{b.value}%</p>
              <div className="w-full h-2 bg-n-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${b.color} bar-fill`} style={{ width: `${b.value}%` }} />
              </div>
              <p className="text-[12px] text-n-600">{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



/* ─── NEW CAREER PATH WIZARD ─────────────────────────────────────── */
const NEW_PATH_STEPS = ['Info básica', 'Skills', 'Requisitos', 'Revisión']

const AREAS = ['Design', 'Engineering', 'Product', 'Marketing', 'Sales', 'Operations', 'People', 'Finance']
const LEVELS = [
  { value: 'L1', label: 'L1 — Junior'     },
  { value: 'L2', label: 'L2 — Mid'        },
  { value: 'L3', label: 'L3 — Senior'     },
  { value: 'L4', label: 'L4 — Lead'       },
  { value: 'L5', label: 'L5 — Principal'  },
]
const DOT_COLORS = ['#496be3','#28c040','#886bff','#de920c','#d42e2e','#35a48e','#e3498b','#cbcdd6']
const SKILL_SUGGESTIONS = [
  'Figma','Prototyping','Design Systems','UX Research','Stakeholder Mgmt',
  'React','TypeScript','Node.js','SQL','AWS','Python','Data Analysis',
  'Liderazgo','Comunicación','Presentaciones','Negociación','Mentoría',
  'Agile/Scrum','Roadmapping','Product Strategy','Brand Strategy',
]

function NewCareerPathWizard({ onClose, onSave }) {
  const [step, setStep]       = useState(0)
  const [name, setName]       = useState('')
  const [area, setArea]       = useState('')
  const [level, setLevel]     = useState('L2')
  const [desc, setDesc]       = useState('')
  const [dot, setDot]         = useState('#496be3')
  const [skills, setSkills]   = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [minExp, setMinExp]   = useState('2+ años')
  const [perf, setPerf]       = useState('≥ 75%')
  const [approval, setApproval] = useState('Manager + HR')

  const addSkill = (s) => {
    const trimmed = s.trim()
    if (trimmed && !skills.includes(trimmed)) setSkills(prev => [...prev, trimmed])
    setSkillInput('')
  }
  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s))

  const canNext = [
    name.trim() !== '' && area !== '',   // step 0
    skills.length > 0,                   // step 1
    true,                                // step 2
    true,                                // step 3
  ]

  const levelLabel = LEVELS.find(l => l.value === level)?.label || level

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-n-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-8dp w-full max-w-xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-n-100">
          <div>
            <p className="text-[11px] font-semibold text-n-500 uppercase tracking-widest">Nuevo career path</p>
            <p className="text-[15px] font-bold text-n-950 mt-0.5">{NEW_PATH_STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-n-100 transition-colors">
            <X size={16} className="text-n-600" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-1.5 px-6 pt-4">
          {NEW_PATH_STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col gap-1">
              <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-h-500' : 'bg-n-100'}`} />
              <p className={`text-[10px] font-medium ${i === step ? 'text-h-600' : 'text-n-400'}`}>{s}</p>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="px-6 py-5 min-h-[280px] flex flex-col gap-4">

          {/* Step 0 — Info básica */}
          {step === 0 && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-n-700">Nombre del career path *</label>
                <input
                  className="input-humand"
                  placeholder="ej. Senior Designer, Engineering Manager…"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-n-700">Área *</label>
                  <select className="input-humand" value={area} onChange={e => setArea(e.target.value)}>
                    <option value="">Seleccionar…</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-n-700">Nivel</label>
                  <select className="input-humand" value={level} onChange={e => setLevel(e.target.value)}>
                    {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-n-700">Descripción</label>
                <textarea
                  className="input-humand resize-none h-20"
                  placeholder="Describí brevemente el rol y sus responsabilidades…"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-n-700">Color identificador</label>
                <div className="flex gap-2">
                  {DOT_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setDot(c)}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                      style={{ backgroundColor: c, boxShadow: dot === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 1 — Skills */}
          {step === 1 && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-n-700">Skills requeridas *</label>
                <div className="flex gap-2">
                  <input
                    className="input-humand flex-1"
                    placeholder="Escribí una skill y presioná Enter…"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
                  />
                  <button
                    onClick={() => addSkill(skillInput)}
                    className="h-9 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <div key={s} className="flex items-center gap-1 bg-h-50 text-h-800 text-[12px] font-medium px-2.5 py-1 rounded-lg">
                      {s}
                      <button onClick={() => removeSkill(s)} className="text-h-400 hover:text-r-600 ml-0.5 leading-none"><X size={10} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <p className="text-[11px] font-semibold text-n-500 mb-2">Sugerencias</p>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 12).map(s => (
                    <button
                      key={s}
                      onClick={() => addSkill(s)}
                      className="text-[11px] text-n-700 bg-n-100 hover:bg-h-100 hover:text-h-800 px-2 py-1 rounded-md transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 2 — Requisitos */}
          {step === 2 && (
            <>
              <p className="text-[12px] text-n-600">Definí los requisitos mínimos para acceder a este career path.</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-n-700">Experiencia mínima</label>
                  <input className="input-humand" value={minExp} onChange={e => setMinExp(e.target.value)} placeholder="ej. 2+ años" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-n-700">Aprobación requerida</label>
                  <select className="input-humand" value={approval} onChange={e => setApproval(e.target.value)}>
                    <option>Manager</option>
                    <option>Manager + HR</option>
                    <option>HR solamente</option>
                    <option>Automática</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 3 — Revisión */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="bg-n-50 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-[13px]" style={{ borderColor: dot, color: dot }}>
                    {level}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-n-950">{name}</p>
                    <p className="text-[12px] text-n-600">{area} · {levelLabel}</p>
                  </div>
                </div>
                {desc && <p className="text-[12px] text-n-700">{desc}</p>}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest mb-2">Skills requeridas</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(s => (
                    <span key={s} className="text-[12px] font-medium px-2.5 py-1 rounded-lg bg-h-50 text-h-800">{s}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['Experiencia', minExp], ['Performance', perf], ['Aprobación', approval]].map(([l, v]) => (
                  <div key={l} className="bg-white border border-n-100 rounded-xl p-3">
                    <p className="text-[10px] text-n-500 font-semibold uppercase tracking-widest mb-1">{l}</p>
                    <p className="text-[13px] font-semibold text-n-950">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-n-100">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
            className="h-9 px-4 border border-n-200 text-n-700 rounded-lg text-[13px] font-semibold hover:bg-n-50 transition-colors"
          >
            {step === 0 ? 'Cancelar' : 'Atrás'}
          </button>
          {step < NEW_PATH_STEPS.length - 1 ? (
            <button
              disabled={!canNext[step]}
              onClick={() => setStep(s => s + 1)}
              className="h-9 px-5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={() => onSave({ name, area, level, desc, dot, skills, minExp, perf, approval })}
              className="h-9 px-5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors"
            >
              Crear career path
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function HRAdminTab() {
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
      {/* Back header */}
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

      {/* Roles by department */}
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
      {/* Stat cards */}
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

      {/* Sub-navigation */}
      <div className="flex items-center gap-1 bg-n-100 p-1 rounded-xl overflow-x-auto scrollbar-thin">
        {SUB_TABS.map(t => (
          <button key={t.id} onClick={() => setSection(t.id)}
            className={`h-8 px-3 rounded-lg text-[12px] whitespace-nowrap transition-all flex items-center gap-1.5 ${section === t.id ? 'bg-white shadow-4dp text-h-500 font-semibold' : 'text-n-600 hover:text-n-950'}`}>
            <t.icon size={13} />{t.label}
          </button>
        ))}
      </div>

      {/* ── Career Paths ── */}
      {section === 'paths' && (
        <>
        {/* Search + Ver todos */}
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

          {/* Header — title + save button */}
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

          {/* Three cards */}
          <div className="flex flex-col gap-3">

            {/* Skills */}
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

            {/* Requisitos */}
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

            {/* Competencias */}
            <div className="bg-white rounded-2xl shadow-4dp p-5">
              <CompetencyBuilder naked />
            </div>

          </div>
        </div>
        )}

        {/* Newly created paths */}
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


      {/* ── Salud Organizacional ── */}
      {section === 'salud' && <SaludOrganizacional />}

      {/* ── Headcount Planning ── */}

      {/* ── Configuración de Visibilidad ── */}

      {/* ── Métricas de Impacto ── */}
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

      {/* Success toast */}
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

/* ─── MAIN COMPONENT ────────────────────────────────────────────── */
const ACTOR_TABS = [
  { id: 'employee', label: 'Colaborador', dot: '#496be3' },
  { id: 'manager',  label: 'Manager',  dot: '#35a48e' },
  { id: 'hradmin',  label: 'HU Admin', dot: '#886bff' },
]

export default function CareerPath() {
  const [actor, setActor] = useState('employee')
  const { setIsHrAdmin } = useApp()

  useEffect(() => {
    setIsHrAdmin(actor === 'hradmin')
    return () => setIsHrAdmin(false)
  }, [actor])

  return (
    <div className="p-8 max-w-6xl mx-auto animate-slide-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-n-950">Plan de Carrera</h1>
          <p className="text-[13px] text-n-600 mt-0.5">{actor === 'hradmin' ? 'Rutas profesionales en la organización' : actor === 'manager' ? 'Da seguimiento, revisa y aprueba el desarrollo profesional de tu equipo' : 'Planificá y seguí tu desarrollo profesional'}</p>
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
