import { useState } from 'react'
import { Lock, Eye, EyeOff, X, Plus, Trash2, Edit3, ChevronDown, ChevronRight } from 'lucide-react'
import { useApp } from '../App'

const RESTRICTED_PASSWORD = 'humand2026'

function PasswordModal({ tabLabel, onSuccess, onClose }) {
  const [pw, setPw]       = useState('')
  const [show, setShow]   = useState(false)
  const [error, setError] = useState(false)

  const attempt = () => {
    if (pw === RESTRICTED_PASSWORD) { onSuccess() }
    else { setError(true); setTimeout(() => setError(false), 2500) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-n-950/30 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-8dp w-full max-w-sm p-8 text-center border border-n-200 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-n-500 hover:text-n-950 transition"><X size={16} /></button>
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-h-500 flex items-center justify-center">
          <Lock size={20} className="text-white" />
        </div>
        <h2 className="text-base font-semibold text-n-950 mb-1">Acceso restringido</h2>
        <p className="text-xs text-n-800 mb-5">La sección <strong>{tabLabel}</strong> requiere contraseña.</p>
        <div className="relative mb-3">
          <input
            type={show ? 'text' : 'password'}
            value={pw}
            autoFocus
            onChange={e => { setPw(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Contraseña"
            className={`input-humand pr-10 ${error ? 'border-r-400' : ''}`}
          />
          <button onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-n-500 hover:text-n-950">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {error && <p className="text-xs text-r-600 font-semibold mb-3">Contraseña incorrecta.</p>}
        <button onClick={attempt} className="w-full h-10 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition">
          Ingresar
        </button>
      </div>
    </div>
  )
}

/* ─── shared helpers ─────────────────────────────────────────────── */
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
  { id: 'n1', label: 'Junior Designer', sub: 'Done · L1',    ring: '#28c040', done: true,    type: 'done'    },
  { id: 'n2', label: 'Product Designer', sub: 'Current · L2', ring: '#496be3', current: true, type: 'current' },
  { id: 'n3', label: 'Senior Designer', sub: 'Target · L3',  ring: '#9db8f3', type: 'target' },
  { id: 'n4', label: 'Design Lead',     sub: 'Locked · L4',  ring: '#cbcdd6', locked: true,  type: 'locked'  },
  { id: 'n5', label: 'UX Researcher',   sub: 'Lateral · L2', ring: '#886bff', type: 'lateral' },
]

const CONNECTORS = ['solid', 'solid', 'dashed', 'dotted']

function PathNode({ node, filter }) {
  if (filter !== 'All') {
    if (filter === 'Vertical' && node.type === 'lateral') return null
    if (filter === 'Lateral' && node.type !== 'lateral' && node.type !== 'current') return null
  }
  const opacity = node.locked ? 'opacity-55' : 'opacity-100'
  return (
    <div className={`flex flex-col items-center gap-1.5 ${opacity}`}>
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xl relative"
        style={{
          border: `3px solid ${node.ring}`,
          boxShadow: node.current ? `0 0 0 4px ${node.ring}33` : undefined,
          background: node.done ? '#f5fdf6' : node.current ? '#f1f4fd' : node.type === 'lateral' ? '#f4f2ff' : '#fff',
        }}
      >
        {node.done && <span className="text-g-600 text-lg">✓</span>}
        {node.current && <span className="text-h-600 text-sm font-bold">L2</span>}
        {node.type === 'target' && <span className="text-h-400 text-sm font-bold">L3</span>}
        {node.locked && <span className="text-n-400 text-lg">🔒</span>}
        {node.type === 'lateral' && <span className="text-p-500 text-sm font-bold">L2</span>}
      </div>
      <p className="text-[11px] font-semibold text-n-950 text-center leading-tight max-w-[72px]">{node.label}</p>
      <p className="text-[10px] text-n-500 text-center">{node.sub}</p>
    </div>
  )
}

function EmployeeTab() {
  const [filter, setFilter] = useState('All')
  const GOALS = [
    { done: true,  text: 'Complete UX Research course',     meta: 'Completed · Mar 1' },
    { done: true,  text: 'Lead cross-functional project',   meta: 'Completed · Feb 15' },
    { done: true,  text: 'Advanced Figma certification',    meta: 'Completed · Mar 10' },
    { done: false, text: 'Lead Q3 Design Sprint',           meta: 'Due Apr 30' },
    { done: false, text: 'Mentorship sessions (×6)',        meta: 'Due May 15' },
  ]
  const SKILLS = [
    { name: 'Visual Design',      pct: 90, status: 'OK' },
    { name: 'UX Research',        pct: 60, status: 'Low' },
    { name: 'Prototyping',        pct: 85, status: 'OK' },
    { name: 'Stakeholder Mgmt',   pct: 35, status: 'Gap' },
    { name: 'Design Systems',     pct: 75, status: 'OK' },
  ]
  const ACTIONS = [
    { emoji: '📗', title: 'Stakeholder Management', sub: 'LinkedIn Learning · 4h', tags: ['Learning', 'High priority'], tagColors: ['bg-g-100 text-g-800', 'bg-r-100 text-r-600'] },
    { emoji: '🚀', title: 'Lead Q3 Design Sprint',  sub: 'Stretch project · Ongoing', tags: ['Project', 'Assigned'], tagColors: ['bg-h-100 text-h-800', 'bg-t-100 text-t-800'] },
    { emoji: '💛', title: 'Mentorship · Ana García', sub: 'Design Lead · Monthly', tags: ['Mentorship', 'Active'], tagColors: ['bg-y-100 text-y-700', 'bg-g-100 text-g-800'] },
  ]

  return (
    <div className="flex gap-5">
      {/* LEFT */}
      <div className="flex flex-col gap-4" style={{ width: 260 }}>
        {/* Role hero */}
        <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(140deg, #3851d8 0%, #29317f 100%)' }}>
          <p className="text-[9px] font-semibold uppercase tracking-widest opacity-65 mb-2">Current Role</p>
          <p className="text-lg font-bold mb-0.5">Product Designer</p>
          <p className="text-[12px] opacity-75 mb-3">Design Team · Mid-level</p>
          <div className="flex gap-2">
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">2.5 yr tenure</span>
            <span className="text-[10px] font-semibold bg-white bg-opacity-20 px-2.5 py-1 rounded-full">Score 87%</span>
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-5 py-3.5 border-b border-n-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-n-950">Overall Progress</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-h-100 text-h-800">Goal set</span>
          </div>
          <div className="p-5 flex items-center gap-4">
            <ProgressRing pct={60} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-bold text-n-950 mb-0.5">Senior Designer</p>
              <p className="text-[11px] text-n-600 mb-0.5">Est. Q3 2026</p>
              <p className="text-[11px] text-n-600 mb-2">3 of 5 goals complete</p>
              <div className="w-full h-1.5 bg-n-100 rounded-full overflow-hidden">
                <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Dev goals */}
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-5 py-3.5 border-b border-n-100 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-n-950">Development Goals</p>
              <p className="text-[11px] text-n-600">3 of 5 completed</p>
            </div>
            <button className="text-[12px] text-n-600 hover:text-n-950 font-medium border border-n-200 rounded-lg px-2.5 h-7">Edit</button>
          </div>
          <div className="p-4 flex flex-col gap-2">
            {GOALS.map((g, i) => (
              <div key={i} className={`flex items-start gap-2.5 p-2 rounded-lg ${g.done ? 'bg-h-50' : ''}`}>
                <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center ${g.done ? 'bg-h-500' : 'border-2 border-n-300'}`}>
                  {g.done && <span className="text-white text-[9px]">✓</span>}
                </div>
                <div className="min-w-0">
                  <p className={`text-[12px] leading-tight ${g.done ? 'line-through text-n-500' : 'text-n-950'}`}>{g.text}</p>
                  <p className={`text-[10px] mt-0.5 ${g.done ? 'text-h-600' : 'text-n-500'}`}>{g.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {/* Career path map */}
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-n-950">Career Path Map</p>
              <p className="text-[11px] text-n-600">Vertical and lateral opportunities</p>
            </div>
            <div className="flex gap-1.5">
              {['All', 'Vertical', 'Lateral'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`h-7 px-3 rounded-lg text-[12px] font-medium transition-all ${filter === f ? 'bg-h-500 text-white' : 'bg-n-100 text-n-600 hover:bg-n-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-0">
              {PATH_NODES.map((node, i) => (
                <div key={node.id} className="flex items-center">
                  <PathNode node={node} filter={filter} />
                  {i < PATH_NODES.length - 1 && (
                    <div className="flex items-center" style={{ width: 40 }}>
                      <div
                        className="flex-1 h-0.5"
                        style={{
                          borderTop: `2px ${CONNECTORS[i] === 'dotted' ? 'dotted' : CONNECTORS[i] === 'dashed' ? 'dashed' : 'solid'} ${CONNECTORS[i] === 'solid' && i === 0 ? '#28c040' : CONNECTORS[i] === 'solid' ? '#496be3' : '#cbcdd6'}`,
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill gaps */}
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-semibold text-n-950">Skill Gaps</p>
              <p className="text-[11px] text-n-600">vs. Senior Designer</p>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-r-100 text-r-600">2 gaps</span>
          </div>
          <div className="p-5 flex flex-col gap-3">
            {SKILLS.map(s => <SkillBar key={s.name} {...s} />)}
          </div>
        </div>

        {/* Recommended actions */}
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
            <p className="text-[13px] font-semibold text-n-950">Recommended Actions</p>
            <button className="text-[12px] text-h-600 font-medium hover:underline">View all →</button>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {ACTIONS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-n-50 hover:bg-h-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white shadow-4dp flex items-center justify-center text-lg shrink-0">{a.emoji}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-n-950">{a.title}</p>
                  <p className="text-[11px] text-n-600 mb-1.5">{a.sub}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {a.tags.map((t, ti) => (
                      <span key={t} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.tagColors[ti]}`}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── MANAGER TAB ───────────────────────────────────────────────── */
const TEAM = [
  { initials: 'AG', name: 'Ana García',   role: 'Product Designer',   badge: 'bg-y-100 text-y-700',  badgeLabel: 'Review',      color: 'bg-h-100 text-h-600' },
  { initials: 'LH', name: 'Luis Herrera', role: 'Frontend Engineer',  badge: 'bg-h-100 text-h-800',  badgeLabel: 'In progress', color: 'bg-t-100 text-t-800' },
  { initials: 'MT', name: 'Mia Torres',   role: 'UX Researcher',      badge: 'bg-h-100 text-h-800',  badgeLabel: 'Goal set',    color: 'bg-p-100 text-p-800' },
  { initials: 'CR', name: 'Carlos Ruiz',  role: 'Backend Engineer',   badge: 'bg-h-100 text-h-800',  badgeLabel: 'In progress', color: 'bg-g-100 text-g-800' },
  { initials: 'SL', name: 'Sara López',   role: 'Data Analyst',       badge: 'bg-n-100 text-n-600',  badgeLabel: 'No path',     color: 'bg-y-100 text-y-700' },
]

const ANA_SKILLS = [
  { name: 'Visual Design',    pct: 90, status: 'OK' },
  { name: 'Stakeholder Mgmt', pct: 35, status: 'Gap' },
  { name: 'UX Research',      pct: 60, status: 'Low' },
]
const ANA_GOALS = [
  { done: true,  text: 'Complete UX Research course', meta: 'Completed · Mar 1',  pct: null },
  { done: false, text: 'Lead Q3 Design Sprint',       meta: 'Due Apr 30',         pct: 65 },
  { done: false, text: 'Mentorship sessions (×6)',    meta: 'Due May 15',         pct: 40 },
]

function ManagerTab() {
  const [selected, setSelected] = useState(0)
  const [feedback, setFeedback] = useState('')

  return (
    <div className="flex gap-5">
      {/* LEFT: team list */}
      <div style={{ width: 280 }}>
        <div className="bg-white rounded-2xl shadow-4dp">
          <div className="px-5 py-3.5 border-b border-n-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-n-950">My Team</span>
            <span className="text-[11px] text-n-600">5 direct reports</span>
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
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${m.badge}`}>{m.badgeLabel}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: detail */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        {selected === 0 && (
          <>
            {/* Alert banner */}
            <div className="rounded-2xl bg-y-50 border border-y-200 px-5 py-4 flex items-start gap-3">
              <span className="text-xl shrink-0 mt-0.5">⚠️</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-n-950">Ana García submitted a career plan for review</p>
                <p className="text-[12px] text-n-600 mt-0.5">Target: Senior Designer · Submitted Mar 15, 2026</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button className="h-8 px-3 text-[12px] font-semibold border border-g-600 text-g-800 rounded-lg hover:bg-g-50 transition-colors">✓ Approve</button>
                <button className="h-8 px-3 text-[12px] font-semibold border border-y-600 text-y-700 rounded-lg hover:bg-y-50 transition-colors">↩ Suggest changes</button>
              </div>
            </div>

            {/* Career plan */}
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-n-950">Ana García — Career Plan</p>
                  <p className="text-[11px] text-n-600">Target: Senior Designer · 60% complete</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-y-100 text-y-700">Under review</span>
              </div>
              <div className="p-5 flex flex-col gap-5">
                {/* Skill gaps */}
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Skill Gap Overview</p>
                  <div className="flex flex-col gap-2.5">
                    {ANA_SKILLS.map(s => <SkillBar key={s.name} {...s} />)}
                  </div>
                </div>

                {/* Dev goals */}
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Development Goals</p>
                  <div className="flex flex-col gap-2">
                    {ANA_GOALS.map((g, i) => (
                      <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg ${g.done ? 'bg-h-50' : ''}`}>
                        <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center ${g.done ? 'bg-h-500' : 'border-2 border-n-300'}`}>
                          {g.done && <span className="text-white text-[9px]">✓</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[12px] leading-tight ${g.done ? 'line-through text-n-500' : 'text-n-950 font-medium'}`}>{g.text}</p>
                          <p className="text-[10px] text-n-500 mt-0.5">{g.meta}</p>
                          {g.pct != null && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1.5 bg-n-100 rounded-full overflow-hidden">
                                <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${g.pct}%` }} />
                              </div>
                              <span className="text-[10px] text-n-600 shrink-0">{g.pct}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assign opportunities */}
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Assign Opportunities</p>
                  <div className="flex gap-2">
                    <button className="h-9 px-4 bg-white border border-n-200 shadow-4dp hover:shadow-8dp text-n-950 rounded-lg text-[13px] font-semibold transition-shadow">+ Assign project</button>
                    <button className="h-9 px-4 bg-white border border-n-200 shadow-4dp hover:shadow-8dp text-n-950 rounded-lg text-[13px] font-semibold transition-shadow">+ Assign mentor</button>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-2">Leave Feedback</p>
                  <textarea
                    className="textarea-humand"
                    placeholder="Share your feedback on Ana's career plan..."
                    value={feedback}
                    onChange={e => setFeedback(e.target.value)}
                  />
                  <button className="mt-2 h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors">Send feedback</button>
                </div>
              </div>
            </div>
          </>
        )}

        {selected !== 0 && (
          <div className="bg-white rounded-2xl shadow-4dp flex items-center justify-center h-40">
            <p className="text-[13px] text-n-500">Select a team member to view their career plan</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── HR ADMIN TAB ──────────────────────────────────────────────── */
const HR_STATS = [
  { emoji: '🗺️', value: '12', label: 'Career paths defined' },
  { emoji: '✅', value: '38', label: 'Employees with active paths' },
  { emoji: '🔄', value: '7',  label: 'Plans under review' },
  { emoji: '🏆', value: '4',  label: 'Promotion-ready' },
]

const CAREER_PATHS = [
  {
    section: 'DESIGN',
    items: [
      { id: 'sd', label: 'Senior Designer', level: 'Level 3', count: 8,  dot: '#496be3' },
      { id: 'pd', label: 'Product Designer', level: 'Level 2', count: 14, dot: '#9db8f3' },
      { id: 'jd', label: 'Junior Designer',  level: 'Level 1', count: 6,  dot: '#c5d4f8' },
      { id: 'dl', label: 'Design Lead',      level: 'Level 4', count: 3,  dot: '#29317f' },
    ],
  },
  {
    section: 'ENGINEERING',
    items: [
      { id: 'se', label: 'Senior Engineer',  level: 'Level 3', count: 12, dot: '#35a48e' },
      { id: 'le', label: 'Lead Engineer',    level: 'Level 4', count: 5,  dot: '#1f5049' },
    ],
  },
  {
    section: 'PRODUCT',
    items: [
      { id: 'pm', label: 'Product Manager',  level: 'Level 3', count: 7,  dot: '#886bff' },
    ],
  },
]


/* ─── COMPETENCY FRAMEWORK BUILDER ─────────────────────────────── */
const CAT_OPTIONS = ['Técnico', 'Liderazgo', 'Soft Skills', 'Estrategia', 'Otro']
const CAT_COLORS  = { 'Técnico': 'bg-h-50 text-h-800', 'Liderazgo': 'bg-p-50 text-p-800', 'Soft Skills': 'bg-t-50 text-t-800', 'Estrategia': 'bg-y-50 text-y-700', 'Otro': 'bg-n-100 text-n-800' }

function CompetencyBuilder() {
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
        <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
          <div className="px-4 py-3.5 border-b border-n-100 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-n-950">Competencias</span>
            <button onClick={startNewComp} className="h-7 px-2.5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1">
              <Plus size={11} /> Nueva
            </button>
          </div>
          <div className="p-2 flex flex-col gap-0.5">
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

/* ─── LEVEL OBJECTIVES BUILDER ──────────────────────────────────── */
const LEVEL_COLORS = { L1: '#c5d4f8', L2: '#496be3', L3: '#3851d8', L4: '#29317f' }
const AREA_OPTIONS = ['Técnico', 'Liderazgo', 'Colaboración', 'Visibilidad', 'Estrategia', 'Aprendizaje', 'Impacto']
const AREA_BADGE   = { 'Técnico': 'bg-h-50 text-h-700', 'Liderazgo': 'bg-p-50 text-p-700', 'Colaboración': 'bg-t-50 text-t-700', 'Visibilidad': 'bg-s-100 text-s-800', 'Estrategia': 'bg-y-50 text-y-700', 'Aprendizaje': 'bg-g-50 text-g-800', 'Impacto': 'bg-r-50 text-r-600' }

function LevelObjectivesBuilder() {
  const { levelObjectives, setLevelObjectives } = useApp()
  const [adding, setAdding]   = useState(null)   // level key of open form
  const [draft, setDraft]     = useState({ area: 'Técnico', text: '' })
  const [editingObj, setEditingObj] = useState(null) // { level, id }
  const [editDraft, setEditDraft]   = useState({ area: 'Técnico', text: '' })

  const addObj = (level) => {
    if (!draft.text.trim()) return
    setLevelObjectives(p => p.map(l => l.level === level
      ? { ...l, objectives: [...l.objectives, { id: Date.now(), area: draft.area, text: draft.text.trim() }] }
      : l))
    setDraft({ area: 'Técnico', text: '' })
    setAdding(null)
  }
  const deleteObj = (level, id) => {
    setLevelObjectives(p => p.map(l => l.level === level ? { ...l, objectives: l.objectives.filter(o => o.id !== id) } : l))
  }
  const saveEdit = () => {
    if (!editDraft.text.trim() || !editingObj) return
    setLevelObjectives(p => p.map(l => l.level === editingObj.level
      ? { ...l, objectives: l.objectives.map(o => o.id === editingObj.id ? { ...o, ...editDraft } : o) }
      : l))
    setEditingObj(null)
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {levelObjectives.map(lvl => (
        <div key={lvl.level} className="bg-white rounded-2xl shadow-4dp overflow-hidden flex flex-col">
          {/* Level header */}
          <div className="px-4 py-3 flex items-center gap-2 border-b border-n-100" style={{ borderTop: `3px solid ${LEVEL_COLORS[lvl.level]}` }}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ backgroundColor: LEVEL_COLORS[lvl.level] }}>{lvl.level}</span>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-n-950">{lvl.title}</p>
              <p className="text-[10px] text-n-600">{lvl.objectives.length} objetivos</p>
            </div>
            <button onClick={() => { setAdding(lvl.level); setDraft({ area: 'Técnico', text: '' }) }}
              className="w-6 h-6 rounded-lg bg-n-100 hover:bg-h-100 text-n-600 hover:text-h-600 flex items-center justify-center transition">
              <Plus size={12} />
            </button>
          </div>

          {/* Objectives list */}
          <div className="flex-1 p-3 flex flex-col gap-2">
            {lvl.objectives.length === 0 && <p className="text-[11px] text-n-400 italic text-center py-3">Sin objetivos aún</p>}
            {lvl.objectives.map(obj => (
              <div key={obj.id}>
                {editingObj?.id === obj.id && editingObj?.level === lvl.level ? (
                  <div className="bg-h-50 border border-h-100 rounded-lg p-2 flex flex-col gap-1.5">
                    <select value={editDraft.area} onChange={e => setEditDraft(d => ({ ...d, area: e.target.value }))} className="input-humand text-xs" style={{ height: 28 }}>
                      {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <textarea value={editDraft.text} onChange={e => setEditDraft(d => ({ ...d, text: e.target.value }))} rows={2} className="textarea-humand text-xs" style={{ minHeight: 52 }} />
                    <div className="flex gap-1.5 justify-end">
                      <button onClick={() => setEditingObj(null)} className="text-[11px] text-n-600 hover:text-n-950">Cancelar</button>
                      <button onClick={saveEdit} className="h-6 px-2 bg-h-500 text-white rounded text-[11px] font-semibold hover:bg-h-600 transition">OK</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-2 rounded-lg border border-n-100 hover:border-n-200 group transition-colors">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${AREA_BADGE[obj.area] || 'bg-n-100 text-n-700'}`}>{obj.area}</span>
                    <p className="flex-1 text-[12px] text-n-800 leading-relaxed">{obj.text}</p>
                    <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                      <button onClick={() => { setEditingObj({ level: lvl.level, id: obj.id }); setEditDraft({ area: obj.area, text: obj.text }) }}
                        className="p-0.5 text-n-400 hover:text-h-600 transition"><Edit3 size={11} /></button>
                      <button onClick={() => deleteObj(lvl.level, obj.id)}
                        className="p-0.5 text-n-400 hover:text-r-600 transition"><Trash2 size={11} /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add form inline */}
            {adding === lvl.level && (
              <div className="bg-h-50 border border-h-100 rounded-lg p-2 flex flex-col gap-1.5 animate-slide-in">
                <select value={draft.area} onChange={e => setDraft(d => ({ ...d, area: e.target.value }))} className="input-humand text-xs" style={{ height: 28 }}>
                  {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <textarea value={draft.text} onChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
                  placeholder="Describí el objetivo esperado para este nivel..."
                  rows={2} className="textarea-humand text-xs" style={{ minHeight: 52 }} />
                <div className="flex gap-1.5 justify-end">
                  <button onClick={() => setAdding(null)} className="text-[11px] text-n-600 hover:text-n-950">Cancelar</button>
                  <button onClick={() => addObj(lvl.level)} className="h-6 px-2 bg-h-500 text-white rounded text-[11px] font-semibold hover:bg-h-600 transition">Agregar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── BIBLIOTECA DE COMPETENCIAS ────────────────────────────────── */
const CAT_COLORS_LIB = {
  'Técnico':    'bg-h-50 text-h-700 border-h-100',
  'Liderazgo':  'bg-p-50 text-p-700 border-p-100',
  'Soft Skills':'bg-g-50 text-g-800 border-g-100',
}
function BibliotecaCompetencias() {
  const { competencies } = useApp()
  const [search, setSearch]       = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const CAT_OPTIONS = ['Técnico', 'Liderazgo', 'Soft Skills']
  const totalSkills = competencies.reduce((a, c) => a + c.skills.length, 0)
  const filtered = competencies
    .filter(c => filterCat === 'all' || c.category === filterCat)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some(s => s.name.toLowerCase().includes(search.toLowerCase())))
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Competencias totales', value: competencies.length, color: 'text-h-600' },
          { label: 'Habilidades mapeadas',  value: totalSkills,         color: 'text-p-700' },
          { label: 'Categorías',            value: CAT_OPTIONS.length,  color: 'text-g-800' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-n-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar competencia o habilidad..." className="input-humand w-64" style={{ height: 36 }} />
        <div className="flex gap-1.5">
          {[['all','Todas'], ...CAT_OPTIONS.map(c => [c,c])].map(([k,l]) => (
            <button key={k} onClick={() => setFilterCat(k)}
              className={`h-7 px-3 rounded-full text-[11px] font-semibold border transition-all ${filterCat === k ? 'bg-h-50 text-h-600 border-h-200' : 'bg-n-100 text-n-800 border-transparent hover:border-n-300'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(comp => (
          <div key={comp.id} className="bg-white rounded-2xl shadow-4dp border border-n-100 hover:shadow-8dp hover:border-h-200 transition-all p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CAT_COLORS_LIB[comp.category] || 'bg-n-100 text-n-700 border-n-200'}`}>{comp.category}</span>
                <h3 className="text-[14px] font-semibold text-n-950 mt-1.5">{comp.name}</h3>
                {comp.description && <p className="text-[12px] text-n-600 mt-0.5">{comp.description}</p>}
              </div>
              <span className="w-7 h-7 rounded-full bg-h-50 text-h-700 text-[11px] font-bold flex items-center justify-center shrink-0">{comp.skills.length}</span>
            </div>
            {comp.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {comp.skills.map(sk => (
                  <span key={sk.id} className="text-[11px] bg-n-50 text-n-700 px-2 py-0.5 rounded-lg border border-n-100">{sk.name}</span>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-12 text-n-500 bg-white rounded-2xl shadow-4dp"><p className="text-sm">No se encontraron competencias</p></div>
        )}
      </div>
    </div>
  )
}

/* ─── SALUD ORGANIZACIONAL ───────────────────────────────────────── */
const TEAM_HEALTH = [
  {
    team: 'Product Design', engagement: 82, planActivo: 75, retencion: 91, riesgo: 'bajo',
    members: [
      { name: 'Sofia Carro',    initials: 'SC', color: 'bg-h-100 text-h-700', role: 'Mid Designer',    plan: { active: true,  title: 'Avanzar a Senior Designer',     progress: 68, nextLevel: 'Senior' } },
      { name: 'Ana Martínez',   initials: 'AM', color: 'bg-p-100 text-p-700', role: 'Senior Designer', plan: { active: true,  title: 'Avanzar a Lead Designer',       progress: 45, nextLevel: 'Lead'   } },
      { name: 'Tomás Ríos',     initials: 'TR', color: 'bg-g-100 text-g-800', role: 'Junior Designer', plan: { active: true,  title: 'Avanzar a Mid Designer',        progress: 30, nextLevel: 'Mid'    } },
      { name: 'Lucía Pérez',    initials: 'LP', color: 'bg-y-100 text-y-700', role: 'Junior Designer', plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
    ],
  },
  {
    team: 'Frontend Engineering', engagement: 74, planActivo: 60, retencion: 84, riesgo: 'medio',
    members: [
      { name: 'Carlos Ruiz',    initials: 'CR', color: 'bg-h-100 text-h-700', role: 'Mid Frontend',    plan: { active: true,  title: 'Avanzar a Senior Frontend',     progress: 55, nextLevel: 'Senior' } },
      { name: 'Martina Sol',    initials: 'MS', color: 'bg-t-100 text-t-700', role: 'Senior Frontend', plan: { active: true,  title: 'Especialización en Arquitectura', progress: 72, nextLevel: 'Lead'  } },
      { name: 'Diego Vega',     initials: 'DV', color: 'bg-p-100 text-p-700', role: 'Junior Frontend', plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Paula Méndez',   initials: 'PM', color: 'bg-r-100 text-r-600', role: 'Mid Frontend',    plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Nicolás Vidal',  initials: 'NV', color: 'bg-g-100 text-g-800', role: 'Junior Frontend', plan: { active: true,  title: 'Avanzar a Mid Frontend',        progress: 22, nextLevel: 'Mid'    } },
    ],
  },
  {
    team: 'Backend Engineering', engagement: 68, planActivo: 45, retencion: 78, riesgo: 'alto',
    members: [
      { name: 'Rodrigo Blanco', initials: 'RB', color: 'bg-n-200 text-n-700', role: 'Mid Backend',     plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Fernanda Ortiz', initials: 'FO', color: 'bg-h-100 text-h-700', role: 'Senior Backend',  plan: { active: true,  title: 'Tech Lead Backend',             progress: 40, nextLevel: 'Lead'   } },
      { name: 'Gustavo Sosa',   initials: 'GS', color: 'bg-n-200 text-n-700', role: 'Junior Backend',  plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Emilia Castro',  initials: 'EC', color: 'bg-p-100 text-p-700', role: 'Mid Backend',     plan: { active: true,  title: 'Avanzar a Senior Backend',      progress: 60, nextLevel: 'Senior' } },
    ],
  },
  {
    team: 'Data & Analytics', engagement: 79, planActivo: 70, retencion: 88, riesgo: 'bajo',
    members: [
      { name: 'Valentina Cruz', initials: 'VC', color: 'bg-t-100 text-t-700', role: 'Data Analyst',    plan: { active: true,  title: 'Avanzar a Senior Analyst',      progress: 65, nextLevel: 'Senior' } },
      { name: 'Matías Leal',    initials: 'ML', color: 'bg-h-100 text-h-700', role: 'Senior Analyst',  plan: { active: true,  title: 'Data Science Lead',             progress: 50, nextLevel: 'Lead'   } },
      { name: 'Camila Rojas',   initials: 'CR', color: 'bg-g-100 text-g-800', role: 'Junior Analyst',  plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
    ],
  },
  {
    team: 'People & Culture', engagement: 88, planActivo: 90, retencion: 94, riesgo: 'bajo',
    members: [
      { name: 'Laura Romero',   initials: 'LR', color: 'bg-p-100 text-p-700', role: 'HR Specialist',   plan: { active: true,  title: 'Avanzar a HR Business Partner', progress: 80, nextLevel: 'Senior' } },
      { name: 'Sebastián Gil',  initials: 'SG', color: 'bg-h-100 text-h-700', role: 'Talent Manager',  plan: { active: true,  title: 'Head of People',                progress: 55, nextLevel: 'Lead'   } },
      { name: 'Agustina Mora',  initials: 'AM', color: 'bg-g-100 text-g-800', role: 'HR Analyst',      plan: { active: true,  title: 'Avanzar a HR Specialist',       progress: 70, nextLevel: 'Mid'    } },
    ],
  },
  {
    team: 'Growth Marketing', engagement: 65, planActivo: 40, retencion: 75, riesgo: 'alto',
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

function SaludOrganizacional() {
  const [expanded, setExpanded] = useState(null)
  const toggle = (team) => setExpanded(e => e === team ? null : team)
  const avg = (key) => Math.round(TEAM_HEALTH.reduce((a, t) => a + t[key], 0) / TEAM_HEALTH.length)
  const riesgoAlto = TEAM_HEALTH.filter(t => t.riesgo === 'alto').length

  return (
    <div className="flex flex-col gap-5">
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
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] items-center px-6 py-2.5 border-b border-n-100 bg-n-50">
          {['Equipo','Engagement','Plan activo','Retención proy.','Riesgo',''].map(h => (
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
                  className={`w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr_32px] items-center px-6 py-3.5 text-left transition-colors ${open ? 'bg-h-50' : 'hover:bg-n-50'}`}
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
                  <span className="text-[12px] text-n-600">{t.retencion}%</span>
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

      {/* Coverage bars */}
      <div className="bg-white rounded-2xl shadow-4dp p-5">
        <p className="text-[13px] font-semibold text-n-950 mb-4">Cobertura de planes por equipo</p>
        <div className="flex flex-col gap-3">
          {TEAM_HEALTH.map(t => {
            const withPlan = t.members.filter(m => m.plan.active).length
            const pct = Math.round((withPlan / t.members.length) * 100)
            return (
              <div key={t.team} className="flex items-center gap-3">
                <span className="text-[12px] text-n-800 w-44 truncate shrink-0">{t.team}</span>
                <div className="flex-1 h-2 bg-n-100 rounded-full overflow-hidden">
                  <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[12px] font-semibold text-n-950 w-16 text-right shrink-0">{withPlan}/{t.members.length}</span>
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
            <span key={s} className="text-[11px] bg-h-50 text-h-700 px-2 py-0.5 rounded-lg border border-h-100">{s}</span>
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
                  <span key={s} className="text-[10px] bg-r-50 text-r-600 px-2 py-0.5 rounded-lg border border-r-100">{s}</span>
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
  L2: { L1: true,  L2: false, L3: false, L4: false },
  L3: { L1: true,  L2: true,  L3: false, L4: false },
  L4: { L1: true,  L2: true,  L3: true,  L4: false },
  HR: { L1: true,  L2: true,  L3: true,  L4: true  },
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
  const VIEWERS = ['L2','L3','L4','HR']
  const VIEWER_LABELS = { L2:'Mid (L2)', L3:'Senior (L3)', L4:'Lead (L4)', HR:'HR Admin' }
  const toggle = (viewer, target) => setMatrix(m => ({ ...m, [viewer]: { ...m[viewer], [target]: !m[viewer][target] } }))
  const save   = () => { setSaved(true); setTimeout(() => setSaved(false), 2000) }
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-y-50 border border-y-200 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-xl shrink-0">⚠️</span>
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
          {saved ? '✓ Guardado' : 'Guardar configuración'}
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
function MetricasImpacto() {
  const NPS = 62
  const npsColor = NPS >= 50 ? 'text-g-700' : NPS >= 30 ? 'text-y-600' : 'text-r-600'
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '% con plan activo',    value: '72%',  sub: '+14% vs inicio año',     color: 'text-h-600' },
          { label: 'NPS del módulo',        value: NPS,    sub: 'Basado en 48 respuestas', color: npsColor    },
          { label: 'Retención (con plan)',  value: '91%',  sub: 'vs 74% sin plan',         color: 'text-g-700' },
          { label: 'Tiempo prom. a promo',  value: '9.2m', sub: '-2.1m vs año anterior',   color: 'text-p-700' },
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
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-4dp p-5">
        <p className="text-[13px] font-semibold text-n-950 mb-1">Evolución de competencias por área</p>
        <p className="text-[11px] text-n-600 mb-5">Score promedio del equipo — antes vs. después de activar planes</p>
        <div className="flex flex-col gap-4">
          {COMP_EVOLUTION.map(c => (
            <div key={c.area}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold text-n-950">{c.area}</span>
                <span className="text-[11px] font-bold text-g-700">+{c.after - c.before} pts</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-n-500 w-12 shrink-0">Antes</span>
                  <div className="flex-1 h-1.5 bg-n-100 rounded-full overflow-hidden">
                    <div className="h-full bg-n-300 rounded-full bar-fill" style={{ width: `${c.before}%` }} />
                  </div>
                  <span className="text-[10px] text-n-600 w-6 text-right shrink-0">{c.before}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-n-500 w-12 shrink-0">Después</span>
                  <div className="flex-1 h-1.5 bg-n-100 rounded-full overflow-hidden">
                    <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${c.after}%` }} />
                  </div>
                  <span className="text-[10px] text-h-600 font-semibold w-6 text-right shrink-0">{c.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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

/* ─── HR ADMIN TAB ──────────────────────────────────────────────── */
function HRAdminTab() {
  const [selectedPath, setSelectedPath] = useState('sd')
  const [section, setSection] = useState('paths') // 'paths' | 'competencias' | 'niveles'

  const SUB_TABS = [
    { id: 'paths',        label: '🗺️ Career Paths' },
    { id: 'competencias', label: '🧩 Competencias' },
    { id: 'niveles',      label: '🎯 Objetivos por Nivel' },
    { id: 'salud',        label: '💚 Salud Org.' },
    { id: 'headcount',    label: '🔍 Headcount' },
    { id: 'visibilidad',  label: '🔒 Visibilidad' },
    { id: 'metricas',     label: '📈 Métricas' },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {HR_STATS.map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4 flex items-center gap-3">
            <span className="text-2xl">{s.emoji}</span>
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
            className={`h-8 px-3 rounded-lg text-[12px] whitespace-nowrap transition-all ${section === t.id ? 'bg-white shadow-4dp text-n-950 font-semibold' : 'text-n-600 hover:text-n-950'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Career Paths ── */}
      {section === 'paths' && (
        <div className="flex gap-5">
          <div style={{ width: 240 }}>
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-5 py-3.5 border-b border-n-100 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-n-950">Career Paths</span>
                <button className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition-colors">+ New</button>
              </div>
              <div className="p-3 flex flex-col gap-1">
                {CAREER_PATHS.map(group => (
                  <div key={group.section}>
                    <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest px-2 py-1.5">{group.section}</p>
                    {group.items.map(item => (
                      <button key={item.id} onClick={() => setSelectedPath(item.id)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${selectedPath === item.id ? 'bg-p-50' : 'hover:bg-n-50'}`}>
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.dot }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-n-950 truncate">{item.label}</p>
                          <p className="text-[10px] text-n-600">{item.level}</p>
                        </div>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-n-100 text-n-600 shrink-0">{item.count}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="bg-white rounded-2xl shadow-4dp">
              <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-n-950">Senior Designer</p>
                  <p className="text-[11px] text-n-600">Design · Level 3 · 8 employees</p>
                </div>
                <div className="flex gap-2">
                  <button className="h-9 px-4 bg-white border border-n-200 shadow-4dp hover:shadow-8dp text-n-950 rounded-lg text-[13px] font-semibold transition-shadow">Edit path</button>
                  <button className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors">Save changes</button>
                </div>
              </div>
              <div className="p-5 flex flex-col gap-5">
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Required Skills &amp; Competencies</p>
                  <div className="flex flex-wrap gap-2">
                    {['Visual Design','Prototyping','UX Research','Figma Advanced','Stakeholder Mgmt','Design Systems'].map(s => (
                      <div key={s} className="flex items-center gap-1 bg-h-50 text-h-800 text-[12px] font-medium px-2.5 py-1 rounded-lg">
                        {s}<button className="text-h-400 hover:text-r-600 ml-1 leading-none">×</button>
                      </div>
                    ))}
                    <button className="flex items-center gap-1 bg-n-100 text-n-600 text-[12px] font-medium px-2.5 py-1 rounded-lg hover:bg-n-200 transition-colors">+ Add skill</button>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Role Requirements</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[['Min. experience','3+ years'],['Perf. score threshold','≥ 80%'],['Approval required','Manager + HR']].map(([label, val]) => (
                      <div key={label}>
                        <p className="text-[11px] text-n-600 mb-1">{label}</p>
                        <input className="input-humand" defaultValue={val} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Competencias ── */}
      {section === 'competencias' && <CompetencyBuilder />}

      {/* ── Objetivos por Nivel ── */}
      {section === 'niveles' && <LevelObjectivesBuilder />}


      {/* ── Salud Organizacional ── */}
      {section === 'salud' && <SaludOrganizacional />}

      {/* ── Headcount Planning ── */}
      {section === 'headcount' && <HeadcountPlanning />}

      {/* ── Configuración de Visibilidad ── */}
      {section === 'visibilidad' && <ConfigVisibilidad />}

      {/* ── Métricas de Impacto ── */}
      {section === 'metricas' && <MetricasImpacto />}
    </div>
  )
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────── */
const ACTOR_TABS = [
  { id: 'employee', label: 'Employee', dot: '#496be3' },
  { id: 'manager',  label: 'Manager',  dot: '#35a48e' },
  { id: 'hradmin',  label: 'HR Admin', dot: '#886bff' },
]

export default function CareerPath() {
  const [actor, setActor]           = useState('employee')
  const [pendingTab, setPendingTab] = useState(null)   // tab waiting for password
  const [unlocked, setUnlocked]     = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('cp_tabs_unlocked') || '[]') } catch { return [] }
  })

  const unlock = (tabId) => {
    const next = [...unlocked, tabId]
    setUnlocked(next)
    sessionStorage.setItem('cp_tabs_unlocked', JSON.stringify(next))
    setActor(tabId)
    setPendingTab(null)
  }

  const handleTabClick = (tabId) => {
    if (tabId === 'employee') { setActor('employee'); return }
    if (unlocked.includes(tabId)) { setActor(tabId); return }
    setPendingTab(tabId)
  }

  const pendingLabel = ACTOR_TABS.find(t => t.id === pendingTab)?.label || ''

  return (
    <div className="p-8 max-w-6xl mx-auto animate-slide-in">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-n-950">Career Path</h1>
          <p className="text-[13px] text-n-600 mt-0.5">Plan and track your career development</p>
        </div>

        {/* Actor switcher */}
        <div className="flex items-center gap-1 bg-n-100 p-1 rounded-xl">
          {ACTOR_TABS.map(tab => {
            const isRestricted = tab.id !== 'employee' && !unlocked.includes(tab.id)
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-4 h-8 rounded-lg text-[13px] transition-all ${actor === tab.id ? 'bg-white shadow-4dp text-n-950 font-semibold' : 'text-n-600 font-normal hover:text-n-950'}`}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: tab.dot }} />
                {tab.label}
                {isRestricted && <Lock size={11} className="opacity-50 ml-0.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {actor === 'employee' && <EmployeeTab />}
      {actor === 'manager'  && <ManagerTab />}
      {actor === 'hradmin'  && <HRAdminTab />}

      {pendingTab && (
        <PasswordModal
          tabLabel={pendingLabel}
          onSuccess={() => unlock(pendingTab)}
          onClose={() => setPendingTab(null)}
        />
      )}
    </div>
  )
}
