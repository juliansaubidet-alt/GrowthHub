import { useState, useEffect, createContext, useContext } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Home from './views/Home'
import CareerPath from './views/CareerPath'
import People from './views/People'
import Performance from './views/Performance'
import Learning from './views/Learning'
import Goals from './views/Goals'
import Reviews from './views/Reviews'
import Meetings from './views/Meetings'
import Settings from './views/Settings'
import Admin from './views/Admin'

export const AppContext = createContext(null)

const defaultProfile = {
  role: '', industry: '', experience: '',
  aspirations: { '6': '', '12': '', '24': '' },
  selectedSkills: [],
}

const defaultSkills = [
  { id: 1, name: 'Liderazgo',     current: 4, required: 8, category: 'soft' },
  { id: 2, name: 'Comunicación',  current: 6, required: 9, category: 'soft' },
  { id: 3, name: 'React',         current: 7, required: 9, category: 'tech' },
  { id: 4, name: 'Node.js',       current: 5, required: 8, category: 'tech' },
  { id: 5, name: 'SQL / Datos',   current: 5, required: 7, category: 'tech' },
  { id: 6, name: 'Agile / Scrum', current: 4, required: 7, category: 'soft' },
  { id: 7, name: 'Inglés',        current: 6, required: 9, category: 'soft' },
  { id: 8, name: 'Negociación',   current: 3, required: 7, category: 'soft' },
]

const defaultObjectives = [
  {
    id: 1, title: 'Convertirme en Tech Lead',
    description: 'Liderar un equipo técnico de al menos 3 personas',
    priority: 'high', category: 'liderazgo',
    deadline: '2026-12-31', progress: 30,
    keyResults: [
      { id: 1, text: 'Completar curso de liderazgo técnico', done: true },
      { id: 2, text: 'Liderar 1 proyecto end-to-end', done: false },
      { id: 3, text: 'Obtener feedback 360 positivo', done: false },
    ],
  },
  {
    id: 2, title: 'Mejorar habilidades de comunicación',
    description: 'Presentar ideas con claridad ante stakeholders',
    priority: 'medium', category: 'soft skills',
    deadline: '2026-09-30', progress: 50,
    keyResults: [
      { id: 1, text: 'Dar 3 presentaciones internas', done: true },
      { id: 2, text: 'Tomar curso de public speaking', done: true },
      { id: 3, text: 'Presentar en una conferencia externa', done: false },
    ],
  },
]

const defaultActionItems = [
  { id: 1, skill: 'Liderazgo',   type: 'curso',    title: 'Engineering Management 101 — Coursera',          url: '', week: 1, done: false, milestone: true },
  { id: 2, skill: 'React',       type: 'proyecto',  title: 'Construir app full-stack con React + Supabase',  url: '', week: 2, done: false, milestone: false },
  { id: 3, skill: 'Inglés',      type: 'práctica',  title: 'Conversación con tutor nativo — iTalki (30 min/día)', url: '', week: 1, done: true,  milestone: false },
  { id: 4, skill: 'Negociación', type: 'libro',     title: 'Libro: Never Split the Difference — Chris Voss', url: '', week: 3, done: false, milestone: true },
]

const defaultCompetencies = [
  {
    id: 1, category: 'Técnico', name: 'Diseño Visual',
    description: 'Habilidades de diseño y comunicación visual',
    skills: [
      { id: 11, name: 'Figma',           description: 'Herramienta principal de diseño UI/UX' },
      { id: 12, name: 'Prototyping',     description: 'Creación de prototipos interactivos' },
      { id: 13, name: 'Design Systems',  description: 'Sistemas de diseño escalables y consistentes' },
    ],
  },
  {
    id: 2, category: 'Liderazgo', name: 'Gestión de Stakeholders',
    description: 'Comunicación y alineación con stakeholders',
    skills: [
      { id: 21, name: 'Presentaciones', description: 'Presentar diseños y decisiones a stakeholders' },
      { id: 22, name: 'Negociación',    description: 'Negociar alcance, prioridades y recursos' },
    ],
  },
  {
    id: 3, category: 'Soft Skills', name: 'Colaboración',
    description: 'Trabajo en equipo y comunicación efectiva',
    skills: [
      { id: 31, name: 'Feedback',  description: 'Dar y recibir feedback constructivo' },
      { id: 32, name: 'Mentoring', description: 'Mentoría y desarrollo de compañeros' },
    ],
  },
]

const defaultLevelObjectives = [
  {
    level: 'L1', title: 'Junior', color: '#c5d4f8', role: '',
    objectives: [
      { id: 101, area: 'Técnico',       text: 'Completar tareas asignadas con supervisión mínima' },
      { id: 102, area: 'Colaboración',  text: 'Participar activamente en reviews de diseño/código' },
      { id: 103, area: 'Aprendizaje',   text: 'Completar al menos 2 cursos de skill técnica por trimestre' },
    ],
  },
  {
    level: 'L2', title: 'Mid', color: '#496be3', role: '',
    objectives: [
      { id: 201, area: 'Técnico',       text: 'Liderar features end-to-end de mediana complejidad' },
      { id: 202, area: 'Colaboración',  text: 'Mentoría activa de al menos 1 persona junior' },
      { id: 203, area: 'Visibilidad',   text: 'Presentar trabajo al equipo ampliado trimestralmente' },
    ],
  },
  {
    level: 'L3', title: 'Senior', color: '#3851d8', role: '',
    objectives: [
      { id: 301, area: 'Técnico',       text: 'Definir estándares y mejores prácticas para el equipo' },
      { id: 302, area: 'Liderazgo',     text: 'Liderar proyectos cross-funcionales con autonomía' },
      { id: 303, area: 'Estrategia',    text: 'Contribuir a la roadmap y visión del área' },
    ],
  },
  {
    level: 'L4', title: 'Lead', color: '#29317f', role: '',
    objectives: [
      { id: 401, area: 'Liderazgo',     text: 'Gestionar y desarrollar un equipo de 3+ personas' },
      { id: 402, area: 'Estrategia',    text: 'Definir visión técnica/de diseño a 12+ meses' },
      { id: 403, area: 'Impacto',       text: 'Impactar métricas clave de negocio medibles' },
    ],
  },
]

const defaultCatalog = [
  { id: 1, title: 'Desarrollo Web Full Stack', skill: 'React', type: 'curso', url: 'https://www.coderhouse.com/ar/carrera/fullstack-developer', description: 'Carrera completa de desarrollo web con React y Node.js.', addedBy: 'Líder Técnico', addedAt: '2026-03-01' },
  { id: 2, title: 'JavaScript Moderno',         skill: 'React', type: 'curso', url: 'https://www.coderhouse.com/ar/cursos/javascript', description: 'Fundamentos y conceptos avanzados de JavaScript ES6+.', addedBy: 'Líder Técnico', addedAt: '2026-03-01' },
  { id: 3, title: 'Liderazgo y Gestión de Equipos', skill: 'Liderazgo', type: 'curso', url: 'https://www.coderhouse.com/ar/', description: 'Herramientas prácticas para liderar equipos de alto rendimiento.', addedBy: 'Líder de Personas', addedAt: '2026-03-05' },
]

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

export const LEADER_PASSWORD = 'lider2026'

const VIEW_LABELS = {
  home:        'Home',
  careerpath:  'Career Path',
  people:      'People',
  performance: 'Performance',
  learning:    'Learning',
  goals:       'Goals',
  reviews:     'Reviews',
  meetings:    '1:1s',
  settings:    'Settings',
  admin:       'Admin',
}

export default function App() {
  const [activeView, setActiveView]   = useState('home')
  const [leaderRole, setLeaderRole]   = useState(() => sessionStorage.getItem('cp_role') === 'leader')
  const [profile, setProfile]         = useState(() => load('cp_profile',    defaultProfile))
  const [skills, setSkills]           = useState(() => load('cp_skills',     defaultSkills))
  const [objectives, setObjectives]   = useState(() => load('cp_objectives', defaultObjectives))
  const [actionItems, setActionItems]         = useState(() => load('cp_actions',      defaultActionItems))
  const [catalog, setCatalog]                 = useState(() => load('cp_catalog',      defaultCatalog))
  const [competencies, setCompetencies]       = useState(() => load('cp_competencies', defaultCompetencies))
  const [levelObjectives, setLevelObjectives] = useState(() => load('cp_level_objs',   defaultLevelObjectives))
  const [resolvedAlerts, setResolvedAlerts]   = useState(() => load('cp_resolved_alerts', []))

  useEffect(() => { localStorage.setItem('cp_profile',    JSON.stringify(profile)) },    [profile])
  useEffect(() => { localStorage.setItem('cp_skills',     JSON.stringify(skills)) },     [skills])
  useEffect(() => { localStorage.setItem('cp_objectives', JSON.stringify(objectives)) }, [objectives])
  useEffect(() => { localStorage.setItem('cp_actions',      JSON.stringify(actionItems)) },    [actionItems])
  useEffect(() => { localStorage.setItem('cp_catalog',      JSON.stringify(catalog)) },      [catalog])
  useEffect(() => { localStorage.setItem('cp_competencies', JSON.stringify(competencies)) },  [competencies])
  useEffect(() => { localStorage.setItem('cp_level_objs',     JSON.stringify(levelObjectives)) },  [levelObjectives])
  useEffect(() => { localStorage.setItem('cp_resolved_alerts', JSON.stringify(resolvedAlerts)) },  [resolvedAlerts])
  useEffect(() => {
    if (leaderRole) sessionStorage.setItem('cp_role', 'leader')
    else sessionStorage.removeItem('cp_role')
  }, [leaderRole])

  const ctx = {
    profile, setProfile,
    skills, setSkills,
    objectives, setObjectives,
    actionItems, setActionItems,
    catalog, setCatalog,
    competencies, setCompetencies,
    levelObjectives, setLevelObjectives,
    resolvedAlerts, setResolvedAlerts,
    leaderRole, setLeaderRole,
  }

  const views = {
    home:        <Home />,
    careerpath:  <CareerPath />,
    people:      <People />,
    performance: <Performance />,
    learning:    <Learning />,
    goals:       <Goals />,
    reviews:     <Reviews />,
    meetings:    <Meetings />,
    settings:    <Settings />,
    admin:       <Admin />,
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className="flex h-screen bg-n-50 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} leaderRole={leaderRole} setLeaderRole={setLeaderRole} profile={profile} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar activeView={activeView} label={VIEW_LABELS[activeView]} />
          <main className="flex-1 overflow-y-auto scrollbar-thin animate-fade-in">
            {views[activeView]}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
