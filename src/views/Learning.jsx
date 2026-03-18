const STATS = [
  { label: 'Courses Completed', value: '8',   icon: '🎓', color: 'bg-g-50 text-g-800' },
  { label: 'Hours Learned',     value: '24h', icon: '⏱️', color: 'bg-h-50 text-h-600' },
  { label: 'Certifications',    value: '3',   icon: '🏅', color: 'bg-y-50 text-y-700' },
]

const CIRCUMFERENCE = 2 * Math.PI * 28

function MiniRing({ pct, color }) {
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE
  return (
    <svg width="70" height="70" viewBox="0 0 70 70">
      <circle cx="35" cy="35" r="28" fill="none" stroke="#eeeef1" strokeWidth="6" />
      <circle
        cx="35" cy="35" r="28" fill="none"
        stroke={color} strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        transform="rotate(-90 35 35)"
        className="ring-progress"
      />
      <text x="35" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="#303036">{pct}%</text>
    </svg>
  )
}

const SKILL_PATHS = [
  { skill: 'UX Research',      pct: 60, color: '#496be3', courses: 3, total: 5 },
  { skill: 'Stakeholder Mgmt', pct: 35, color: '#d42e2e', courses: 1, total: 4 },
  { skill: 'Design Systems',   pct: 75, color: '#28c040', courses: 4, total: 5 },
]

const COURSES = [
  { emoji: '📗', title: 'Stakeholder Management',     provider: 'LinkedIn Learning', duration: '4h',  level: 'Intermediate', levelClass: 'bg-y-100 text-y-700',  progress: null },
  { emoji: '🎨', title: 'Advanced Figma Systems',     provider: 'Figma Academy',     duration: '6h',  level: 'Advanced',     levelClass: 'bg-r-100 text-r-600',  progress: null },
  { emoji: '🔬', title: 'UX Research Methods',        provider: 'Interaction Design', duration: '8h', level: 'Beginner',     levelClass: 'bg-g-100 text-g-800',  progress: 45 },
  { emoji: '💼', title: 'Design Leadership',          provider: 'IDEO U',            duration: '5h',  level: 'Advanced',     levelClass: 'bg-r-100 text-r-600',  progress: null },
]

const COMPLETED = [
  { emoji: '✅', title: 'Advanced Figma Certification', provider: 'Figma Academy',  date: 'Mar 10, 2026', duration: '6h' },
  { emoji: '✅', title: 'UX Research Fundamentals',     provider: 'Coursera',        date: 'Mar 1, 2026',  duration: '12h' },
  { emoji: '✅', title: 'Design Thinking Bootcamp',     provider: 'IDEO U',          date: 'Jan 20, 2026', duration: '8h' },
]

export default function Learning() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-n-950">Learning</h1>
        <p className="text-[13px] text-n-600 mt-0.5">Grow your skills with curated content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-n-950">{s.value}</p>
              <p className="text-[11px] text-n-600">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Learning path */}
      <div className="bg-white rounded-2xl shadow-4dp mb-4">
        <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-n-950">My Learning Path</span>
          <button className="text-[12px] text-h-600 font-medium hover:underline">View all skills →</button>
        </div>
        <div className="p-6 grid grid-cols-3 gap-6">
          {SKILL_PATHS.map(sp => (
            <div key={sp.skill} className="flex items-center gap-4">
              <MiniRing pct={sp.pct} color={sp.color} />
              <div>
                <p className="text-[13px] font-semibold text-n-950">{sp.skill}</p>
                <p className="text-[11px] text-n-600 mt-0.5">{sp.courses}/{sp.total} courses done</p>
                <div className="w-full h-1.5 bg-n-100 rounded-full overflow-hidden mt-2">
                  <div className="h-full rounded-full bar-fill" style={{ width: `${sp.pct}%`, backgroundColor: sp.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended courses */}
      <div className="bg-white rounded-2xl shadow-4dp mb-4">
        <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
          <span className="text-[13px] font-semibold text-n-950">Recommended Courses</span>
          <button className="text-[12px] text-h-600 font-medium hover:underline">Browse catalog →</button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {COURSES.map((c, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-n-100 hover:border-h-200 hover:bg-h-50 transition-all cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-n-50 flex items-center justify-center text-2xl shrink-0">{c.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-[13px] font-semibold text-n-950 leading-tight">{c.title}</p>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${c.levelClass}`}>{c.level}</span>
                </div>
                <p className="text-[11px] text-n-600 mb-2">{c.provider} · {c.duration}</p>
                {c.progress != null ? (
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-n-500">In progress</span>
                      <span className="font-semibold text-n-950">{c.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-n-100 rounded-full overflow-hidden">
                      <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${c.progress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button className="h-7 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[11px] font-semibold transition-colors">Start →</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div className="bg-white rounded-2xl shadow-4dp">
        <div className="px-6 py-4 border-b border-n-100">
          <span className="text-[13px] font-semibold text-n-950">Completed</span>
        </div>
        <div className="divide-y divide-n-50">
          {COMPLETED.map((c, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3 hover:bg-n-50 transition-colors">
              <span className="text-lg shrink-0">{c.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-n-950">{c.title}</p>
                <p className="text-[11px] text-n-600">{c.provider} · {c.duration}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-g-100 text-g-800">Completed</span>
                <p className="text-[10px] text-n-500 mt-0.5">{c.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
