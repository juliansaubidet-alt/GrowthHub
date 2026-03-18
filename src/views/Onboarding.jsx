import { useState } from 'react'
import { User, Clock, Star, CheckCircle2, ChevronRight } from 'lucide-react'
import { useApp } from '../App'

const INDUSTRIES = [
  'Tecnología / Software', 'Finanzas / Fintech', 'Salud / Biotech',
  'E-commerce / Retail', 'Educación / EdTech', 'Consultoría',
  'Marketing / Medios', 'Manufactura / Industria', 'Otra',
]

const EXPERIENCE_OPTS = ['0-1 año', '1-3 años', '3-5 años', '5-8 años', '8-12 años', '12+ años']

const SKILL_TAGS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python',
  'Java', 'Go', 'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes', 'DevOps',
  'Liderazgo', 'Comunicación', 'Negociación', 'Inglés', 'Agile / Scrum',
  'Product Management', 'Data Analysis', 'Machine Learning', 'Design Thinking',
  'Presentaciones', 'Gestión de proyectos', 'Networking', 'Mentoría',
]

const TIMELINES = [
  { key: '6',  label: '6 meses', border: 'border-emerald-500/30', bg: 'bg-emerald-950/30', text: 'text-emerald-400', ring: 'focus:ring-emerald-500/30' },
  { key: '12', label: '1 año',   border: 'border-blue-500/30',    bg: 'bg-blue-950/30',    text: 'text-blue-400',    ring: 'focus:ring-blue-500/30' },
  { key: '24', label: '2 años',  border: 'border-violet-500/30',  bg: 'bg-violet-950/30',  text: 'text-violet-400',  ring: 'focus:ring-violet-500/30' },
]

const STEPS = [
  { id: 'info',   label: 'Información Básica', icon: User },
  { id: 'goals',  label: 'Aspiraciones',       icon: Star },
  { id: 'skills', label: 'Habilidades',        icon: CheckCircle2 },
]

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-600 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

export default function Onboarding() {
  const { profile, setProfile } = useApp()
  const [step, setStep] = useState(0)
  const [saved, setSaved] = useState(false)

  const update = (key, val) => setProfile(p => ({ ...p, [key]: val }))
  const updateAspiration = (k, v) => setProfile(p => ({ ...p, aspirations: { ...p.aspirations, [k]: v } }))
  const toggleSkill = (skill) => {
    const cur = profile.selectedSkills || []
    setProfile(p => ({
      ...p,
      selectedSkills: cur.includes(skill) ? cur.filter(s => s !== skill) : [...cur, skill],
    }))
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const inputCls = "w-full bg-gray-900 border border-blue-900/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition"
  const selectCls = "w-full bg-gray-900 border border-blue-900/50 rounded-xl px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition"

  return (
    <div className="p-8 max-w-2xl mx-auto animate-slide-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Mi Perfil Profesional</h1>
        <p className="text-gray-500 mt-1">Define tu punto de partida y hacia dónde querés llegar</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => {
          const active = step === i
          const done   = step > i
          return (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                active ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-sm shadow-blue-900/30' :
                done   ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' :
                         'bg-gray-800/50 text-gray-600 border-gray-700/50 hover:border-gray-600'
              }`}
            >
              <s.icon size={15} />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          )
        })}
      </div>

      <div className="bg-[#0d1526] rounded-2xl border border-blue-900/30 p-6">
        {step === 0 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <User size={18} className="text-blue-400" /> Información Básica
            </h2>
            <Field label="Rol / Cargo actual" hint="Ej: Senior Frontend Developer, Product Manager...">
              <input type="text" value={profile.role} onChange={e => update('role', e.target.value)}
                placeholder="Mi cargo actual" className={inputCls} />
            </Field>
            <Field label="Industria">
              <select value={profile.industry} onChange={e => update('industry', e.target.value)} className={selectCls}>
                <option value="">Seleccionar industria...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>
            <Field label="Años de experiencia">
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTS.map(opt => (
                  <button key={opt} onClick={() => update('experience', opt)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      profile.experience === opt
                        ? 'bg-blue-600/20 text-blue-400 border-blue-500/40'
                        : 'bg-gray-800/50 text-gray-500 border-gray-700/50 hover:border-blue-500/30 hover:text-gray-300'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Star size={18} className="text-blue-400" /> Aspiraciones Profesionales
            </h2>
            <p className="text-sm text-gray-500">¿Dónde te ves en cada horizonte de tiempo?</p>
            {TIMELINES.map(({ key, label, border, bg, text, ring }) => (
              <div key={key} className={`rounded-xl border p-4 ${bg} ${border}`}>
                <div className={`flex items-center gap-2 mb-2 ${text}`}>
                  <Clock size={14} />
                  <span className="text-sm font-semibold">En {label}</span>
                </div>
                <textarea
                  value={profile.aspirations[key]}
                  onChange={e => updateAspiration(key, e.target.value)}
                  placeholder={`¿Cuál es tu meta a ${label}?`}
                  rows={3}
                  className={`w-full bg-black/20 border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-300 resize-none focus:outline-none focus:ring-2 ${ring} placeholder-gray-700 transition`}
                />
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <CheckCircle2 size={18} className="text-blue-400" /> Habilidades Actuales
            </h2>
            <p className="text-sm text-gray-500">
              Seleccioná las skills que ya posees. ({(profile.selectedSkills || []).length} seleccionadas)
            </p>
            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {SKILL_TAGS.map(skill => {
                const active = (profile.selectedSkills || []).includes(skill)
                return (
                  <button key={skill} onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      active
                        ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 shadow-sm shadow-blue-900/20'
                        : 'bg-gray-800/50 text-gray-500 border-gray-700/50 hover:border-blue-500/30 hover:text-gray-300'
                    }`}>
                    {active && '✓ '}{skill}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-900/30">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-400 disabled:opacity-30 transition">
            ← Anterior
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-900/40">
              Siguiente <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition shadow-lg ${
                saved ? 'bg-emerald-600 text-white shadow-emerald-900/40' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/40'
              }`}>
              {saved ? '✓ Guardado' : 'Guardar Perfil'}
            </button>
          )}
        </div>
      </div>

      {profile.role && (
        <div className="mt-4 p-4 bg-blue-950/30 rounded-xl border border-blue-500/20 text-sm text-blue-300">
          <strong className="text-white">{profile.role}</strong>
          {profile.industry && ` · ${profile.industry}`}
          {profile.experience && ` · ${profile.experience}`}
          {(profile.selectedSkills || []).length > 0 && (
            <span className="ml-2 text-blue-400/60">· {profile.selectedSkills.length} skills</span>
          )}
        </div>
      )}
    </div>
  )
}
