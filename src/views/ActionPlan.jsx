import { useState } from 'react'
import { ClipboardList, Plus, Trash2, Flag, BookOpen, Code2, Mic, Star, X, Calendar, LayoutList, ExternalLink, Link, Edit3, BookMarked } from 'lucide-react'
import { useApp } from '../App'

const RESOURCE_TYPES = [
  { key: 'curso',    label: 'Curso',    icon: BookOpen, badge: 'bg-h-100 text-h-800' },
  { key: 'libro',    label: 'Libro',    icon: BookOpen, badge: 'bg-p-100 text-p-800' },
  { key: 'proyecto', label: 'Proyecto', icon: Code2,    badge: 'bg-g-100 text-g-800' },
  { key: 'práctica', label: 'Práctica', icon: Mic,      badge: 'bg-y-100 text-y-700' },
  { key: 'otro',     label: 'Otro',     icon: Star,     badge: 'bg-n-100 text-n-800' },
]
const WEEKS  = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const MONTHS = ['Mes 1', 'Mes 2', 'Mes 3', 'Mes 4', 'Mes 5', 'Mes 6']

function TypeBadge({ type }) {
  const t = RESOURCE_TYPES.find(r => r.key === type) || RESOURCE_TYPES[4]
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.badge}`}>
      <t.icon size={9} /> {t.label}
    </span>
  )
}

function GoalCheck({ done, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all mt-0.5 ${
        done ? 'bg-h-500 border-h-500 text-white' : 'border-n-300 hover:border-h-400'
      }`}>
      {done && <span className="text-[9px] font-bold">✓</span>}
    </button>
  )
}

function CatalogModal({ catalog, onImport, onClose }) {
  const [search, setSearch]     = useState('')
  const [imported, setImported] = useState(new Set())

  const filtered = catalog.filter(c =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.skill?.toLowerCase().includes(search.toLowerCase())
  )

  const handleImport = (course) => {
    onImport(course)
    setImported(s => new Set([...s, course.id]))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-n-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-8dp w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-n-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-n-100">
          <div className="flex items-center gap-2">
            <BookMarked size={16} className="text-h-500" />
            <h2 className="text-sm font-semibold text-n-950">Catálogo de Recursos</h2>
            <span className="text-[10px] font-semibold bg-h-100 text-h-800 px-2 py-0.5 rounded-full">{catalog.length}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg text-n-600 hover:text-n-950 hover:bg-n-100 flex items-center justify-center transition"><X size={16} /></button>
        </div>
        <div className="px-6 py-3 border-b border-n-100">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o skill..." className="input-humand" />
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 scrollbar-thin">
          {filtered.length === 0 && <p className="text-center text-n-600 py-8 text-sm">Sin resultados</p>}
          {filtered.map(course => {
            const done = imported.has(course.id)
            return (
              <div key={course.id} className="flex items-start gap-4 p-4 rounded-xl border border-n-200 hover:border-h-400 hover:shadow-8dp transition-all cursor-pointer">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    {course.skill && <span className="text-[10px] font-semibold bg-h-50 text-h-800 border border-h-100 px-2 py-0.5 rounded-full">{course.skill}</span>}
                    <TypeBadge type={course.type} />
                  </div>
                  <p className="text-[13px] font-semibold text-n-950">{course.title}</p>
                  {course.description && <p className="text-xs text-n-800 mt-0.5 line-clamp-2">{course.description}</p>}
                  {course.url && (
                    <a href={course.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-h-500 hover:text-h-600 mt-1">
                      <ExternalLink size={9} /> Ver recurso
                    </a>
                  )}
                </div>
                <button onClick={() => handleImport(course)} disabled={done}
                  className={`shrink-0 h-8 px-3 rounded-lg text-[12px] font-semibold transition ${
                    done ? 'bg-g-100 text-g-800 cursor-default' : 'bg-h-500 hover:bg-h-600 text-white'
                  }`}>
                  {done ? '✓ Agregado' : 'Agregar'}
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
  const [view, setView]             = useState('list')
  const [adding, setAdding]         = useState(false)
  const [showCatalog, setShowCatalog] = useState(false)
  const [filterSkill, setFilterSkill] = useState('all')
  const [newItem, setNewItem]       = useState({ skill: skills[0]?.name || '', type: 'curso', title: '', url: '', week: 1, done: false, milestone: false })
  const [editingUrl, setEditingUrl] = useState(null)
  const [urlDraft, setUrlDraft]     = useState('')

  const addItem = () => {
    if (!newItem.title.trim()) return
    setActionItems(prev => [...prev, { ...newItem, id: Date.now() }])
    setNewItem({ skill: skills[0]?.name || '', type: 'curso', title: '', url: '', week: 1, done: false, milestone: false })
    setAdding(false)
  }

  const importFromCatalog = (course) => {
    setActionItems(prev => [...prev, { id: Date.now(), skill: course.skill || skills[0]?.name || '', type: course.type, title: course.title, url: course.url || '', week: 1, done: false, milestone: false }])
  }

  const saveUrl  = (id) => { setActionItems(prev => prev.map(a => a.id === id ? { ...a, url: urlDraft.trim() } : a)); setEditingUrl(null) }
  const toggleDone  = (id) => setActionItems(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a))
  const deleteItem  = (id) => setActionItems(prev => prev.filter(a => a.id !== id))

  const filtered    = filterSkill === 'all' ? actionItems : actionItems.filter(a => a.skill === filterSkill)
  const doneCount   = filtered.filter(a => a.done).length
  const pct         = filtered.length ? Math.round(doneCount / filtered.length * 100) : 0
  const skillNames  = [...new Set(skills.map(s => s.name))]
  const byWeek      = WEEKS.reduce((acc, w) => { acc[w] = filtered.filter(a => a.week === w); return acc }, {})
  const byMonth     = MONTHS.reduce((acc, m, i) => { const s = i * 2 + 1; acc[m] = filtered.filter(a => a.week >= s && a.week < s + 2); return acc }, {})

  return (
    <div className="p-8 max-w-4xl mx-auto animate-slide-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-n-950">Plan de Acción</h1>
          <p className="text-sm text-n-800 mt-1">Recursos, timeline y milestones para cerrar tus brechas</p>
        </div>
        <div className="flex items-center gap-2">
          {catalog?.length > 0 && (
            <button onClick={() => setShowCatalog(true)}
              className="inline-flex items-center gap-1.5 h-9 px-4 bg-white border border-n-200 shadow-4dp hover:shadow-8dp text-n-950 rounded-lg text-[13px] font-semibold transition">
              <BookMarked size={15} /> Catálogo ({catalog.length})
            </button>
          )}
          <button onClick={() => setAdding(s => !s)}
            className="inline-flex items-center gap-1.5 h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition shadow-4dp">
            <Plus size={15} /> Agregar recurso
          </button>
        </div>
      </div>

      {/* Progress card */}
      <div className="bg-white rounded-2xl shadow-4dp p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-n-950">Progreso General</p>
            <p className="text-xs text-n-800 mt-0.5">{doneCount} de {filtered.length} acciones completadas</p>
          </div>
          <p className="text-2xl font-semibold text-h-500">{pct}%</p>
        </div>
        <div className="h-1.5 bg-n-100 rounded-full overflow-hidden mb-4">
          <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {skillNames.slice(0, 4).map(skill => {
            const items = actionItems.filter(a => a.skill === skill)
            const sp    = items.length ? Math.round(items.filter(a => a.done).length / items.length * 100) : 0
            return (
              <div key={skill}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[11px] text-n-800 truncate">{skill}</p>
                  <p className="text-[11px] font-semibold text-n-950">{sp}%</p>
                </div>
                <div className="h-1 bg-n-100 rounded-full overflow-hidden">
                  <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${sp}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex bg-n-100 rounded-lg p-1 gap-1">
          {[
            { key: 'list',    label: 'Lista',   icon: LayoutList },
            { key: 'weekly',  label: 'Semanal', icon: Calendar },
            { key: 'monthly', label: 'Mensual', icon: Calendar },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setView(key)}
              className={`inline-flex items-center gap-1.5 h-8 px-3 rounded text-[12px] font-semibold transition ${view === key ? 'bg-white shadow-4dp text-n-950' : 'text-n-800 hover:text-n-950'}`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {[['all', 'Todas'], ...skillNames.map(s => [s, s])].map(([k, l]) => (
            <button key={k} onClick={() => setFilterSkill(k)}
              className={`h-7 px-3 rounded-full text-[11px] font-semibold border transition-all ${
                filterSkill === k ? 'bg-h-50 text-h-600 border-h-200' : 'bg-n-100 text-n-800 border-transparent hover:border-n-300'
              }`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* New item form */}
      {adding && (
        <div className="bg-h-50 border-2 border-h-200 rounded-2xl p-5 mb-5 space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-h-800">Nuevo Recurso</h3>
            <button onClick={() => setAdding(false)} className="text-n-600 hover:text-n-950"><X size={16} /></button>
          </div>
          <input value={newItem.title} onChange={e => setNewItem(n => ({ ...n, title: e.target.value }))} placeholder="Título del recurso..." className="input-humand" />
          <input value={newItem.url}   onChange={e => setNewItem(n => ({ ...n, url:   e.target.value }))} placeholder="URL (opcional)" className="input-humand" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Skill</label>
              <select value={newItem.skill} onChange={e => setNewItem(n => ({ ...n, skill: e.target.value }))} className="input-humand">
                {skillNames.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Tipo</label>
              <select value={newItem.type} onChange={e => setNewItem(n => ({ ...n, type: e.target.value }))} className="input-humand">
                {RESOURCE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Semana</label>
              <select value={newItem.week} onChange={e => setNewItem(n => ({ ...n, week: Number(e.target.value) }))} className="input-humand">
                {WEEKS.map(w => <option key={w} value={w}>Semana {w}</option>)}
              </select>
            </div>
            <div className="flex flex-col justify-end pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-[13px] text-n-800">
                <input type="checkbox" checked={newItem.milestone} onChange={e => setNewItem(n => ({ ...n, milestone: e.target.checked }))} className="accent-[#496be3] w-4 h-4" />
                Milestone
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-h-100">
            <button onClick={() => setAdding(false)} className="h-9 px-4 text-[13px] font-semibold text-n-800 hover:text-n-950 rounded-lg hover:bg-n-100 transition">Cancelar</button>
            <button onClick={addItem} className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition shadow-4dp">Agregar</button>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-n-600">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold text-n-800">Sin acciones</p>
              <p className="text-sm mt-1">Agregá recursos para empezar</p>
            </div>
          ) : (
            filtered.map(item => (
              <div key={item.id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                  item.done ? 'bg-n-50 border-n-200 opacity-70' : item.milestone ? 'bg-y-50 border-y-200' : 'bg-white border-n-200 hover:border-h-400 hover:shadow-8dp'
                }`}>
                <GoalCheck done={item.done} onClick={() => toggleDone(item.id)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.milestone && <Flag size={12} className="text-y-600 shrink-0" />}
                    <p className={`text-[13px] font-semibold ${item.done ? 'line-through text-n-500' : 'text-n-950'}`}>{item.title}</p>
                  </div>
                  {editingUrl === item.id ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input autoFocus value={urlDraft} onChange={e => setUrlDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveUrl(item.id); if (e.key === 'Escape') setEditingUrl(null) }}
                        placeholder="https://..." className="input-humand flex-1" style={{ height: 32 }} />
                      <button onClick={() => saveUrl(item.id)} className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition">OK</button>
                      <button onClick={() => setEditingUrl(null)} className="text-n-600 hover:text-n-950"><X size={13} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <TypeBadge type={item.type} />
                      <span className="text-[10px] font-semibold bg-n-100 text-n-800 px-2 py-0.5 rounded-full">{item.skill}</span>
                      <span className="text-[10px] text-n-600">Sem. {item.week}</span>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-h-500 hover:text-h-600 transition">
                          <ExternalLink size={9} /> Abrir recurso
                        </a>
                      ) : (
                        <button onClick={() => { setEditingUrl(item.id); setUrlDraft('') }}
                          className="inline-flex items-center gap-1 text-[10px] text-n-600 hover:text-h-500 transition">
                          <Link size={9} /> Agregar link
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {item.url && (
                    <button onClick={() => { setEditingUrl(item.id); setUrlDraft(item.url) }} className="p-1.5 text-n-500 hover:text-h-500 rounded-lg hover:bg-h-50 transition"><Edit3 size={13} /></button>
                  )}
                  <button onClick={() => deleteItem(item.id)} className="p-1.5 text-n-500 hover:text-r-600 rounded-lg hover:bg-r-50 transition"><Trash2 size={13} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* WEEKLY VIEW */}
      {view === 'weekly' && (
        <div className="space-y-3">
          {WEEKS.map(week => {
            const items        = byWeek[week]
            const hasItems     = items.length > 0
            const hasMilestone = items.some(i => i.milestone)
            return (
              <div key={week} className={`bg-white rounded-2xl shadow-4dp overflow-hidden ${!hasItems && 'opacity-40'}`}>
                <div className={`px-5 py-3 flex items-center gap-2 border-b ${hasMilestone ? 'bg-y-50 border-y-100' : 'bg-n-50 border-n-100'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${hasMilestone ? 'bg-y-400 text-white' : 'bg-n-200 text-n-800'}`}>
                    {week}
                  </div>
                  <p className="text-[13px] font-semibold text-n-950">Semana {week}</p>
                  {hasMilestone && <Flag size={12} className="text-y-600 ml-1" />}
                  <span className="ml-auto text-[11px] text-n-600">{items.filter(i => i.done).length}/{items.length}</span>
                </div>
                {hasItems && (
                  <div className="divide-y divide-n-100">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 px-5 py-3">
                        <GoalCheck done={item.done} onClick={() => toggleDone(item.id)} />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-semibold ${item.done ? 'line-through text-n-500' : 'text-n-950'}`}>{item.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <TypeBadge type={item.type} />
                            <span className="text-[10px] text-n-600">{item.skill}</span>
                            {item.url && (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-semibold text-h-500 hover:text-h-600">
                                <ExternalLink size={9} /> Abrir
                              </a>
                            )}
                          </div>
                        </div>
                        <button onClick={() => deleteItem(item.id)} className="text-n-400 hover:text-r-600 transition p-1.5 rounded-lg hover:bg-r-50"><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                )}
                {!hasItems && <div className="px-5 py-3 text-xs text-n-500 italic">Sin actividades</div>}
              </div>
            )
          })}
        </div>
      )}

      {/* MONTHLY VIEW */}
      {view === 'monthly' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MONTHS.map((month, i) => {
            const items     = byMonth[month]
            const done      = items.filter(a => a.done).length
            const pctM      = items.length ? Math.round(done / items.length * 100) : 0
            const milestones = items.filter(a => a.milestone)
            return (
              <div key={month} className="bg-white rounded-2xl shadow-4dp overflow-hidden hover:shadow-8dp transition-shadow">
                <div className="px-4 py-3 border-b border-n-100 bg-n-50">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[13px] font-semibold text-n-950">{month}</p>
                    <span className="text-xs font-semibold text-h-500">{pctM}%</span>
                  </div>
                  <div className="h-1 bg-n-100 rounded-full overflow-hidden">
                    <div className="h-full bg-h-500 rounded-full bar-fill" style={{ width: `${pctM}%` }} />
                  </div>
                </div>
                <div className="p-3 space-y-2 min-h-[80px]">
                  {items.length === 0 && <p className="text-xs text-n-500 italic text-center py-4">Sin actividades</p>}
                  {milestones.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-y-50 border border-y-200 rounded-lg px-2.5 py-1.5">
                      <Flag size={10} className="text-y-600 shrink-0" />
                      <p className={`text-xs flex-1 truncate font-semibold ${item.done ? 'line-through text-n-500' : 'text-n-950'}`}>{item.title}</p>
                      <GoalCheck done={item.done} onClick={() => toggleDone(item.id)} />
                    </div>
                  ))}
                  {items.filter(a => !a.milestone).map(item => (
                    <div key={item.id} className="flex items-center gap-2 px-1">
                      <GoalCheck done={item.done} onClick={() => toggleDone(item.id)} />
                      <p className={`text-xs flex-1 truncate ${item.done ? 'line-through text-n-500' : 'text-n-800'}`}>{item.title}</p>
                    </div>
                  ))}
                </div>
                <div className="px-3 pb-2.5 text-[10px] text-n-600 border-t border-n-100 pt-2">
                  Sem. {i * 2 + 1}–{i * 2 + 2} · {done}/{items.length} completadas
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCatalog && (
        <CatalogModal catalog={catalog || []} onImport={importFromCatalog} onClose={() => setShowCatalog(false)} />
      )}
    </div>
  )
}
