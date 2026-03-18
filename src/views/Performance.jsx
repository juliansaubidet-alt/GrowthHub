const STATS = [
  { label: 'Active Reviews',      value: '3',   icon: '📋', color: 'bg-h-50 text-h-600' },
  { label: 'Completed This Cycle', value: '12',  icon: '✅', color: 'bg-g-50 text-g-800' },
  { label: 'Avg Score',           value: '87%', icon: '⭐', color: 'bg-y-50 text-y-700' },
  { label: 'Pending Calibration', value: '5',   icon: '⚖️', color: 'bg-p-50 text-p-800' },
]

const DISTRIBUTION = [
  { label: 'Exceptional',        pct: 15, color: '#28c040' },
  { label: 'Exceeds',            pct: 32, color: '#496be3' },
  { label: 'Meets',              pct: 38, color: '#46badd' },
  { label: 'Below',              pct: 12, color: '#de920c' },
  { label: 'Needs Improvement',  pct:  3, color: '#d42e2e' },
]

const TEAM_TABLE = [
  { initials: 'AG', name: 'Ana García',   role: 'Product Designer',  self: 88, manager: 85, final: 87, status: 'Completed',   statusClass: 'bg-g-100 text-g-800',  color: 'bg-h-100 text-h-600' },
  { initials: 'LH', name: 'Luis Herrera', role: 'Frontend Engineer', self: 75, manager: null, final: null, status: 'In progress', statusClass: 'bg-h-100 text-h-800',  color: 'bg-t-100 text-t-800' },
  { initials: 'MT', name: 'Mia Torres',   role: 'UX Researcher',     self: 91, manager: 89, final: 90, status: 'Completed',   statusClass: 'bg-g-100 text-g-800',  color: 'bg-p-100 text-p-800' },
  { initials: 'CR', name: 'Carlos Ruiz',  role: 'Backend Engineer',  self: null, manager: null, final: null, status: 'Pending',     statusClass: 'bg-n-100 text-n-600',  color: 'bg-g-100 text-g-800' },
  { initials: 'RD', name: 'Raj Desai',    role: 'Product Designer',  self: 92, manager: 94, final: 93, status: 'Calibration', statusClass: 'bg-y-100 text-y-700',  color: 'bg-s-100 text-s-800' },
]

export default function Performance() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-n-950">Performance</h1>
        <p className="text-[13px] text-n-600 mt-0.5">Track and manage performance reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-xl font-bold text-n-950">{s.value}</p>
              <p className="text-[11px] text-n-600">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Review cycle card */}
        <div className="col-span-2 bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-n-950">Current Review Cycle</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-h-100 text-h-800">Active</span>
          </div>
          <div className="p-6">
            <p className="text-base font-bold text-n-950 mb-1">Q1 2026 Annual Review</p>
            <div className="flex gap-4 mb-4">
              <div>
                <p className="text-[10px] text-n-600 uppercase tracking-widest">Start date</p>
                <p className="text-[12px] font-semibold text-n-950 mt-0.5">Mar 1, 2026</p>
              </div>
              <div>
                <p className="text-[10px] text-n-600 uppercase tracking-widest">End date</p>
                <p className="text-[12px] font-semibold text-n-950 mt-0.5">Apr 15, 2026</p>
              </div>
              <div>
                <p className="text-[10px] text-n-600 uppercase tracking-widest">Participants</p>
                <p className="text-[12px] font-semibold text-n-950 mt-0.5">47 employees</p>
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-n-600 mb-1.5">
              <span>Overall completion</span>
              <span className="font-semibold text-n-950">67%</span>
            </div>
            <div className="w-full h-2.5 bg-n-100 rounded-full overflow-hidden">
              <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: '67%' }} />
            </div>
            <div className="flex gap-4 mt-3">
              {[['Self Assessment', '80%', 'bg-g-100 text-g-800'], ['Manager Review', '58%', 'bg-y-100 text-y-700'], ['Peer Review', '64%', 'bg-h-100 text-h-800']].map(([l, v, c]) => (
                <div key={l} className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c}`}>{l}</span>
                  <span className="text-[11px] font-semibold text-n-950">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100">
            <span className="text-[13px] font-semibold text-n-950">Performance Distribution</span>
          </div>
          <div className="p-5 flex flex-col gap-2.5">
            {DISTRIBUTION.map(d => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="text-[11px] text-n-600 w-28 shrink-0">{d.label}</span>
                <div className="flex-1 h-5 bg-n-100 rounded-md overflow-hidden">
                  <div
                    className="h-full rounded-md bar-fill flex items-center justify-end pr-1.5"
                    style={{ width: `${d.pct}%`, backgroundColor: d.color }}
                  >
                    <span className="text-[9px] font-bold text-white">{d.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team performance table */}
      <div className="bg-white rounded-2xl shadow-4dp">
        <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-n-950">Team Performance</span>
          <button className="text-[12px] text-h-600 font-medium hover:underline">Export →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-n-100">
                {['Employee', 'Role', 'Self Score', 'Manager Score', 'Final', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-n-600 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEAM_TABLE.map((row, i) => (
                <tr key={i} className="border-b border-n-50 hover:bg-n-50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${row.color}`}>{row.initials}</div>
                      <span className="text-[13px] font-medium text-n-950">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-n-600">{row.role}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-n-950">{row.self != null ? `${row.self}%` : <span className="text-n-400">—</span>}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-n-950">{row.manager != null ? `${row.manager}%` : <span className="text-n-400">—</span>}</td>
                  <td className="px-5 py-3 text-[13px] font-bold text-n-950">{row.final != null ? `${row.final}%` : <span className="text-n-400">—</span>}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${row.statusClass}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
