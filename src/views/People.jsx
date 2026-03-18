import { useState } from 'react'

const EMPLOYEES = [
  { initials: 'AG', name: 'Ana García',   role: 'Product Designer',  dept: 'Design',      status: 'Review',      statusClass: 'bg-y-100 text-y-700',  progress: 60, color: 'bg-h-100 text-h-600' },
  { initials: 'LH', name: 'Luis Herrera', role: 'Frontend Engineer', dept: 'Engineering', status: 'In progress', statusClass: 'bg-h-100 text-h-800',  progress: 45, color: 'bg-t-100 text-t-800' },
  { initials: 'MT', name: 'Mia Torres',   role: 'UX Researcher',     dept: 'Design',      status: 'Goal set',    statusClass: 'bg-h-100 text-h-800',  progress: 72, color: 'bg-p-100 text-p-800' },
  { initials: 'CR', name: 'Carlos Ruiz',  role: 'Backend Engineer',  dept: 'Engineering', status: 'In progress', statusClass: 'bg-h-100 text-h-800',  progress: 38, color: 'bg-g-100 text-g-800' },
  { initials: 'SL', name: 'Sara López',   role: 'Data Analyst',      dept: 'Analytics',   status: 'No path',     statusClass: 'bg-n-100 text-n-600',  progress: 0,  color: 'bg-y-100 text-y-700' },
  { initials: 'RD', name: 'Raj Desai',    role: 'Product Designer',  dept: 'Design',      status: 'Promo-ready', statusClass: 'bg-g-100 text-g-800',  progress: 85, color: 'bg-s-100 text-s-800' },
  { initials: 'PT', name: 'Paula Torres', role: 'Junior Designer',   dept: 'Design',      status: 'In progress', statusClass: 'bg-h-100 text-h-800',  progress: 30, color: 'bg-p-100 text-p-500' },
  { initials: 'MS', name: 'Marco Silva',  role: 'Lead Engineer',     dept: 'Engineering', status: 'Active',      statusClass: 'bg-g-100 text-g-800',  progress: 90, color: 'bg-t-100 text-t-500' },
]

const DEPTS = ['All', 'Design', 'Engineering', 'Analytics']
const STATUSES = ['All', 'In progress', 'Review', 'Goal set', 'Promo-ready', 'No path', 'Active']

export default function People() {
  const [search, setSearch] = useState('')
  const [dept, setDept] = useState('All')
  const [status, setStatus] = useState('All')

  const filtered = EMPLOYEES.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
    const matchDept = dept === 'All' || e.dept === dept
    const matchStatus = status === 'All' || e.status === status
    return matchSearch && matchDept && matchStatus
  })

  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-n-950">People</h1>
        <p className="text-[13px] text-n-600 mt-0.5">Manage and view your team</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 max-w-xs">
          <input
            className="input-humand"
            placeholder="Search by name or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-n-600 shrink-0">Department</span>
          <select
            className="input-humand"
            style={{ width: 140 }}
            value={dept}
            onChange={e => setDept(e.target.value)}
          >
            {DEPTS.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-n-600 shrink-0">Status</span>
          <select
            className="input-humand"
            style={{ width: 140 }}
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <span className="text-[12px] text-n-500 ml-auto">{filtered.length} people</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-4">
        {filtered.map(emp => (
          <div
            key={emp.name}
            className="bg-white rounded-2xl shadow-4dp hover:shadow-8dp transition-shadow group cursor-pointer"
          >
            <div className="p-5 flex flex-col items-center text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-bold mb-3 ${emp.color}`}>
                {emp.initials}
              </div>
              <p className="text-[13px] font-semibold text-n-950">{emp.name}</p>
              <p className="text-[11px] text-n-600 mt-0.5">{emp.role}</p>
              <p className="text-[10px] text-n-500 mb-2">{emp.dept}</p>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 ${emp.statusClass}`}>{emp.status}</span>

              {emp.progress > 0 && (
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-n-500">Career progress</span>
                    <span className="text-[10px] font-semibold text-n-950">{emp.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-n-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-h-500 rounded-full bar-fill"
                      style={{ width: `${emp.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {emp.progress === 0 && (
                <div className="w-full">
                  <div className="w-full h-1.5 bg-n-100 rounded-full" />
                  <p className="text-[10px] text-n-400 mt-1">No path defined</p>
                </div>
              )}
            </div>

            <div className="border-t border-n-100 px-5 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="text-[12px] text-h-600 font-medium w-full text-center hover:underline">View profile →</button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl shadow-4dp p-12 text-center">
          <p className="text-2xl mb-2">🔍</p>
          <p className="text-[13px] font-semibold text-n-950">No people found</p>
          <p className="text-[12px] text-n-500 mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  )
}
