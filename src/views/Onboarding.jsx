import { useState } from 'react'
import { User, Briefcase, Clock, Star, CheckCircle2, ChevronRight } from 'lucide-react'
import { useApp } from '../App'

const INDUSTRIES = [
  'Tecnología / Software', 'Finanzas / Fintech', 'Salud / Biotech',
  'E-commerce / Retail', 'Educación / EdTech', 'Consultoría',
  'Marketing / Medios', 'Manufactura / Industria', 'Otra',
]

const EXPERIENCE_OPTS = [
  '0-1 año', '1-3 años', '3-5 años', '5-8 años', '8-12 años', '12+ años',
]

const SKILL_TAGS = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python',
  'Java', 'Go', 'SQL', 'NoSQL', 'AWS', 'Docker', 'Kubernetes', 'DevOps',
  'Liderazgo', 'Comunicación', 'Negociación', 'Inglés', 'Agile / Scrum',
  'Product Management', 'Data Analysis', 'Machine Learning', 'Design Thinking',
  'Presentaciones', 'Gestión de proyectos', 'Networking', 'Mentoría',
]

const TIMELINES = [
  { key: '6',  label: '6 meses',  color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
  { key: '12', label: '1 año',    color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { key: '24', label: '2 años',   color: 'bg-violet-50 border-violet-200 text-violet-700' },
]

const STEPS = [
  { id: 'info',   label: 'Información Básica', icon: User },
  { id: 'goals',  label: 'Aspiraciones',       icon: Star },
  { id: 'skills', label: 'Habilidades',        icon: CheckCircle2 },
]

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
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

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto animate-slide-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil Profesional</h1>
        <p className="text-gray-500 mt-1">Define tu punto de partida y hacia dónde quieres llegar</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => {
          const active = step === i
          const done = step > i
          return (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-indigo-600 text-white shadow-sm' :
                done   ? 'bg-indigo-100 text-indigo-700' :
                         'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <s.icon size={15} />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Step 0: Información Básica */}
        {step === 0 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <User size={18} className="text-indigo-500" /> Información Básica
            </h2>

            <Field label="Rol / Cargo actual" hint="Ej: Senior Frontend Developer, Product Manager...">
              <input
                type="text"
                value={profile.role}
                onChange={e => update('role', e.target.value)}
                placeholder="Mi cargo actual"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </Field>

            <Field label="Industria">
              <select
                value={profile.industry}
                onChange={e => update('industry', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition bg-white"
              >
                <option value="">Seleccionar industria...</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </Field>

            <Field label="Años de experiencia">
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => update('experience', opt)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      profile.experience === opt
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Step 1: Aspiraciones */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Star size={18} className="text-indigo-500" /> Aspiraciones Profesionales
            </h2>
            <p className="text-sm text-gray-500">¿Dónde te ves en cada horizonte de tiempo?</p>
            {TIMELINES.map(({ key, label, color }) => (
              <div key={key} className={`rounded-xl border p-4 ${color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} />
                  <span className="text-sm font-semibold">En {label}</span>
                </div>
                <textarea
                  value={profile.aspirations[key]}
                  onChange={e => updateAspiration(key, e.target.value)}
                  placeholder={`¿Cuál es tu meta a ${label}? (rol, empresa, responsabilidades...)`}
                  rows={3}
                  className="w-full bg-white/70 border border-current/20 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-current/30 placeholder-current/40 transition"
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-indigo-500" /> Habilidades Actuales
            </h2>
            <p className="text-sm text-gray-500">
              Seleccioná las skills que ya posees. ({(profile.selectedSkills || []).length} seleccionadas)
            </p>
            <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto scrollbar-thin pr-1">
              {SKILL_TAGS.map(skill => {
                const active = (profile.selectedSkills || []).includes(skill)
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                      active
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {active && '✓ '}{skill}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 transition"
          >
            ← Anterior
          </button>
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-1.5 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
            >
              Siguiente <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition shadow-sm ${
                saved
                  ? 'bg-emerald-500 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {saved ? '✓ Guardado' : 'Guardar Perfil'}
            </button>
          )}
        </div>
      </div>

      {/* Profile summary */}
      {profile.role && (
        <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-sm text-indigo-700">
          <strong>{profile.role}</strong>
          {profile.industry && ` · ${profile.industry}`}
          {profile.experience && ` · ${profile.experience}`}
          {(profile.selectedSkills || []).length > 0 && (
            <span className="ml-2 text-indigo-500">· {profile.selectedSkills.length} skills</span>
          )}
        </div>
      )}
    </div>
  )
}
