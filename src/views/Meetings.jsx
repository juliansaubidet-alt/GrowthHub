const UPCOMING = [
  {
    id: 1,
    title: '1:1 with Ana García',
    date: 'Mar 22, 2026',
    time: '10:00 AM',
    duration: '30 min',
    attendee: { initials: 'AG', name: 'Ana García', role: 'Design Lead', color: 'bg-h-100 text-h-600' },
    agenda: [
      'Career plan progress update',
      'Q3 Design Sprint kickoff discussion',
      'Mentorship sessions review',
      'Upcoming team goals alignment',
    ],
  },
]

const PAST = [
  {
    id: 1,
    title: '1:1 with Ana García',
    date: 'Mar 8, 2026',
    attendee: { initials: 'AG', name: 'Ana García', role: 'Design Lead', color: 'bg-h-100 text-h-600' },
    topics: ['Figma certification feedback', 'Career path next steps', 'Q1 review prep'],
    actionItems: 3,
  },
  {
    id: 2,
    title: '1:1 with Ana García',
    date: 'Feb 22, 2026',
    attendee: { initials: 'AG', name: 'Ana García', role: 'Design Lead', color: 'bg-h-100 text-h-600' },
    topics: ['Design sprint retrospective', 'Skill gap discussion', 'Goal-setting for Q1'],
    actionItems: 2,
  },
  {
    id: 3,
    title: '1:1 with Ana García',
    date: 'Feb 8, 2026',
    attendee: { initials: 'AG', name: 'Ana García', role: 'Design Lead', color: 'bg-h-100 text-h-600' },
    topics: ['Cross-functional project lead feedback', 'UX Research course update'],
    actionItems: 1,
  },
  {
    id: 4,
    title: 'Team Check-in',
    date: 'Feb 1, 2026',
    attendee: { initials: 'DT', name: 'Design Team', role: '5 members', color: 'bg-t-100 text-t-800' },
    topics: ['Q1 planning', 'Design system priorities', 'Hiring updates'],
    actionItems: 4,
  },
]

const TEMPLATES = [
  {
    emoji: '🎯',
    title: 'Career Development 1:1',
    description: 'Structured template for monthly career check-ins covering goals, blockers, and growth areas',
    items: ['Goal progress review', 'Skill development update', 'Blockers & support needed', 'Next steps & commitments'],
    color: 'bg-h-50',
  },
  {
    emoji: '⚡',
    title: 'Weekly Sync',
    description: 'Quick weekly check-in to stay aligned on priorities and surface any blockers',
    items: ['Last week recap', 'This week priorities', 'Blockers', 'Shoutouts'],
    color: 'bg-g-50',
  },
  {
    emoji: '📊',
    title: 'Performance Review Prep',
    description: 'Prepare together before formal performance review discussions',
    items: ['Achievements this cycle', 'Areas for improvement', 'Feedback alignment', 'Growth goals'],
    color: 'bg-y-50',
  },
]

export default function Meetings() {
  return (
    <div className="p-8 max-w-5xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-n-950">1:1s</h1>
          <p className="text-[13px] text-n-600 mt-0.5">Regular check-ins with your manager and team</p>
        </div>
        <button className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors">+ Schedule 1:1</button>
      </div>

      {/* Upcoming */}
      <div className="mb-8">
        <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Upcoming</p>
        {UPCOMING.map(m => (
          <div key={m.id} className="bg-white rounded-2xl shadow-4dp">
            <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${m.attendee.color}`}>
                  {m.attendee.initials}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-n-950">{m.title}</p>
                  <p className="text-[11px] text-n-600">{m.attendee.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[12px] font-semibold text-n-950">{m.date}</p>
                  <p className="text-[11px] text-n-500">{m.time} · {m.duration}</p>
                </div>
                <button className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors">Join</button>
              </div>
            </div>
            <div className="p-5">
              <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Agenda</p>
              <div className="flex flex-col gap-2">
                {m.agenda.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-n-50 transition-colors">
                    <div className="w-5 h-5 rounded border-2 border-n-300 shrink-0" />
                    <p className="text-[13px] text-n-950">{item}</p>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-[12px] text-h-600 font-medium hover:underline">+ Add agenda item</button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Past 1:1s */}
        <div className="col-span-2">
          <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Past 1:1s</p>
          <div className="bg-white rounded-2xl shadow-4dp divide-y divide-n-50">
            {PAST.map(m => (
              <div key={m.id} className="px-5 py-4 hover:bg-n-50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${m.attendee.color}`}>
                      {m.attendee.initials}
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-n-950">{m.title}</p>
                      <p className="text-[11px] text-n-500">{m.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-n-100 text-n-600">{m.actionItems} actions</span>
                    <button className="text-[12px] text-h-600 font-medium hover:underline">View →</button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.topics.map(t => (
                    <span key={t} className="text-[10px] text-n-600 bg-n-100 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div>
          <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Templates</p>
          <div className="flex flex-col gap-3">
            {TEMPLATES.map((t, i) => (
              <div key={i} className={`rounded-2xl shadow-4dp hover:shadow-8dp transition-shadow cursor-pointer p-4 ${t.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{t.emoji}</span>
                  <p className="text-[12px] font-semibold text-n-950">{t.title}</p>
                </div>
                <p className="text-[11px] text-n-600 mb-2 leading-relaxed">{t.description}</p>
                <div className="flex flex-col gap-1">
                  {t.items.slice(0, 2).map(item => (
                    <p key={item} className="text-[10px] text-n-600">· {item}</p>
                  ))}
                  {t.items.length > 2 && (
                    <p className="text-[10px] text-n-500">+{t.items.length - 2} more</p>
                  )}
                </div>
                <button className="mt-2 text-[11px] font-semibold text-h-600 hover:underline">Use template →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
