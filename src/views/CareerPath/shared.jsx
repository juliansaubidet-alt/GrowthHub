import { Lock, Check, Target } from 'lucide-react'
import { BookOpen, Award, Users } from 'lucide-react'

const COURSE_ICON_MAP = {
  'Curso': BookOpen, 'Certificación': Award, 'Workshop': Users,
}

export function CourseIcon({ type, size = 20 }) {
  const Icon = COURSE_ICON_MAP[type] || BookOpen
  return <Icon size={size} className="text-n-500" />
}

export function ProgressRing({ pct, color = '#496be3', size = 80, r = 32, stroke = 7 }) {
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

export function PathNode({ node, filter, thirdPerson = false }) {
  if (filter !== 'Todo') {
    if (filter === 'Vertical' && node.type === 'lateral') return null
    if (filter === 'Lateral' && node.type !== 'lateral' && node.type !== 'current') return null
  }
  const opacity = node.locked ? 'opacity-55' : 'opacity-100'
  return (
    <div className={`flex flex-col items-center gap-1.5 ${opacity}`}>
      <div className="h-5 flex items-center justify-center">
        {node.current && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-h-600 bg-h-50 border border-h-200 px-2 py-0.5 rounded-full whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-h-500 shrink-0" />
            {thirdPerson ? 'Está aquí' : 'Estás aquí'}
          </span>
        )}
        {node.type === 'target' && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-g-700 bg-g-50 border border-g-200 px-2 py-0.5 rounded-full whitespace-nowrap">
            <Target size={10} /> {thirdPerson ? 'Su meta' : 'Tu meta'}
          </span>
        )}
      </div>
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-xl relative"
        style={{
          border: `3px solid ${node.ring}`,
          boxShadow: node.current ? `0 0 0 4px ${node.ring}33` : node.type === 'target' ? `0 0 0 3px #28c04022` : undefined,
          background: node.done ? '#f5fdf6' : node.current ? '#f1f4fd' : node.type === 'lateral' ? '#f4f2ff' : '#fff',
        }}
      >
        {node.done && <Check size={18} className="text-g-600" />}
        {node.current && <span className="text-h-600 text-sm font-bold">L2</span>}
        {node.type === 'target' && <span className="text-h-400 text-sm font-bold">{node.level || 'L3'}</span>}
        {node.locked && <Lock size={14} className="text-n-400" />}
        {node.type === 'lateral' && <span className="text-p-500 text-sm font-bold">L2</span>}
      </div>
      <p className={`text-[11px] font-semibold text-center leading-tight max-w-[72px] ${node.current ? 'text-h-700' : 'text-n-950'}`}>{node.label}</p>
      <p className="text-[10px] text-n-500 text-center">{node.sub}</p>
    </div>
  )
}

export function Toggle({ on, onToggle }) {
  return (
    <button onClick={onToggle} className={`w-10 h-6 rounded-full transition-colors relative shrink-0 ${on ? 'bg-h-500' : 'bg-n-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
  )
}
