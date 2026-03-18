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
  { key: '6',  label: '6 meses', color: 'text-t-800', bg: 'bg-t-50 border-t-100' },
  { key: '12', label: '1 año',   color: 'text-h-800', bg: 'bg-h-50 border-h-100' },
  { key: '24', label: '2 años',  color: 'text-p-800', bg: 'bg-p-50 border-p-100' },
]
const STEPS = [
  { id: 'info',   label: 'Información Básica', icon: User },
  { id: 'goals',  label: 'Aspiraciones',       icon: Star },
  { id: 'skills', label: 'Habilidades',        icon: CheckCircle2 },
]

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-n-950 mb-1">{label}</label>
      {hint && <p className="text-xs text-n-800 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

export default function Onboarding() {
  const { profile, setProfile } = useApp()
  const [step, setStep]   = useState(0)
  const [saved, setSaved] = useState(false)

  const update           = (key, val) => setProfile(p => ({ ...p, [key]: val }))
  const updateAspiration = (k, v)     => setProfile(p => ({ ...p, aspirations: { ...p.aspirations, [k]: v } }))
  const toggleSkill      = (skill) => {
    const cur = profile.selectedSkills || []
    setProfile(p => ({
      ...p,
      selectedSkills: cur.includes(skill) ? cur.filter(s => s !== skill) : [...cur, skill],
    }))
  }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div className="p-8 max-w-2xl mx-auto animate-slide-in">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-n-950">Mi Perfil Profesional</h1>
        <p className="text-sm text-n-800 mt-1">Define tu punto de partida y hacia dónde querés llegar</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-6 bg-n-100 rounded-lg p-1">
        {STEPS.map((s, i) => {
          const active = step === i
          const done   = step > i
          return (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex-1 flex items-center justify-center gap-2 h-9 rounded text-[13px] transition-all ${
                active
                  ? 'bg-white text-n-950 font-semibold shadow-4dp'
                  : done
                  ? 'text-g-800 font-semibold'
                  : 'text-n-800 hover:text-n-950'
              }`}
            >
              <s.icon size={14} />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
        <div className="p-6">
          {step === 0 && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <User size={16} className="text-h-500" />
                <h2 className="text-sm font-semibold text-n-950">Información Básica</h2>
              </div>
              <Field label="Rol / Cargo actual" hint="Ej: Senior Frontend Developer, Product Manager...">
                <input type="text" value={profile.role} onChange={e => update('role', e.target.value)}
                  placeholder="Mi cargo actual" className="input-humand" />
              </Field>
              <Field label="Industria">
                <select value={profile.industry} onChange={e => update('industry', e.target.value)}
                  className="input-humand appearance-none cursor-pointer">
                  <option value="">Seleccionar industria...</option>
                  {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </Field>
              <Field label="Años de experiencia">
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_OPTS.map(opt => (
                    <button key={opt} onClick={() => update('experience', opt)}
                      className={`px-3 h-8 rounded-full text-[12px] font-semibold border transition-all ${
                        profile.experience === opt
                          ? 'bg-h-50 text-h-600 border-h-200'
                          : 'bg-n-100 text-n-800 border-transparent hover:border-n-300 hover:text-n-950'
                      }`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <Star size={16} className="text-h-500" />
                <h2 className="text-sm font-semibold text-n-950">Aspiraciones Profesionales</h2>
              </div>
              <p className="text-xs text-n-800">¿Dónde te ves en cada horizonte de tiempo?</p>
              {TIMELINES.map(({ key, label, color, bg }) => (
                <div key={key} className={`rounded-lg border p-4 ${bg}`}>
                  <div className={`flex items-center gap-2 mb-2 ${color}`}>
                    <Clock size={13} />
                    <span className="text-[13px] font-semibold">En {label}</span>
                  </div>
                  <textarea
                    value={profile.aspirations[key]}
                    onChange={e => updateAspiration(key, e.target.value)}
                    placeholder={`¿Cuál es tu meta a ${label}?`}
                    rows={3}
                    className="textarea-humand"
                  />
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-h-500" />
                <h2 className="text-sm font-semibold text-n-950">Habilidades Actuales</h2>
              </div>
              <p className="text-xs text-n-800">
                Seleccioná las skills que ya posees. ({(profile.selectedSkills || []).length} seleccionadas)
              </p>
              <div className="flex flex-wrap max-h-72 overflow-y-auto scrollbar-thin pr-1 -mx-1">
                {SKILL_TAGS.map(skill => {
                  const active = (profile.selectedSkills || []).includes(skill)
                  return (
                    <button key={skill} onClick={() => toggleSkill(skill)}
                      className={`m-1 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                        active
                          ? 'bg-h-50 text-h-800 border-h-100 hover:bg-h-100'
                          : 'bg-n-100 text-n-900 border-transparent hover:bg-n-200'
                      }`}>
                      {active && <CheckCircle2 size={10} />}
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-n-100 bg-n-50">
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            className="text-[13px] font-semibold text-n-800 hover:text-n-950 disabled:opacity-30 transition">
            ← Anterior
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="inline-flex items-center gap-1.5 h-9 px-5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors">
              Siguiente <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={handleSave}
              className={`h-9 px-5 rounded-lg text-[13px] font-semibold transition-colors ${
                saved ? 'bg-g-600 text-white' : 'bg-h-500 hover:bg-h-600 text-white'
              }`}>
              {saved ? '✓ Guardado' : 'Guardar Perfil'}
            </button>
          )}
        </div>
      </div>

      {profile.role && (
        <div className="mt-4 p-4 bg-h-50 border border-h-100 rounded-xl text-[13px] text-h-800">
          <strong className="text-h-950">{profile.role}</strong>
          {profile.industry && ` · ${profile.industry}`}
          {profile.experience && ` · ${profile.experience}`}
          {(profile.selectedSkills || []).length > 0 && (
            <span className="ml-2 text-h-600">· {profile.selectedSkills.length} skills</span>
          )}
        </div>
      )}
    </div>
  )
}
