import { useState } from 'react'
import { ClipboardList, Plus, Trash2, CheckSquare, Square, Flag, BookOpen, Code2, Mic, Star, X, Calendar, LayoutList, ExternalLink, Link, Edit3, BookMarked, Import } from 'lucide-react'
import { useApp } from '../App'

const RESOURCE_TYPES = [
  { key: 'curso',    label: 'Curso',     icon: BookOpen, color: 'bg-blue-500/20 text-blue-400' },
  { key: 'libro',    label: 'Libro',     icon: BookOpen, color: 'bg-violet-500/20 text-violet-400' },
  { key: 'proyecto', label: 'Proyecto',  icon: Code2,    color: 'bg-emerald-500/20 text-emerald-400' },
  { key: 'práctica', label: 'Práctica',  icon: Mic,      color: 'bg-orange-500/20 text-orange-400' },
  { key: 'otro',     label: 'Otro',      icon: Star,     color: 'bg-gray-500/20 text-gray-400' },
]

const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const MONTHS = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6']

function TypeBadge({ type }) {
  const t = RESOURCE_TYPES.find(r => r.key === type) || RESOURCE_TYPES[4]
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${t.color}`}>
      <t.icon size={9} /> {t.label}
    </span>
  )
}

function CatalogModal({ catalog, onImport, onClose }) {
  const [search, setSearch] = useState('')
  const [imported, setImported] = useState(new Set())

  const filtered = catalog.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.skill?.toLowerCase().includes(search.toLowerCase())
  )

  const handleImport = (course) => {
    onImport(course)
    setImported(s => new Set([...s, course.id]))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0d1526] border border-blue-900/40 rounded-3xl shadow-2xl shadow-blue-900/30 w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-900/30 bg-gradient-to-r from-blue-950/50 to-cyan-950/30">
          <div className="flex items-center gap-2">
            <BookMarked size={18} className="text-cyan-400" />
            <h2 className="font-bold text-white">Catálogo de Recursos</h2>
            <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-medium">{catalog.length} recursos</span>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-300 p-1 rounded-lg hover:bg-gray-800 transition"><X size={18} /></button>
        </div>
        <div className="px-6 py-3 border-b border-blue-900/20">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o skill..."
            className="w-full bg-gray-900 border border-blue-900/40 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin">
          {filtered.length === 0 && <p className="text-center text-gray-600 py-8 text-sm">Sin resultados</p>}
          {filtered.map(course => {
            const done = imported.has(course.id)
            return (
              <div key={course.id} className="flex items-start gap-4 p-4 rounded-xl border border-blue-900/20 hover:border-blue-500/30 hover:bg-blue-950/20 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {course.skill && <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-medium">{course.skill}</span>}
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      course.type === 'curso' ? 'bg-blue-500/20 text-blue-400' :
                      course.type === 'libro' ? 'bg-violet-500/20 text-violet-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>{course.type}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{course.title}</p>
                  {course.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{course.description}</p>}
                  {course.url && (
                    <a href={course.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mt-1">
                      <ExternalLink size={9} /> Ver curso
                    </a>
                  )}
                </div>
                <button onClick={() => handleImport(course)} disabled={done}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    done ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-default' : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}>
                  {done ? '✓ Agregado' : <><Import size={12} /> Agregar</>}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function ActionPlan() {
  const { skills, actionItems, setActionItems, catalog } = useApp()
  const [view, setView] = useState('list')   // 'list' | 'weekly' | 'monthly'
  const [adding, setAdding] = useState(false)
  const [showCatalog, setShowCatalog] = useState(false)
  const [filterSkill, setFilterSkill] = useState('all')
  const [newItem, setNewItem] = useState({
    skill: skills[0]?.name || '', type: 'curso', title: '', url: '', week: 1, done: false, milestone: false,
  })
  const [editingUrl, setEditingUrl] = useState(null)  // id of item being url-edited
  const [urlDraft, setUrlDraft] = useState('')

  const addItem = () => {
    if (!newItem.title.trim()) return
    setActionItems(prev => [...prev, { ...newItem, id: Date.now() }])
    setNewItem({ skill: skills[0]?.name || '', type: 'curso', title: '', url: '', week: 1, done: false, milestone: false })
    setAdding(false)
  }

  const importFromCatalog = (course) => {
    setActionItems(prev => [...prev, {
      id: Date.now(),
      skill: course.skill || skills[0]?.name || '',
      type: course.type,
      title: course.title,
      url: course.url || '',
      week: 1,
      done: false,
      milestone: false,
    }])
  }

  const saveUrl = (id) => {
    setActionItems(prev => prev.map(a => a.id === id ? { ...a, url: urlDraft.trim() } : a))
    setEditingUrl(null)
    setUrlDraft('')
  }

  const startEditUrl = (item) => {
    setEditingUrl(item.id)
    setUrlDraft(item.url || '')
  }

  const toggleDone = (id) => {
    setActionItems(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a))
  }

  const deleteItem = (id) => setActionItems(prev => prev.filter(a => a.id !== id))

  const filtered = filterSkill === 'all'
    ? actionItems
    : actionItems.filter(a => a.skill === filterSkill)

  const doneCount = filtered.filter(a => a.done).length
  const pct = filtered.length ? Math.round(doneCount / filtered.length * 100) : 0

  const skillNames = [...new Set(skills.map(s => s.name))]

  // Group for weekly view
  const byWeek = WEEKS.reduce((acc, w) => {
    acc[w] = filtered.filter(a => a.week === w)
    return acc
  }, {})

  // Group for monthly view (4 weeks per month)
  const byMonth = MONTHS.reduce((acc, m, i) => {
    const startWeek = i * 2 + 1
    acc[m] = filtered.filter(a => a.week >= startWeek && a.week < startWeek + 2)
    return acc
  }, {})

  return (
    <div className="p-8 max-w-4xl mx-auto animate-slide-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Plan de Acción</h1>
          <p className="text-gray-500 mt-1">Recursos, timeline y milestones para cerrar tus brechas</p>
        </div>
        <div className="flex items-center gap-2">
          {catalog?.length > 0 && (
            <button
              onClick={() => setShowCatalog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl text-sm font-medium hover:bg-cyan-500 transition shadow-lg shadow-cyan-900/40"
            >
              <BookMarked size={16} /> Catálogo ({catalog.length})
            </button>
          )}
          <button
            onClick={() => setAdding(s => !s)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-900/40"
          >
            <Plus size={16} /> Agregar recurso
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-[#0d1526] rounded-2xl border border-blue-900/30 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-white">Progreso General</p>
            <p className="text-xs text-gray-500">{doneCount} de {filtered.length} acciones completadas</p>
          </div>
          <p className="text-2xl font-bold text-blue-400">{pct}%</p>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700 shadow-sm shadow-blue-500/30"
            style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {skillNames.slice(0, 4).map(skill => {
            const items = actionItems.filter(a => a.skill === skill)
            const sp = items.length ? Math.round(items.filter(a => a.done).length / items.length * 100) : 0
            return (
              <div key={skill} className="text-center">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${sp}%` }} />
                </div>
                <p className="text-[10px] text-gray-600 truncate">{skill}</p>
                <p className="text-xs font-semibold text-gray-400">{sp}%</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* View toggle */}
        <div className="flex bg-gray-900 border border-blue-900/30 rounded-xl p-1 gap-1">
          {[
            { key: 'list',    label: 'Lista',   icon: LayoutList },
            { key: 'weekly',  label: 'Semanal', icon: Calendar },
            { key: 'monthly', label: 'Mensual', icon: Calendar },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${view === key ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-600 hover:text-gray-300'}`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5 flex-1">
          <button onClick={() => setFilterSkill('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${filterSkill === 'all' ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'bg-gray-800/50 border-gray-700/50 text-gray-500 hover:border-blue-500/30 hover:text-gray-300'}`}>
            Todas
          </button>
          {skillNames.map(skill => (
            <button key={skill} onClick={() => setFilterSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${filterSkill === skill ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'bg-gray-800/50 border-gray-700/50 text-gray-500 hover:border-blue-500/30 hover:text-gray-300'}`}>
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* New item form */}
      {adding && (
        <div className="bg-blue-950/30 border-2 border-blue-500/30 rounded-2xl p-5 mb-5 space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-blue-300">Nuevo Recurso</h3>
            <button onClick={() => setAdding(false)} className="text-gray-600 hover:text-gray-300"><X size={16} /></button>
          </div>
          {[
            { val: newItem.title, key: 'title', ph: 'Título del recurso (curso, libro, proyecto...)' },
            { val: newItem.url,   key: 'url',   ph: 'URL del recurso (opcional) — ej: https://coderhouse.com/...' },
          ].map(({ val, key, ph }) => (
            <input key={key} value={val} onChange={e => setNewItem(n => ({ ...n, [key]: e.target.value }))} placeholder={ph}
              className="w-full bg-gray-900 border border-blue-900/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition" />
          ))}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { lbl: 'Skill',  node: <select value={newItem.skill} onChange={e => setNewItem(n => ({ ...n, skill: e.target.value }))} className="w-full bg-gray-900 border border-blue-900/50 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition">{skillNames.map(s => <option key={s} value={s}>{s}</option>)}</select> },
              { lbl: 'Tipo',   node: <select value={newItem.type}  onChange={e => setNewItem(n => ({ ...n, type: e.target.value }))}  className="w-full bg-gray-900 border border-blue-900/50 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition">{RESOURCE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}</select> },
              { lbl: 'Semana', node: <select value={newItem.week}  onChange={e => setNewItem(n => ({ ...n, week: Number(e.target.value) }))} className="w-full bg-gray-900 border border-blue-900/50 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition">{WEEKS.map(w => <option key={w} value={w}>Semana {w}</option>)}</select> },
            ].map(({ lbl, node }) => (
              <div key={lbl}><label className="text-xs text-blue-400/70 font-medium mb-1 block">{lbl}</label>{node}</div>
            ))}
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-400/70">
                <input type="checkbox" checked={newItem.milestone} onChange={e => setNewItem(n => ({ ...n, milestone: e.target.checked }))} className="accent-blue-500 w-4 h-4" />
                Milestone
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-300">Cancelar</button>
            <button onClick={addItem} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-900/40">Agregar</button>
          </div>
        </div>
      )}

      {/* === LIST VIEW === */}
      {view === 'list' && (
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-700">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-20" />
              <p className="font-medium text-gray-500">Sin acciones</p>
              <p className="text-sm">Agregá recursos para empezar</p>
            </div>
          ) : (
            filtered.map(item => (
              <div key={item.id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  item.done ? 'bg-gray-900/30 border-gray-800/50' : item.milestone ? 'bg-amber-950/20 border-amber-500/20' : 'bg-[#0d1526] border-blue-900/30 hover:border-blue-500/30'
                }`}>
                <button onClick={() => toggleDone(item.id)} className="shrink-0">
                  {item.done
                    ? <CheckSquare size={20} className="text-blue-500" />
                    : <Square size={20} className="text-gray-700 hover:text-blue-500 transition" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.milestone && <Flag size={13} className="text-amber-400 shrink-0" />}
                    <p className={`text-sm font-medium ${item.done ? 'line-through text-gray-600' : 'text-gray-200'}`}>{item.title}</p>
                  </div>
                  {editingUrl === item.id ? (
                    <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                      <input autoFocus value={urlDraft} onChange={e => setUrlDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveUrl(item.id); if (e.key === 'Escape') setEditingUrl(null) }}
                        placeholder="https://..." className="flex-1 bg-gray-900 border border-blue-500/40 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition" />
                      <button onClick={() => saveUrl(item.id)} className="text-xs px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition">OK</button>
                      <button onClick={() => setEditingUrl(null)} className="text-gray-600 hover:text-gray-300"><X size={13} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <TypeBadge type={item.type} />
                      <span className="text-[10px] text-gray-600 bg-gray-800/80 px-1.5 py-0.5 rounded">{item.skill}</span>
                      <span className="text-[10px] text-gray-600">Sem. {item.week}</span>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-medium transition">
                          <ExternalLink size={10} /> Abrir recurso
                        </a>
                      ) : (
                        <button onClick={e => { e.stopPropagation(); startEditUrl(item) }}
                          className="inline-flex items-center gap-1 text-[10px] text-gray-600 hover:text-blue-400 transition">
                          <Link size={10} /> Agregar link
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.url && (
                    <button onClick={e => { e.stopPropagation(); startEditUrl(item) }} className="p-1 text-gray-700 hover:text-blue-400 transition"><Edit3 size={13} /></button>
                  )}
                  <button onClick={() => deleteItem(item.id)} className="p-1 text-gray-700 hover:text-red-400 transition"><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* === WEEKLY VIEW === */}
      {view === 'weekly' && (
        <div className="space-y-3">
          {WEEKS.map(week => {
            const items = byWeek[week]
            const hasItems = items.length > 0
            const hasMilestone = items.some(i => i.milestone)
            return (
              <div key={week} className={`rounded-2xl border overflow-hidden ${hasItems ? 'border-blue-900/30' : 'border-blue-900/10 opacity-40'}`}>
                <div className={`px-4 py-2.5 flex items-center gap-2 ${hasMilestone ? 'bg-amber-950/20 border-b border-amber-500/20' : 'bg-[#0a1020] border-b border-blue-900/20'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${hasMilestone ? 'bg-amber-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                    {week}
                  </div>
                  <p className="text-sm font-semibold text-gray-400">Semana {week}</p>
                  {hasMilestone && <Flag size={13} className="text-amber-400 ml-1" />}
                  <span className="ml-auto text-xs text-gray-600">{items.filter(i => i.done).length}/{items.length}</span>
                </div>
                {hasItems && (
                  <div className="bg-[#0d1526] divide-y divide-blue-900/10">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                        <button onClick={() => toggleDone(item.id)} className="shrink-0">
                          {item.done ? <CheckSquare size={16} className="text-blue-500" /> : <Square size={16} className="text-gray-700 hover:text-blue-500 transition" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${item.done ? 'line-through text-gray-600' : 'text-gray-300'}`}>{item.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <TypeBadge type={item.type} />
                            <span className="text-[10px] text-gray-600">{item.skill}</span>
                            {item.url && (
                              <a href={item.url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 font-medium">
                                <ExternalLink size={9} /> Abrir
                              </a>
                            )}
                          </div>
                        </div>
                        <button onClick={() => deleteItem(item.id)} className="text-gray-700 hover:text-red-400 transition"><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                )}
                {!hasItems && <div className="bg-[#0d1526] px-4 py-3 text-xs text-gray-700 italic">Sin actividades</div>}
              </div>
            )
          })}
        </div>
      )}

      {/* === MONTHLY VIEW === */}
      {view === 'monthly' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MONTHS.map((month, i) => {
            const items = byMonth[month]
            const done = items.filter(a => a.done).length
            const pctM = items.length ? Math.round(done / items.length * 100) : 0
            const milestones = items.filter(a => a.milestone)
            return (
              <div key={month} className="bg-[#0d1526] rounded-2xl border border-blue-900/30 overflow-hidden hover:border-blue-500/30 transition-colors">
                <div className="px-4 py-3 border-b border-blue-900/20 bg-gradient-to-r from-blue-950/50 to-cyan-950/20">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-white">{month}</p>
                    <span className="text-xs text-blue-400 font-bold">{pctM}%</span>
                  </div>
                  <div className="h-1 bg-gray-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full shadow-sm shadow-blue-500/30" style={{ width: `${pctM}%` }} />
                  </div>
                </div>
                <div className="p-3 space-y-2 min-h-[80px]">
                  {items.length === 0 && <p className="text-xs text-gray-700 italic text-center py-4">Sin actividades</p>}
                  {milestones.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-amber-950/20 border border-amber-500/20 rounded-lg px-2.5 py-1.5">
                      <Flag size={11} className="text-amber-400 shrink-0" />
                      <p className={`text-xs flex-1 truncate ${item.done ? 'line-through text-gray-600' : 'text-gray-300 font-medium'}`}>{item.title}</p>
                      <button onClick={() => toggleDone(item.id)}>
                        {item.done ? <CheckSquare size={13} className="text-blue-500" /> : <Square size={13} className="text-gray-700 hover:text-blue-500" />}
                      </button>
                    </div>
                  ))}
                  {items.filter(a => !a.milestone).map(item => (
                    <div key={item.id} className="flex items-center gap-2 px-1">
                      <button onClick={() => toggleDone(item.id)} className="shrink-0">
                        {item.done ? <CheckSquare size={13} className="text-blue-500" /> : <Square size={13} className="text-gray-700 hover:text-blue-500" />}
                      </button>
                      <p className={`text-xs flex-1 truncate ${item.done ? 'line-through text-gray-600' : 'text-gray-400'}`}>{item.title}</p>
                    </div>
                  ))}
                </div>
                <div className="px-3 pb-2.5 text-[10px] text-gray-700 border-t border-blue-900/10 pt-2">
                  Sem. {i * 2 + 1}–{i * 2 + 2} · {done}/{items.length} completadas
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Catalog Modal */}
      {showCatalog && (
        <CatalogModal
          catalog={catalog || []}
          onImport={importFromCatalog}
          onClose={() => setShowCatalog(false)}
        />
      )}
    </div>
  )
}
