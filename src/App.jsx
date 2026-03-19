import { useState, useEffect, createContext, useContext } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import CareerPath from './views/CareerPath'
import { competenciesApi } from './api/competencies'

export const AppContext = createContext(null)

const VIEW_LABELS = {
  careerpath: 'Career Path',
}

export default function App() {
  const [activeView, setActiveView] = useState('careerpath')
  const [isHrAdmin, setIsHrAdmin] = useState(false)

  // User switcher — persist selected user ID across refresh
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)

  const handleSetSelectedUser = (user) => {
    setSelectedUser(user)
    if (user?._id) localStorage.setItem('gh_selected_user', user._id)
  }

  // Competencies (API-backed, shared with CompetencyBuilder)
  const [competencies, setCompetencies] = useState([])

  useEffect(() => {
    let cancelled = false

    async function init() {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:3000/api') + '/users')
        const data = await res.json()
        if (cancelled) return
        if (Array.isArray(data) && data.length > 0) {
          setUsers(data)
          // Restore previously selected user or default to first employee
          const savedId = localStorage.getItem('gh_selected_user')
          const restored = savedId ? data.find(u => u._id === savedId) : null
          const defaultUser = restored || data.find(u => u.role === 'employee') || data[0]
          setSelectedUser(defaultUser)
          if (defaultUser?._id) localStorage.setItem('gh_selected_user', defaultUser._id)
        }
      } catch (err) {
        console.error('Failed to fetch users:', err.message)
      }

      try {
        const apiCompetencies = await competenciesApi.getAll()
        if (!cancelled && Array.isArray(apiCompetencies) && apiCompetencies.length > 0) {
          setCompetencies(apiCompetencies.map(c => ({
            ...c,
            id: c._id || c.id,
            skills: (c.skills || []).map(sk => ({
              ...sk,
              id: sk._id || sk.id,
            })),
          })))
        }
      } catch (err) {
        console.warn('Could not fetch competencies:', err.message)
      }
    }

    init()
    return () => { cancelled = true }
  }, [])

  const ctx = {
    competencies, setCompetencies,
    isHrAdmin, setIsHrAdmin,
    users,
    selectedUser,
    setSelectedUser: handleSetSelectedUser,
  }

  const views = {
    careerpath: <CareerPath />,
  }

  return (
    <AppContext.Provider value={ctx}>
      <div className="flex h-screen bg-n-50 overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar activeView={activeView} label={VIEW_LABELS[activeView]} />
          <main className="flex-1 overflow-y-auto scrollbar-thin animate-fade-in">
            {selectedUser !== null && views[activeView]}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
