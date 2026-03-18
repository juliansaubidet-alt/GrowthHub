const REVIEWS = [
  {
    id: 1,
    cycle: 'Q1 2026 Annual Review',
    type: 'Self Assessment',
    typeIcon: '📝',
    status: 'In progress',
    statusClass: 'bg-h-100 text-h-800',
    dueDate: 'Apr 5, 2026',
    completion: 60,
    description: 'Reflect on your achievements, challenges, and growth over the past quarter.',
  },
  {
    id: 2,
    cycle: 'Q1 2026 Annual Review',
    type: 'Manager Review',
    typeIcon: '👤',
    status: 'Pending',
    statusClass: 'bg-n-100 text-n-600',
    dueDate: 'Apr 15, 2026',
    completion: 0,
    description: 'Your manager will complete this review after your self-assessment is submitted.',
  },
  {
    id: 3,
    cycle: 'Q1 2026 Annual Review',
    type: 'Peer Review (×3)',
    typeIcon: '👥',
    status: 'Completed',
    statusClass: 'bg-g-100 text-g-800',
    dueDate: 'Mar 31, 2026',
    completion: 100,
    description: '3 peer reviews collected from Ana García, Luis Herrera, and Mia Torres.',
  },
]

const PAST_REVIEWS = [
  { cycle: 'Q3 2025 Mid-Year Review', date: 'Sep 2025', score: '88%', status: 'Completed', statusClass: 'bg-g-100 text-g-800' },
  { cycle: 'Q1 2025 Annual Review',   date: 'Apr 2025', score: '84%', status: 'Completed', statusClass: 'bg-g-100 text-g-800' },
  { cycle: 'Q3 2024 Mid-Year Review', date: 'Sep 2024', score: '79%', status: 'Completed', statusClass: 'bg-g-100 text-g-800' },
]

export default function Reviews() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-n-950">Reviews</h1>
        <p className="text-[13px] text-n-600 mt-0.5">Your performance review history</p>
      </div>

      {/* Alert: current cycle */}
      <div className="rounded-2xl bg-h-50 border border-h-200 px-5 py-4 flex items-start gap-3 mb-6">
        <span className="text-xl shrink-0">📋</span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-n-950">Q1 2026 Annual Review is now open</p>
          <p className="text-[12px] text-n-600 mt-0.5">Your self-assessment is due Apr 5, 2026 · 60% complete</p>
        </div>
        <button className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition-colors shrink-0">Continue →</button>
      </div>

      {/* Current review cards */}
      <div className="mb-8">
        <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Current Cycle — Q1 2026 Annual Review</p>
        <div className="grid grid-cols-3 gap-4">
          {REVIEWS.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-4dp hover:shadow-8dp transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-n-50 flex items-center justify-center text-2xl shrink-0">{r.typeIcon}</div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.statusClass}`}>{r.status}</span>
                </div>
                <p className="text-[13px] font-semibold text-n-950 mb-1">{r.type}</p>
                <p className="text-[11px] text-n-600 mb-3 leading-relaxed">{r.description}</p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-n-500">Completion</span>
                    <span className="font-semibold text-n-950">{r.completion}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-n-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bar-fill"
                      style={{
                        width: `${r.completion}%`,
                        backgroundColor: r.completion === 100 ? '#28c040' : '#496be3',
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-n-500">Due {r.dueDate}</p>
                  {r.status === 'In progress' && (
                    <button className="h-7 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[11px] font-semibold transition-colors">Continue</button>
                  )}
                  {r.status === 'Completed' && (
                    <button className="h-7 px-3 bg-white border border-n-200 text-n-950 rounded-lg text-[11px] font-semibold hover:shadow-4dp transition-shadow">View</button>
                  )}
                  {r.status === 'Pending' && (
                    <span className="text-[10px] text-n-400 italic">Awaiting self-assessment</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review history */}
      <div className="bg-white rounded-2xl shadow-4dp">
        <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-n-950">Review History</span>
          <button className="text-[12px] text-h-600 font-medium hover:underline">Export →</button>
        </div>
        <div className="divide-y divide-n-50">
          {PAST_REVIEWS.map((r, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-n-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-g-50 flex items-center justify-center text-lg shrink-0">✅</div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-n-950">{r.cycle}</p>
                <p className="text-[11px] text-n-600">{r.date}</p>
              </div>
              <span className="text-lg font-bold text-n-950">{r.score}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.statusClass}`}>{r.status}</span>
              <button className="text-[12px] text-h-600 font-medium hover:underline">View →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
