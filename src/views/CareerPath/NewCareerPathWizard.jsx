import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const NEW_PATH_STEPS = ['Info básica', 'Skills', 'Requisitos', 'Revisión']

const AREAS = ['Design', 'Engineering', 'Product', 'Marketing', 'Sales', 'Operations', 'People', 'Finance']
const LEVELS = [
  { value: 'L1', label: 'Junior'     },
  { value: 'L2', label: 'Mid'        },
  { value: 'L3', label: 'Senior'     },
  { value: 'L4', label: 'Lead'       },
  { value: 'L5', label: 'Principal'  },
]
const DOT_COLORS = ['#496be3','#28c040','#886bff','#de920c','#d42e2e','#35a48e','#e3498b','#cbcdd6']
const SKILL_SUGGESTIONS = [
  'Figma','Prototyping','Design Systems','UX Research','Stakeholder Mgmt',
  'React','TypeScript','Node.js','SQL','AWS','Python','Data Analysis',
  'Liderazgo','Comunicación','Presentaciones','Negociación','Mentoría',
  'Agile/Scrum','Roadmapping','Product Strategy','Brand Strategy',
]

export default function NewCareerPathWizard({ onClose, onSave }) {
  const [step, setStep]       = useState(0)
  const [name, setName]       = useState('')
  const [area, setArea]       = useState('')
  const [level, setLevel]     = useState('L2')
  const [desc, setDesc]       = useState('')
  const [dot, setDot]         = useState('#496be3')
  const [skills, setSkills]   = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [minExp, setMinExp]   = useState('2+ años')
  const [perf, setPerf]       = useState('≥ 75%')
  const [approval, setApproval] = useState('Manager + HR')

  const addSkill = (s) => {
    const trimmed = s.trim()
    if (trimmed && !skills.includes(trimmed)) setSkills(prev => [...prev, trimmed])
    setSkillInput('')
  }
  const removeSkill = (s) => setSkills(prev => prev.filter(x => x !== s))

  const canNext = [
    name.trim() !== '' && area !== '',
    skills.length > 0,
    true,
    true,
  ]

  const levelLabel = LEVELS.find(l => l.value === level)?.label || level

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-n-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-8dp w-full max-w-xl mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-n-100">
          <div>
            <p className="text-[11px] font-semibold text-n-500 uppercase tracking-widest">Nuevo career path</p>
            <p className="text-[15px] font-bold text-n-950 mt-0.5">{NEW_PATH_STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-n-100 transition-colors">
            <X size={16} className="text-n-600" />
          </button>
        </div>

        <div className="flex gap-1.5 px-6 pt-4">
          {NEW_PATH_STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col gap-1">
              <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-h-500' : 'bg-n-100'}`} />
              <p className={`text-[10px] font-medium ${i === step ? 'text-h-600' : 'text-n-400'}`}>{s}</p>
            </div>
          ))}
        </div>

        <div className="px-6 py-5 min-h-[280px] flex flex-col gap-4">
          {step === 0 && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-n-700">Nombre del career path *</label>
                <input
                  className="input-humand"
                  placeholder="ej. Senior Designer, Engineering Manager…"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-n-700">Área *</label>
                  <select className="input-humand" value={area} onChange={e => setArea(e.target.value)}>
                    <option value="">Seleccionar…</option>
                    {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-n-700">Nivel</label>
                  <select className="input-humand" value={level} onChange={e => setLevel(e.target.value)}>
                    {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-n-700">Descripción</label>
                <textarea
                  className="input-humand resize-none h-20"
                  placeholder="Describí brevemente el rol y sus responsabilidades…"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-semibold text-n-700">Color identificador</label>
                <div className="flex gap-2">
                  {DOT_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => setDot(c)}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                      style={{ backgroundColor: c, boxShadow: dot === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : undefined }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-n-700">Skills requeridas *</label>
                <div className="flex gap-2">
                  <input
                    className="input-humand flex-1"
                    placeholder="Escribí una skill y presioná Enter…"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput) } }}
                  />
                  <button
                    onClick={() => addSkill(skillInput)}
                    className="h-9 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors shrink-0"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <div key={s} className="flex items-center gap-1 bg-h-50 text-h-800 text-[12px] font-medium px-2.5 py-1 rounded-lg">
                      {s}
                      <button onClick={() => removeSkill(s)} className="text-h-400 hover:text-r-600 ml-0.5 leading-none"><X size={10} /></button>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <p className="text-[11px] font-semibold text-n-500 mb-2">Sugerencias</p>
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 12).map(s => (
                    <button
                      key={s}
                      onClick={() => addSkill(s)}
                      className="text-[11px] text-n-700 bg-n-100 hover:bg-h-100 hover:text-h-800 px-2 py-1 rounded-md transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-[12px] text-n-600">Definí los requisitos mínimos para acceder a este career path.</p>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-n-700">Experiencia mínima</label>
                  <input className="input-humand" value={minExp} onChange={e => setMinExp(e.target.value)} placeholder="ej. 2+ años" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-semibold text-n-700">Aprobación requerida</label>
                  <select className="input-humand" value={approval} onChange={e => setApproval(e.target.value)}>
                    <option>Manager</option>
                    <option>Manager + HR</option>
                    <option>HR solamente</option>
                    <option>Automática</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="bg-n-50 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-[13px]" style={{ borderColor: dot, color: dot }}>
                    {level}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-n-950">{name}</p>
                    <p className="text-[12px] text-n-600">{area} · {levelLabel}</p>
                  </div>
                </div>
                {desc && <p className="text-[12px] text-n-700">{desc}</p>}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-n-500 uppercase tracking-widest mb-2">Skills requeridas</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map(s => (
                    <span key={s} className="text-[12px] font-medium px-2.5 py-1 rounded-lg bg-h-50 text-h-800">{s}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['Experiencia', minExp], ['Performance', perf], ['Aprobación', approval]].map(([l, v]) => (
                  <div key={l} className="bg-white border border-n-100 rounded-xl p-3">
                    <p className="text-[10px] text-n-500 font-semibold uppercase tracking-widest mb-1">{l}</p>
                    <p className="text-[13px] font-semibold text-n-950">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-n-100">
          <button
            onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
            className="h-9 px-4 border border-n-200 text-n-700 rounded-lg text-[13px] font-semibold hover:bg-n-50 transition-colors"
          >
            {step === 0 ? 'Cancelar' : 'Atrás'}
          </button>
          {step < NEW_PATH_STEPS.length - 1 ? (
            <button
              disabled={!canNext[step]}
              onClick={() => setStep(s => s + 1)}
              className="h-9 px-5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={() => onSave({ name, area, level, desc, dot, skills, minExp, perf, approval })}
              className="h-9 px-5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors"
            >
              Crear career path
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
