import { useState } from 'react'
import { ShieldCheck, Lock, Eye, EyeOff, Plus, Trash2, Edit3, ExternalLink, X, BookOpen, Code2, Mic, Star, Users, BookMarked } from 'lucide-react'
import { useApp, LEADER_PASSWORD } from '../App'

const RESOURCE_TYPES = [
  { key: 'curso',    label: 'Curso',    icon: BookOpen, color: 'bg-blue-500/20 text-blue-400' },
  { key: 'libro',    label: 'Libro',    icon: BookOpen, color: 'bg-violet-500/20 text-violet-400' },
  { key: 'proyecto', label: 'Proyecto', icon: Code2,    color: 'bg-emerald-500/20 text-emerald-400' },
  { key: 'práctica', label: 'Práctica', icon: Mic,      color: 'bg-orange-500/20 text-orange-400' },
  { key: 'otro',     label: 'Otro',     icon: Star,     color: 'bg-gray-500/20 text-gray-400' },
]

const BLANK_COURSE = { title: '', skill: '', type: 'curso', url: '', description: '', addedBy: '' }

function TypeBadge({ type }) {
  const t = RESOURCE_TYPES.find(r => r.key === type) || RESOURCE_TYPES[4]
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${t.color}`}>
      <t.icon size={9} /> {t.label}
    </span>
  )
}

function LoginWall({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const attempt = () => {
    if (password === LEADER_PASSWORD) {
      onSuccess()
    } else {
      setError(true); setShake(true)
      setTimeout(() => setShake(false), 500)
      setTimeout(() => setError(false), 2500)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-8 bg-[#050914]">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className={`relative bg-[#0d1526] border border-blue-900/40 rounded-3xl shadow-2xl shadow-blue-900/30 p-8 w-full max-w-sm text-center transition-all ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}>
        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
          <Lock size={28} className="text-white" />
        </div>

        <h2 className="text-xl font-bold text-white mb-1">Zona Líderes</h2>
        <p className="text-sm text-gray-500 mb-6">
          Esta sección es exclusiva para líderes de equipo.<br/>Ingresá tu contraseña para continuar.
        </p>

        <div className="relative mb-3">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Contraseña de líder"
            className={`w-full bg-gray-900 border rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition ${
              error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-blue-900/50 focus:ring-blue-500/30'
            }`}
          />
          <button onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {error && <p className="text-xs text-red-400 mb-3 font-medium">Contraseña incorrecta. Intentá de nuevo.</p>}

        <button onClick={attempt}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-sm hover:from-blue-500 hover:to-cyan-500 transition shadow-lg shadow-blue-900/40">
          Ingresar como Líder
        </button>

        <p className="text-[10px] text-gray-700 mt-4">
          ¿No sos líder? Usá las secciones del menú lateral.
        </p>
      </div>
    </div>
  )
}

function CourseForm({ initial, skills, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const skillOptions = [...new Set(skills.map(s => s.name))]

  const inputCls = "w-full bg-gray-900 border border-blue-900/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
  const selectCls = "w-full bg-gray-900 border border-blue-900/50 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"

  return (
    <div className="bg-blue-950/30 border-2 border-blue-500/30 rounded-2xl p-5 space-y-4 animate-slide-in">
      <h3 className="font-semibold text-blue-300">{initial.id ? 'Editar recurso' : 'Nuevo recurso al catálogo'}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs text-blue-400/70 font-medium mb-1 block">Título del recurso *</label>
          <input value={form.title} onChange={e => upd('title', e.target.value)} placeholder="Ej: Desarrollo Web Full Stack — CoderHouse" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-blue-400/70 font-medium mb-1 block">URL del curso *</label>
          <input value={form.url} onChange={e => upd('url', e.target.value)} placeholder="https://www.coderhouse.com/ar/..." className={inputCls} />
        </div>
        <div>
          <label className="text-xs text-blue-400/70 font-medium mb-1 block">Skill que desarrolla</label>
          <select value={form.skill} onChange={e => upd('skill', e.target.value)} className={selectCls}>
            <option value="">Seleccionar skill...</option>
            {skillOptions.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="General">General / Varios</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-blue-400/70 font-medium mb-1 block">Tipo</label>
          <select value={form.type} onChange={e => upd('type', e.target.value)} className={selectCls}>
            {RESOURCE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-blue-400/70 font-medium mb-1 block">Descripción</label>
          <textarea value={form.description} onChange={e => upd('description', e.target.value)}
            placeholder="Breve descripción del contenido y para qué perfil es útil..." rows={2}
            className="w-full bg-gray-900 border border-blue-900/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition" />
        </div>
        <div>
          <label className="text-xs text-blue-400/70 font-medium mb-1 block">Cargado por</label>
          <input value={form.addedBy} onChange={e => upd('addedBy', e.target.value)} placeholder="Tu nombre o rol" className={inputCls} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-blue-900/30">
        <button onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-300">Cancelar</button>
        <button onClick={() => { if (form.title && form.url) onSave(form) }} disabled={!form.title || !form.url}
          className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-900/40 disabled:opacity-40">
          {initial.id ? 'Guardar cambios' : 'Agregar al catálogo'}
        </button>
      </div>
    </div>
  )
}

export default function Admin() {
  const { leaderRole, setLeaderRole, catalog, setCatalog, skills } = useApp()
  const [adding, setAdding]     = useState(false)
  const [editing, setEditing]   = useState(null)
  const [filterSkill, setFilter] = useState('all')
  const [search, setSearch]     = useState('')

  if (!leaderRole) return <LoginWall onSuccess={() => setLeaderRole(true)} />

  const addCourse    = (form) => { setCatalog(prev => [...prev, { ...form, id: Date.now(), addedAt: new Date().toISOString().slice(0, 10) }]); setAdding(false) }
  const updateCourse = (form) => { setCatalog(prev => prev.map(c => c.id === form.id ? form : c)); setEditing(null) }
  const deleteCourse = (id)   => setCatalog(prev => prev.filter(c => c.id !== id))

  const skillNames = [...new Set(skills.map(s => s.name))]

  const filtered = catalog
    .filter(c => filterSkill === 'all' || c.skill === filterSkill)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8 max-w-4xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-900/50">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Panel de Líderes</h1>
            <p className="text-gray-500 text-sm mt-0.5">Gestioná el catálogo de cursos y recursos para el equipo</p>
          </div>
        </div>
        <button onClick={() => { setAdding(s => !s); setEditing(null) }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-900/40">
          <Plus size={16} /> Agregar recurso
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: BookMarked, label: 'Recursos en catálogo', value: catalog.length,                                               color: 'bg-blue-500/20 text-blue-400' },
          { icon: Users,      label: 'Skills cubiertas',     value: new Set(catalog.map(c => c.skill).filter(Boolean)).size,      color: 'bg-cyan-500/20 text-cyan-400' },
          { icon: BookOpen,   label: 'Cursos',               value: catalog.filter(c => c.type === 'curso').length,               color: 'bg-violet-500/20 text-violet-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-[#0d1526] rounded-2xl p-4 border border-blue-900/30 flex items-center gap-3 hover:border-blue-500/30 transition-colors">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}><Icon size={18} /></div>
            <div>
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      {adding && !editing && (
        <div className="mb-5">
          <CourseForm initial={BLANK_COURSE} skills={skills} onSave={addCourse} onCancel={() => setAdding(false)} />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar recurso..."
          className="bg-gray-900 border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition w-48" />
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${filterSkill === 'all' ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'bg-gray-800/50 border-gray-700/50 text-gray-500 hover:border-blue-500/30 hover:text-gray-300'}`}>
            Todos
          </button>
          {skillNames.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${filterSkill === s ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'bg-gray-800/50 border-gray-700/50 text-gray-500 hover:border-blue-500/30 hover:text-gray-300'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Course list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-700 bg-[#0d1526] rounded-2xl border border-blue-900/20">
          <BookMarked size={36} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium text-gray-500">Sin recursos en el catálogo</p>
          <p className="text-sm">Hacé click en "Agregar recurso" para cargar el primero</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(course => (
            <div key={course.id}>
              {editing?.id === course.id ? (
                <CourseForm initial={editing} skills={skills} onSave={updateCourse} onCancel={() => setEditing(null)} />
              ) : (
                <div className="bg-[#0d1526] rounded-2xl border border-blue-900/30 hover:border-blue-500/30 transition-colors p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <TypeBadge type={course.type} />
                        {course.skill && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">{course.skill}</span>}
                        <span className="text-[10px] text-gray-600">{course.addedAt}{course.addedBy && ` · por ${course.addedBy}`}</span>
                      </div>
                      <h3 className="font-semibold text-white mb-1">{course.title}</h3>
                      {course.description && <p className="text-sm text-gray-500 leading-relaxed mb-3">{course.description}</p>}
                      {course.url && (
                        <a href={course.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition">
                          <ExternalLink size={12} />
                          {course.url.length > 55 ? course.url.slice(0, 55) + '…' : course.url}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => { setEditing(course); setAdding(false) }} className="p-2 text-gray-600 hover:text-blue-400 hover:bg-blue-950/50 rounded-lg transition"><Edit3 size={15} /></button>
                      <button onClick={() => deleteCourse(course.id)} className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-950/20 border border-blue-900/30 rounded-xl text-xs text-blue-400/70 flex items-start gap-2">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-blue-500" />
        <p>Los recursos cargados aquí aparecen en el <strong className="text-blue-400">Catálogo</strong> dentro de Plan de Acción, donde los miembros del equipo pueden importarlos directamente a su plan personal.</p>
      </div>
    </div>
  )
}
