import { useState } from 'react'
import { useApp } from '../App'

const ACTOR_TABS = ['My Goals', 'Team Goals', 'Company Goals']

const STATS = [
  { label: 'On Track',  value: '3', icon: '🎯', color: 'bg-g-50 text-g-800' },
  { label: 'At Risk',   value: '1', icon: '⚠️', color: 'bg-y-50 text-y-700' },
  { label: 'Behind',    value: '1', icon: '🔴', color: 'bg-r-50 text-r-600' },
]

const MY_GOALS = [
  {
    id: 1,
    title: 'Become a Senior Designer',
    description: 'Complete all required milestones to get promoted to Senior Designer by Q3 2026',
    priority: 'High', priorityClass: 'bg-r-100 text-r-600',
    status: 'On track', statusClass: 'bg-g-100 text-g-800',
    progress: 60,
    deadline: 'Q3 2026',
    keyResults: [
      { text: 'Complete UX Research certification', done: true },
      { text: 'Lead Q3 Design Sprint', done: false, pct: 65 },
      { text: 'Complete 6 mentorship sessions', done: false, pct: 40 },
      { text: 'Stakeholder management course', done: false, pct: 0 },
    ],
  },
  {
    id: 2,
    title: 'Improve Design System Skills',
    description: 'Master advanced design systems to contribute to product-wide component library',
    priority: 'Medium', priorityClass: 'bg-y-100 text-y-700',
    status: 'On track', statusClass: 'bg-g-100 text-g-800',
    progress: 75,
    deadline: 'Jun 2026',
    keyResults: [
      { text: 'Advanced Figma certification', done: true },
      { text: 'Contribute 10 components to design system', done: false, pct: 80 },
      { text: 'Document component guidelines', done: false, pct: 50 },
    ],
  },
  {
    id: 3,
    title: 'Strengthen Stakeholder Communication',
    description: 'Present quarterly design reviews and get positive stakeholder feedback',
    priority: 'Medium', priorityClass: 'bg-y-100 text-y-700',
    status: 'At risk', statusClass: 'bg-y-100 text-y-700',
    progress: 25,
    deadline: 'May 2026',
    keyResults: [
      { text: 'Stakeholder management course (4h)', done: false, pct: 0 },
      { text: 'Lead 3 cross-team design reviews', done: false, pct: 33 },
    ],
  },
]

const TEAM_GOALS = [
  {
    id: 1,
    title: 'Increase Design System Adoption',
    description: 'All product teams use the shared design system for new features',
    priority: 'High', priorityClass: 'bg-r-100 text-r-600',
    status: 'On track', statusClass: 'bg-g-100 text-g-800',
    progress: 70, deadline: 'Q2 2026',
    keyResults: [
      { text: '4 of 5 product areas migrated', done: false, pct: 80 },
      { text: 'Component library v2 shipped', done: true },
    ],
  },
  {
    id: 2,
    title: 'Complete Q1 2026 Performance Reviews',
    description: 'All team members complete self-assessment and receive manager review',
    priority: 'High', priorityClass: 'bg-r-100 text-r-600',
    status: 'Behind', statusClass: 'bg-r-100 text-r-600',
    progress: 45, deadline: 'Apr 15, 2026',
    keyResults: [
      { text: '5 of 8 self-assessments submitted', done: false, pct: 63 },
      { text: 'Manager reviews in progress', done: false, pct: 30 },
    ],
  },
]

const COMPANY_GOALS = [
  {
    id: 1,
    title: 'Grow Product Team by 20%',
    description: 'Hire and onboard 8 new product team members by end of year',
    priority: 'High', priorityClass: 'bg-r-100 text-r-600',
    status: 'On track', statusClass: 'bg-g-100 text-g-800',
    progress: 50, deadline: 'Dec 2026',
    keyResults: [
      { text: '4 of 8 hires completed', done: false, pct: 50 },
      { text: 'Onboarding program launched', done: true },
    ],
  },
]

const GOALS_BY_TAB = { 'My Goals': MY_GOALS, 'Team Goals': TEAM_GOALS, 'Company Goals': COMPANY_GOALS }

function GoalCard({ goal }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white rounded-2xl shadow-4dp hover:shadow-8dp transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${goal.priorityClass}`}>{goal.priority}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${goal.statusClass}`}>{goal.status}</span>
            </div>
            <p className="text-[14px] font-semibold text-n-950">{goal.title}</p>
            <p className="text-[12px] text-n-600 mt-0.5">{goal.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-n-500">Due</p>
            <p className="text-[11px] font-semibold text-n-950">{goal.deadline}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-2 bg-n-100 rounded-full overflow-hidden">
            <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${goal.progress}%` }} />
          </div>
          <span className="text-[11px] font-semibold text-n-950 shrink-0">{goal.progress}%</span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[12px] text-h-600 font-medium hover:underline"
        >
          {expanded ? 'Hide key results ↑' : `Show ${goal.keyResults.length} key results ↓`}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-n-100 p-5">
          <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Key Results</p>
          <div className="flex flex-col gap-2.5">
            {goal.keyResults.map((kr, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center ${kr.done ? 'bg-h-500' : 'border-2 border-n-300'}`}>
                  {kr.done && <span className="text-white text-[9px]">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[12px] ${kr.done ? 'line-through text-n-500' : 'text-n-950'}`}>{kr.text}</p>
                  {!kr.done && kr.pct != null && kr.pct > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 bg-n-100 rounded-full overflow-hidden">
                        <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${kr.pct}%` }} />
                      </div>
                      <span className="text-[10px] text-n-500 shrink-0">{kr.pct}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Goals() {
  const [tab, setTab] = useState('My Goals')
  const goals = GOALS_BY_TAB[tab] || []

  const onTrack = goals.filter(g => g.status === 'On track').length
  const atRisk  = goals.filter(g => g.status === 'At risk').length
  const behind  = goals.filter(g => g.status === 'Behind').length

  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-n-950">Goals</h1>
          <p className="text-[13px] text-n-600 mt-0.5">Set, track, and align your objectives</p>
        </div>
        <button className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors">+ New Goal</button>
      </div>

      {/* Actor tabs */}
      <div className="flex items-center gap-1 bg-n-100 p-1 rounded-xl mb-6 self-start w-fit">
        {ACTOR_TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`h-8 px-4 rounded-lg text-[13px] transition-all ${tab === t ? 'bg-white shadow-4dp text-n-950 font-semibold' : 'text-n-600 hover:text-n-950'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'On Track', value: onTrack, icon: '🎯', color: 'bg-g-50 text-g-800' },
          { label: 'At Risk',  value: atRisk,  icon: '⚠️', color: 'bg-y-50 text-y-700' },
          { label: 'Behind',   value: behind,  icon: '🔴', color: 'bg-r-50 text-r-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-bold text-n-950">{s.value}</p>
              <p className="text-[11px] text-n-600">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Goal cards */}
      <div className="flex flex-col gap-4">
        {goals.map(g => <GoalCard key={g.id} goal={g} />)}
        {goals.length === 0 && (
          <div className="bg-white rounded-2xl shadow-4dp p-12 text-center">
            <p className="text-2xl mb-2">🎯</p>
            <p className="text-[13px] font-semibold text-n-950">No goals yet</p>
            <p className="text-[12px] text-n-500 mt-1">Create a new goal to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
