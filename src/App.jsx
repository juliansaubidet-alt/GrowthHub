import { useState, useEffect, createContext, useContext } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './views/Dashboard'
import Onboarding from './views/Onboarding'
import Objectives from './views/Objectives'
import SkillGap from './views/SkillGap'
import ActionPlan from './views/ActionPlan'
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

// Leader password (in a real app this would be server-side)
export const LEADER_PASSWORD = 'lider2026'

export default function App() {
  const [activeView, setActiveView]     = useState('dashboard')
  const [sidebarOpen, setSidebarOpen]   = useState(true)
  const [leaderRole, setLeaderRole]     = useState(() => sessionStorage.getItem('cp_role') === 'leader')
  const [profile, setProfile]           = useState(() => load('cp_profile',    defaultProfile))
  const [skills, setSkills]             = useState(() => load('cp_skills',     defaultSkills))
  const [objectives, setObjectives]     = useState(() => load('cp_objectives', defaultObjectives))
  const [actionItems, setActionItems]   = useState(() => load('cp_actions',    defaultActionItems))
  const [catalog, setCatalog]           = useState(() => load('cp_catalog',    defaultCatalog))

  useEffect(() => { localStorage.setItem('cp_profile',    JSON.stringify(profile)) },      [profile])
  useEffect(() => { localStorage.setItem('cp_skills',     JSON.stringify(skills)) },       [skills])
  useEffect(() => { localStorage.setItem('cp_objectives', JSON.stringify(objectives)) },   [objectives])
  useEffect(() => { localStorage.setItem('cp_actions',    JSON.stringify(actionItems)) },  [actionItems])
  useEffect(() => { localStorage.setItem('cp_catalog',    JSON.stringify(catalog)) },      [catalog])
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
    leaderRole, setLeaderRole,
  }

  const views = {
    dashboard:  <Dashboard />,
    onboarding: <Onboarding />,
    objectives: <Objectives />,
    skillgap:   <SkillGap />,
    actionplan: <ActionPlan />,
    admin:      <Admin />,
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin animate-fade-in">
          {views[activeView]}
        </main>
      </div>
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
