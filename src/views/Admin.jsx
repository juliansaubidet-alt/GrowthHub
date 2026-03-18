import { useState } from 'react'
import { ShieldCheck, Lock, Eye, EyeOff, Plus, Trash2, Edit3, ExternalLink, X, BookOpen, Code2, Mic, Star, Users, BookMarked } from 'lucide-react'
import { useApp, LEADER_PASSWORD } from '../App'

const RESOURCE_TYPES = [
  { key: 'curso',    label: 'Curso',    icon: BookOpen, badge: 'bg-h-100 text-h-800' },
  { key: 'libro',    label: 'Libro',    icon: BookOpen, badge: 'bg-p-100 text-p-800' },
  { key: 'proyecto', label: 'Proyecto', icon: Code2,    badge: 'bg-g-100 text-g-800' },
  { key: 'práctica', label: 'Práctica', icon: Mic,      badge: 'bg-y-100 text-y-700' },
  { key: 'otro',     label: 'Otro',     icon: Star,     badge: 'bg-n-100 text-n-800' },
]
const BLANK_COURSE = { title: '', skill: '', type: 'curso', url: '', description: '', addedBy: '' }

function TypeBadge({ type }) {
  const t = RESOURCE_TYPES.find(r => r.key === type) || RESOURCE_TYPES[4]
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.badge}`}>
      <t.icon size={9} /> {t.label}
    </span>
  )
}

function LoginWall({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const [error, setError]       = useState(false)

  const attempt = () => {
    if (password === LEADER_PASSWORD) {
      onSuccess()
    } else {
      setError(true)
      setTimeout(() => setError(false), 2500)
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center p-8 bg-n-50">
      <div className="bg-white rounded-2xl shadow-8dp p-8 w-full max-w-sm text-center border border-n-200">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-h-500 flex items-center justify-center shadow-4dp">
          <Lock size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-semibold text-n-950 mb-1">Zona Líderes</h2>
        <p className="text-sm text-n-800 mb-6">
          Esta sección es exclusiva para líderes de equipo.<br/>Ingresá tu contraseña para continuar.
        </p>
        <div className="relative mb-3">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            onKeyDown={e => e.key === 'Enter' && attempt()}
            placeholder="Contraseña de líder"
            className={`input-humand pr-10 ${error ? 'border-r-400' : ''}`}
          />
          <button onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-n-600 hover:text-n-950">
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="text-xs text-r-600 mb-3 font-semibold">Contraseña incorrecta. Intentá de nuevo.</p>}
        <button onClick={attempt}
          className="w-full h-10 bg-h-500 hover:bg-h-600 text-white rounded-lg font-semibold text-[13px] transition shadow-4dp">
          Ingresar como Líder
        </button>
        <p className="text-[11px] text-n-600 mt-4">¿No sos líder? Usá las secciones del menú lateral.</p>
      </div>
    </div>
  )
}

function CourseForm({ initial, skills, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const skillOptions = [...new Set(skills.map(s => s.name))]

  return (
    <div className="bg-h-50 border-2 border-h-200 rounded-2xl p-5 space-y-4 animate-slide-in">
      <h3 className="text-sm font-semibold text-h-800">{initial.id ? 'Editar recurso' : 'Nuevo recurso al catálogo'}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Título del recurso *</label>
          <input value={form.title} onChange={e => upd('title', e.target.value)} placeholder="Ej: Desarrollo Web Full Stack — CoderHouse" className="input-humand" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">URL del recurso *</label>
          <input value={form.url} onChange={e => upd('url', e.target.value)} placeholder="https://www.coderhouse.com/ar/..." className="input-humand" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Skill</label>
          <select value={form.skill} onChange={e => upd('skill', e.target.value)} className="input-humand">
            <option value="">Seleccionar skill...</option>
            {skillOptions.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="General">General / Varios</option>
          </select>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Tipo</label>
          <select value={form.type} onChange={e => upd('type', e.target.value)} className="input-humand">
            {RESOURCE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Descripción</label>
          <textarea value={form.description} onChange={e => upd('description', e.target.value)}
            placeholder="Breve descripción del contenido..." rows={2} className="textarea-humand" />
        </div>
        <div>
          <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Cargado por</label>
          <input value={form.addedBy} onChange={e => upd('addedBy', e.target.value)} placeholder="Tu nombre o rol" className="input-humand" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2 border-t border-h-100">
        <button onClick={onCancel} className="h-9 px-4 text-[13px] font-semibold text-n-800 hover:text-n-950 rounded-lg hover:bg-n-100 transition">Cancelar</button>
        <button onClick={() => { if (form.title && form.url) onSave(form) }} disabled={!form.title || !form.url}
          className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition shadow-4dp disabled:opacity-40">
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
  const filtered   = catalog
    .filter(c => filterSkill === 'all' || c.skill === filterSkill)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8 max-w-4xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-h-500 flex items-center justify-center shadow-4dp">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-n-950">Panel de Líderes</h1>
            <p className="text-sm text-n-800 mt-0.5">Gestioná el catálogo de cursos y recursos para el equipo</p>
          </div>
        </div>
        <button onClick={() => { setAdding(s => !s); setEditing(null) }}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition shadow-4dp">
          <Plus size={15} /> Agregar recurso
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: BookMarked, label: 'Recursos en catálogo', value: catalog.length,                                          iconBg: 'bg-h-50',  iconColor: 'text-h-600' },
          { icon: Users,      label: 'Skills cubiertas',     value: new Set(catalog.map(c => c.skill).filter(Boolean)).size, iconBg: 'bg-t-50',  iconColor: 'text-t-800' },
          { icon: BookOpen,   label: 'Cursos',               value: catalog.filter(c => c.type === 'curso').length,          iconBg: 'bg-p-50',  iconColor: 'text-p-800' },
        ].map(({ icon: Icon, label, value, iconBg, iconColor }) => (
          <div key={label} className="bg-white rounded-2xl shadow-4dp p-5 flex items-center gap-3 hover:shadow-8dp transition-shadow">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}><Icon size={18} className={iconColor} /></div>
            <div>
              <p className="text-2xl font-semibold text-n-950">{value}</p>
              <p className="text-xs text-n-800">{label}</p>
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
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar recurso..." className="input-humand w-48" style={{ height: 36 }} />
        <div className="flex flex-wrap gap-1.5">
          {[['all', 'Todos'], ...skillNames.map(s => [s, s])].map(([k, l]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`h-7 px-3 rounded-full text-[11px] font-semibold border transition-all ${
                filterSkill === k ? 'bg-h-50 text-h-600 border-h-200' : 'bg-n-100 text-n-800 border-transparent hover:border-n-300'
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Course list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-n-600 bg-white rounded-2xl shadow-4dp border border-n-200">
          <BookMarked size={36} className="mx-auto mb-3 opacity-20" />
          <p className="font-semibold text-n-800">Sin recursos en el catálogo</p>
          <p className="text-sm mt-1 text-n-600">Hacé click en "Agregar recurso" para cargar el primero</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(course => (
            <div key={course.id}>
              {editing?.id === course.id ? (
                <CourseForm initial={editing} skills={skills} onSave={updateCourse} onCancel={() => setEditing(null)} />
              ) : (
                <div className="bg-white rounded-2xl shadow-4dp hover:shadow-8dp transition-shadow p-5 border border-n-200 hover:border-h-400">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-2">
                        <TypeBadge type={course.type} />
                        {course.skill && <span className="text-[10px] font-semibold bg-h-50 text-h-800 border border-h-100 px-2 py-0.5 rounded-full">{course.skill}</span>}
                        <span className="text-[10px] text-n-600">{course.addedAt}{course.addedBy && ` · por ${course.addedBy}`}</span>
                      </div>
                      <h3 className="text-[13px] font-semibold text-n-950 mb-1">{course.title}</h3>
                      {course.description && <p className="text-xs text-n-800 leading-relaxed mb-2">{course.description}</p>}
                      {course.url && (
                        <a href={course.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-h-500 hover:text-h-600 transition">
                          <ExternalLink size={11} />
                          {course.url.length > 55 ? course.url.slice(0, 55) + '…' : course.url}
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button onClick={() => { setEditing(course); setAdding(false) }} className="p-1.5 text-n-600 hover:text-h-600 hover:bg-h-50 rounded-lg transition"><Edit3 size={14} /></button>
                      <button onClick={() => deleteCourse(course.id)}               className="p-1.5 text-n-600 hover:text-r-600 hover:bg-r-50 rounded-lg transition"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-h-50 border border-h-100 rounded-xl text-xs text-h-800 flex items-start gap-2">
        <ShieldCheck size={14} className="mt-0.5 shrink-0 text-h-500" />
        <p>Los recursos cargados aquí aparecen en el <strong>Catálogo</strong> dentro de Plan de Acción, donde los miembros del equipo pueden importarlos directamente a su plan personal.</p>
      </div>
    </div>
  )
}
