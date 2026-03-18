import { useApp } from '../App'

const CIRCUMFERENCE = 2 * Math.PI * 36

function ProgressRing({ pct, color = '#496be3' }) {
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r="36" fill="none" stroke="#eeeef1" strokeWidth="7" />
      <circle
        cx="44" cy="44" r="36" fill="none"
        stroke={color} strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 44 44)"
        className="ring-progress"
      />
      <text x="44" y="49" textAnchor="middle" fontSize="15" fontWeight="700" fill="#303036">{pct}%</text>
    </svg>
  )
}

const STAT_CARDS = [
  { label: 'Active Goals',      value: '4',   sub: '2 on track',       color: 'bg-h-50 text-h-600',  icon: '🎯' },
  { label: 'Pending Reviews',   value: '2',   sub: 'Due Apr 5',        color: 'bg-y-50 text-y-600',  icon: '📋' },
  { label: 'Learning Hours',    value: '24h', sub: 'This month',       color: 'bg-g-50 text-g-800',  icon: '📚' },
  { label: 'Team Health',       value: '87%', sub: '+3% vs last month', color: 'bg-t-50 text-t-800',  icon: '💚' },
]

const ACTIVITY = [
  { icon: '📄', text: 'You submitted your career plan for review',   time: '2 days ago',  color: 'bg-h-50' },
  { icon: '✅', text: 'Completed "Advanced Figma" certification',    time: '5 days ago',  color: 'bg-g-50' },
  { icon: '🤝', text: '1:1 with Ana García scheduled for Mar 22',    time: '1 week ago',  color: 'bg-t-50' },
  { icon: '🎯', text: 'New goal assigned: Lead Q3 Design Sprint',    time: '1 week ago',  color: 'bg-y-50' },
]

const UPCOMING = [
  { icon: '📋', label: 'Self Assessment due',        date: 'Apr 5, 2026',  badge: 'bg-y-100 text-y-700' },
  { icon: '🎯', label: 'Lead Q3 Design Sprint',      date: 'Apr 30, 2026', badge: 'bg-h-100 text-h-800' },
  { icon: '🤝', label: '1:1 with Ana García',        date: 'Mar 22, 2026', badge: 'bg-t-100 text-t-800' },
]

export default function Home() {
  const { profile } = useApp()
  const name = profile?.role ? profile.role : 'Sofia Carro'

  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      {/* Welcome card */}
      <div
        className="rounded-2xl p-6 mb-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(140deg, #496be3 0%, #29317f 100%)' }}
      >
        <div className="relative z-10">
          <p className="text-[11px] font-semibold uppercase tracking-widest opacity-70 mb-1">Welcome back</p>
          <h1 className="text-2xl font-bold mb-1">{name} 👋</h1>
          <p className="text-[13px] opacity-75">Product Designer · Mid-level · Design Team</p>
        </div>
        <div className="absolute right-6 top-4 opacity-10 text-[120px] leading-none select-none">H</div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-n-950">{s.value}</p>
              <p className="text-[11px] text-n-600 font-medium">{s.label}</p>
              <p className="text-[10px] text-n-500 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Career progress */}
        <div className="col-span-2 bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-n-950">My Career Progress</span>
            <button className="text-[12px] text-h-600 font-medium hover:underline">View path →</button>
          </div>
          <div className="p-6 flex items-center gap-6">
            <ProgressRing pct={60} />
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-n-600 uppercase tracking-widest mb-1">Path to</p>
              <p className="text-base font-bold text-n-950 mb-0.5">Senior Designer</p>
              <p className="text-[12px] text-n-600 mb-3">Est. Q3 2026 · 3 of 5 goals complete</p>
              <div className="w-full h-2 bg-n-100 rounded-full overflow-hidden">
                <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: '60%' }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-n-500">Product Designer L2</span>
                <span className="text-[10px] text-n-500">Senior Designer L3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100">
            <span className="text-[13px] font-semibold text-n-950">Upcoming</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {UPCOMING.map((u, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-xl hover:bg-n-50 transition-colors">
                <span className="text-base leading-none mt-0.5">{u.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-n-950 leading-tight">{u.label}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${u.badge}`}>{u.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="col-span-3 bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100">
            <span className="text-[13px] font-semibold text-n-950">Recent Activity</span>
          </div>
          <div className="divide-y divide-n-100">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-n-50 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${a.color}`}>
                  {a.icon}
                </div>
                <p className="flex-1 text-[13px] text-n-950">{a.text}</p>
                <span className="text-[11px] text-n-500 shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
