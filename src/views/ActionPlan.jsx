import { useState } from 'react'
import { ClipboardList, Plus, Trash2, CheckSquare, Square, Flag, BookOpen, Code2, Mic, Star, X, Calendar, LayoutList, ExternalLink, Link, Edit3 } from 'lucide-react'
import { useApp } from '../App'

const RESOURCE_TYPES = [
  { key: 'curso',    label: 'Curso',      icon: BookOpen, color: 'bg-blue-100 text-blue-700' },
  { key: 'libro',    label: 'Libro',      icon: BookOpen, color: 'bg-purple-100 text-purple-700' },
  { key: 'proyecto', label: 'Proyecto',   icon: Code2,    color: 'bg-emerald-100 text-emerald-700' },
  { key: 'práctica', label: 'Práctica',   icon: Mic,      color: 'bg-orange-100 text-orange-700' },
  { key: 'otro',     label: 'Otro',       icon: Star,     color: 'bg-gray-100 text-gray-700' },
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

export default function ActionPlan() {
  const { skills, actionItems, setActionItems } = useApp()
  const [view, setView] = useState('list')   // 'list' | 'weekly' | 'monthly'
  const [adding, setAdding] = useState(false)
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
          <h1 className="text-2xl font-bold text-gray-900">Plan de Acción</h1>
          <p className="text-gray-500 mt-1">Recursos, timeline y milestones para cerrar tus brechas</p>
        </div>
        <button
          onClick={() => setAdding(s => !s)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={16} /> Agregar recurso
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-semibold text-gray-800">Progreso General</p>
            <p className="text-xs text-gray-500">{doneCount} de {filtered.length} acciones completadas</p>
          </div>
          <p className="text-2xl font-bold text-indigo-600">{pct}%</p>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        {/* Per-skill progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {skillNames.slice(0, 4).map(skill => {
            const items = actionItems.filter(a => a.skill === skill)
            const sp = items.length ? Math.round(items.filter(a => a.done).length / items.length * 100) : 0
            return (
              <div key={skill} className="text-center">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${sp}%` }} />
                </div>
                <p className="text-[10px] text-gray-500 truncate">{skill}</p>
                <p className="text-xs font-semibold text-gray-700">{sp}%</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* View toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {[
            { key: 'list',    label: 'Lista',    icon: LayoutList },
            { key: 'weekly',  label: 'Semanal',  icon: Calendar },
            { key: 'monthly', label: 'Mensual',  icon: Calendar },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${view === key ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Skill filter */}
        <div className="flex flex-wrap gap-1.5 flex-1">
          <button
            onClick={() => setFilterSkill('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterSkill === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
          >
            Todas
          </button>
          {skillNames.map(skill => (
            <button
              key={skill}
              onClick={() => setFilterSkill(skill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterSkill === skill ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'}`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* New item form */}
      {adding && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-5 mb-5 space-y-4 animate-slide-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-indigo-800">Nuevo Recurso</h3>
            <button onClick={() => setAdding(false)} className="text-indigo-400 hover:text-indigo-600"><X size={16} /></button>
          </div>

          <input
            value={newItem.title}
            onChange={e => setNewItem(n => ({ ...n, title: e.target.value }))}
            placeholder="Título del recurso (curso, libro, proyecto...)"
            className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />

          <input
            value={newItem.url}
            onChange={e => setNewItem(n => ({ ...n, url: e.target.value }))}
            placeholder="URL del recurso (opcional) — ej: https://coderhouse.com/..."
            className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-indigo-700 font-medium mb-1 block">Skill</label>
              <select value={newItem.skill} onChange={e => setNewItem(n => ({ ...n, skill: e.target.value }))}
                className="w-full border border-indigo-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {skillNames.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-indigo-700 font-medium mb-1 block">Tipo</label>
              <select value={newItem.type} onChange={e => setNewItem(n => ({ ...n, type: e.target.value }))}
                className="w-full border border-indigo-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {RESOURCE_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-indigo-700 font-medium mb-1 block">Semana</label>
              <select value={newItem.week} onChange={e => setNewItem(n => ({ ...n, week: Number(e.target.value) }))}
                className="w-full border border-indigo-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300">
                {WEEKS.map(w => <option key={w} value={w}>Semana {w}</option>)}
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-indigo-700">
                <input type="checkbox" checked={newItem.milestone}
                  onChange={e => setNewItem(n => ({ ...n, milestone: e.target.checked }))}
                  className="accent-indigo-500 w-4 h-4" />
                Milestone
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
            <button onClick={addItem} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm">
              Agregar
            </button>
          </div>
        </div>
      )}

      {/* === LIST VIEW === */}
      {view === 'list' && (
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Sin acciones</p>
              <p className="text-sm">Agrega recursos para empezar</p>
            </div>
          ) : (
            filtered.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  item.done ? 'bg-gray-50 border-gray-100' : item.milestone ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100 shadow-sm'
                }`}
              >
                <button onClick={() => toggleDone(item.id)} className="shrink-0">
                  {item.done
                    ? <CheckSquare size={20} className="text-indigo-500" />
                    : <Square size={20} className="text-gray-300 hover:text-indigo-400 transition" />
                  }
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.milestone && <Flag size={13} className="text-amber-500 shrink-0" />}
                    <p className={`text-sm font-medium ${item.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {item.title}
                    </p>
                  </div>

                  {/* URL inline editor */}
                  {editingUrl === item.id ? (
                    <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                      <input
                        autoFocus
                        value={urlDraft}
                        onChange={e => setUrlDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveUrl(item.id); if (e.key === 'Escape') setEditingUrl(null) }}
                        placeholder="https://..."
                        className="flex-1 border border-indigo-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                      />
                      <button onClick={() => saveUrl(item.id)} className="text-xs px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">OK</button>
                      <button onClick={() => setEditingUrl(null)} className="text-gray-400 hover:text-gray-600"><X size={13} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <TypeBadge type={item.type} />
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{item.skill}</span>
                      <span className="text-[10px] text-gray-400">Sem. {item.week}</span>
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-medium transition"
                        >
                          <ExternalLink size={10} /> Abrir recurso
                        </a>
                      ) : (
                        <button
                          onClick={e => { e.stopPropagation(); startEditUrl(item) }}
                          className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-indigo-500 transition"
                        >
                          <Link size={10} /> Agregar link
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {item.url && (
                    <button onClick={e => { e.stopPropagation(); startEditUrl(item) }} className="p-1 text-gray-200 hover:text-indigo-400 transition">
                      <Edit3 size={13} />
                    </button>
                  )}
                  <button onClick={() => deleteItem(item.id)} className="p-1 text-gray-200 hover:text-red-400 transition">
                    <Trash2 size={14} />
                  </button>
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
              <div key={week} className={`rounded-2xl border overflow-hidden ${hasItems ? 'shadow-sm' : 'opacity-40'}`}>
                <div className={`px-4 py-2.5 flex items-center gap-2 ${hasMilestone ? 'bg-amber-50 border-b border-amber-200' : 'bg-gray-50 border-b border-gray-100'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${hasMilestone ? 'bg-amber-400 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {week}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Semana {week}</p>
                  {hasMilestone && <Flag size={13} className="text-amber-500 ml-1" />}
                  <span className="ml-auto text-xs text-gray-400">{items.filter(i => i.done).length}/{items.length}</span>
                </div>
                {hasItems && (
                  <div className="bg-white divide-y divide-gray-50">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                        <button onClick={() => toggleDone(item.id)} className="shrink-0">
                          {item.done
                            ? <CheckSquare size={16} className="text-indigo-500" />
                            : <Square size={16} className="text-gray-300 hover:text-indigo-400 transition" />
                          }
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>{item.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <TypeBadge type={item.type} />
                            <span className="text-[10px] text-gray-400">{item.skill}</span>
                            {item.url && (
                              <a href={item.url} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-medium">
                                <ExternalLink size={9} /> Abrir
                              </a>
                            )}
                          </div>
                        </div>
                        <button onClick={() => deleteItem(item.id)} className="text-gray-200 hover:text-red-400 transition">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {!hasItems && (
                  <div className="bg-white px-4 py-3 text-xs text-gray-300 italic">Sin actividades</div>
                )}
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
              <div key={month} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-800">{month}</p>
                    <span className="text-xs text-indigo-600 font-bold">{pctM}%</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${pctM}%` }} />
                  </div>
                </div>
                <div className="p-3 space-y-2 min-h-[80px]">
                  {items.length === 0 && <p className="text-xs text-gray-300 italic text-center py-4">Sin actividades</p>}
                  {milestones.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-amber-50 rounded-lg px-2.5 py-1.5">
                      <Flag size={11} className="text-amber-500 shrink-0" />
                      <p className={`text-xs flex-1 truncate ${item.done ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>{item.title}</p>
                      <button onClick={() => toggleDone(item.id)}>
                        {item.done ? <CheckSquare size={13} className="text-indigo-500" /> : <Square size={13} className="text-gray-300 hover:text-indigo-400" />}
                      </button>
                    </div>
                  ))}
                  {items.filter(a => !a.milestone).map(item => (
                    <div key={item.id} className="flex items-center gap-2 px-1">
                      <button onClick={() => toggleDone(item.id)} className="shrink-0">
                        {item.done ? <CheckSquare size={13} className="text-indigo-500" /> : <Square size={13} className="text-gray-300 hover:text-indigo-400" />}
                      </button>
                      <p className={`text-xs flex-1 truncate ${item.done ? 'line-through text-gray-400' : 'text-gray-600'}`}>{item.title}</p>
                    </div>
                  ))}
                </div>
                <div className="px-3 pb-2.5 text-[10px] text-gray-400 border-t border-gray-50 pt-2">
                  Sem. {i * 2 + 1}–{i * 2 + 2} · {done}/{items.length} completadas
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
