import { useState, useEffect } from 'react'
import { useApp } from '../../App'
import EmployeeTab from './EmployeeTab'
import ManagerTab from './ManagerTab'
import HRAdminTab from './HRAdminTab'

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-n-950">Plan de Carrera</h1>
          <p className="text-[13px] text-n-600 mt-0.5">{actor === 'hradmin' ? 'Rutas profesionales en la organización' : actor === 'manager' ? 'Da seguimiento, revisa y aprueba el desarrollo profesional de tu equipo' : 'Planificá y seguí tu desarrollo profesional'}</p>
        </div>
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
