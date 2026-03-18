import { useState } from 'react'
import { Target, Plus, Trash2, CheckSquare, Square, Calendar, ChevronDown, ChevronUp, Edit3, X } from 'lucide-react'
import { useApp } from '../App'

const PRIORITIES = [
  { key: 'high',   label: 'Alta',  color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { key: 'medium', label: 'Media', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { key: 'low',    label: 'Baja',  color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
]

const CATEGORIES = [
  { key: 'liderazgo',   label: 'Liderazgo',  emoji: '🎯' },
  { key: 'técnico',     label: 'Técnico',    emoji: '💻' },
  { key: 'soft skills', label: 'Soft Skills',emoji: '🤝' },
  { key: 'networking',  label: 'Networking', emoji: '🌐' },
  { key: 'visibilidad', label: 'Visibilidad',emoji: '✨' },
]

const CAT_COLORS = {
  liderazgo:    'bg-violet-500/20 text-violet-400',
  técnico:      'bg-blue-500/20 text-blue-400',
  'soft skills':'bg-teal-500/20 text-teal-400',
  networking:   'bg-orange-500/20 text-orange-400',
  visibilidad:  'bg-pink-500/20 text-pink-400',
}

const BLANK_OBJ = {
  title: '', description: '', priority: 'medium', category: 'técnico',
  deadline: '', keyResults: [{ id: Date.now(), text: '', done: false }],
}

const inputCls = "w-full bg-gray-900 border border-blue-900/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
const selectCls = "w-full bg-gray-900 border border-blue-900/50 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"

function ObjectiveCard({ obj, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(obj)

  const pct = obj.keyResults.length
    ? Math.round(obj.keyResults.filter(k => k.done).length / obj.keyResults.length * 100)
    : 0

  const priority = PRIORITIES.find(p => p.key === obj.priority)
  const category = CATEGORIES.find(c => c.key === obj.category)

  const toggleKR = (krId) => onUpdate({ ...obj, keyResults: obj.keyResults.map(k => k.id === krId ? { ...k, done: !k.done } : k) })
  const saveDraft = () => { onUpdate(draft); setEditing(false) }
  const addKR = () => setDraft(d => ({ ...d, keyResults: [...d.keyResults, { id: Date.now(), text: '', done: false }] }))
  const removeKR = (id) => setDraft(d => ({ ...d, keyResults: d.keyResults.filter(k => k.id !== id) }))
  const updateKRText = (id, text) => setDraft(d => ({ ...d, keyResults: d.keyResults.map(k => k.id === id ? { ...k, text } : k) }))

  if (editing) {
    return (
      <div className="bg-[#0d1526] rounded-2xl border-2 border-blue-500/30 p-5 space-y-4 animate-fade-in shadow-lg shadow-blue-900/20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Editar Objetivo</h3>
          <button onClick={() => setEditing(false)} className="text-gray-600 hover:text-gray-300"><X size={18} /></button>
        </div>
        <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="Título" className={inputCls} />
        <textarea value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Descripción" rows={2}
          className="w-full bg-gray-900 border border-blue-900/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition" />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Prioridad</label>
            <select value={draft.priority} onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))} className={selectCls}>
              {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
            <select value={draft.category} onChange={e => setDraft(d => ({ ...d, category: e.target.value }))} className={selectCls}>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fecha límite</label>
            <input type="date" value={draft.deadline} onChange={e => setDraft(d => ({ ...d, deadline: e.target.value }))}
              className="w-full bg-gray-900 border border-blue-900/50 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition" />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-2 block font-medium">Key Results</label>
          <div className="space-y-2">
            {draft.keyResults.map((kr, i) => (
              <div key={kr.id} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-4">{i + 1}.</span>
                <input value={kr.text} onChange={e => updateKRText(kr.id, e.target.value)} placeholder={`Key Result ${i + 1}`}
                  className="flex-1 bg-gray-900 border border-blue-900/40 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition" />
                <button onClick={() => removeKR(kr.id)} className="text-gray-700 hover:text-red-400 transition"><X size={14} /></button>
              </div>
            ))}
          </div>
          <button onClick={addKR} className="mt-2 text-xs text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1">
            <Plus size={13} /> Agregar Key Result
          </button>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-blue-900/30">
          <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-300">Cancelar</button>
          <button onClick={saveDraft} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition">Guardar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0d1526] rounded-2xl border border-blue-900/30 hover:border-blue-500/30 transition-colors overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white leading-tight">{obj.title || 'Sin título'}</h3>
            {obj.description && <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{obj.description}</p>}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 text-gray-700 hover:text-blue-400 transition rounded-lg hover:bg-blue-950/50"><Edit3 size={14} /></button>
            <button onClick={onDelete} className="p-1.5 text-gray-700 hover:text-red-400 transition rounded-lg hover:bg-red-950/30"><Trash2 size={14} /></button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {priority && <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${priority.color}`}>{priority.label} prioridad</span>}
          {category && <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${CAT_COLORS[obj.category] || 'bg-gray-700 text-gray-400'}`}>{category.emoji} {category.label}</span>}
          {obj.deadline && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-800/80 text-gray-500 flex items-center gap-1">
              <Calendar size={10} />{new Date(obj.deadline).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 shadow-sm ${pct === 100 ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-900/50'}`}
              style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-semibold text-gray-400 w-8 text-right">{pct}%</span>
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-gray-600 hover:text-gray-400 transition">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <p className="text-[10px] text-gray-700 mt-1">{obj.keyResults.filter(k => k.done).length}/{obj.keyResults.length} key results completados</p>
      </div>
      {expanded && (
        <div className="border-t border-blue-900/20 px-5 py-4 space-y-2 bg-black/20 animate-fade-in">
          {obj.keyResults.map(kr => (
            <button key={kr.id} onClick={() => toggleKR(kr.id)} className="w-full flex items-start gap-3 text-left group">
              {kr.done
                ? <CheckSquare size={16} className="text-blue-500 mt-0.5 shrink-0" />
                : <Square size={16} className="text-gray-700 group-hover:text-blue-500/50 mt-0.5 shrink-0 transition" />}
              <span className={`text-sm leading-relaxed ${kr.done ? 'line-through text-gray-700' : 'text-gray-400'}`}>
                {kr.text || 'Key result sin texto'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Objectives() {
  const { objectives, setObjectives } = useApp()
  const [adding, setAdding] = useState(false)
  const [newObj, setNewObj] = useState(BLANK_OBJ)
  const [filter, setFilter] = useState('all')

  const addObjective = () => {
    if (!newObj.title.trim()) return
    setObjectives(prev => [...prev, { ...newObj, id: Date.now() }])
    setNewObj({ ...BLANK_OBJ, keyResults: [{ id: Date.now(), text: '', done: false }] })
    setAdding(false)
  }

  const filtered = filter === 'all' ? objectives : objectives.filter(o => o.priority === filter || o.category === filter)

  const filterBtn = (k, l) => (
    <button key={k} onClick={() => setFilter(k)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${filter === k ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' : 'bg-gray-800/50 text-gray-500 border-gray-700/50 hover:border-blue-500/30 hover:text-gray-300'}`}>
      {l}
    </button>
  )

  return (
    <div className="p-8 max-w-3xl mx-auto animate-slide-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Objetivos OKR</h1>
          <p className="text-gray-500 mt-1">Define metas claras y medibles con key results</p>
        </div>
        <button onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-900/40">
          <Plus size={16} /> Nuevo objetivo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total',       value: objectives.length, color: 'text-white' },
          { label: 'En progreso', value: objectives.filter(o => { const p = o.keyResults.filter(k=>k.done).length; return p > 0 && p < o.keyResults.length }).length, color: 'text-blue-400' },
          { label: 'Completados', value: objectives.filter(o => o.keyResults.length && o.keyResults.every(k=>k.done)).length, color: 'text-emerald-400' },
        ].map(stat => (
          <div key={stat.label} className="bg-[#0d1526] rounded-xl p-3 text-center border border-blue-900/30">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {filterBtn('all', 'Todos')}
        {PRIORITIES.map(p => filterBtn(p.key, p.label))}
        {CATEGORIES.map(c => filterBtn(c.key, `${c.emoji} ${c.label}`))}
      </div>

      {/* New form */}
      {adding && (
        <div className="bg-blue-950/30 border-2 border-blue-500/30 rounded-2xl p-5 mb-5 space-y-4 animate-slide-in">
          <h3 className="font-semibold text-blue-300">Nuevo Objetivo</h3>
          <input value={newObj.title} onChange={e => setNewObj(n => ({ ...n, title: e.target.value }))} placeholder="¿Qué querés lograr?" className={inputCls} />
          <div className="grid grid-cols-3 gap-3">
            <select value={newObj.priority} onChange={e => setNewObj(n => ({ ...n, priority: e.target.value }))} className={selectCls}>
              {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label} prioridad</option>)}
            </select>
            <select value={newObj.category} onChange={e => setNewObj(n => ({ ...n, category: e.target.value }))} className={selectCls}>
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
            </select>
            <input type="date" value={newObj.deadline} onChange={e => setNewObj(n => ({ ...n, deadline: e.target.value }))}
              className="w-full bg-gray-900 border border-blue-900/50 rounded-xl px-3 py-2.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-blue-400/70 font-medium">Key Results</label>
            {newObj.keyResults.map((kr, i) => (
              <div key={kr.id} className="flex gap-2">
                <input value={kr.text}
                  onChange={e => setNewObj(n => ({ ...n, keyResults: n.keyResults.map(k => k.id === kr.id ? { ...k, text: e.target.value } : k) }))}
                  placeholder={`Key Result ${i + 1}`}
                  className="flex-1 bg-gray-900 border border-blue-900/40 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition" />
                {newObj.keyResults.length > 1 && (
                  <button onClick={() => setNewObj(n => ({ ...n, keyResults: n.keyResults.filter(k => k.id !== kr.id) }))} className="text-gray-700 hover:text-red-400 transition"><X size={14} /></button>
                )}
              </div>
            ))}
            <button onClick={() => setNewObj(n => ({ ...n, keyResults: [...n.keyResults, { id: Date.now(), text: '', done: false }] }))}
              className="text-xs text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1">
              <Plus size={13} /> Agregar Key Result
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-300">Cancelar</button>
            <button onClick={addObjective} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition shadow-lg shadow-blue-900/40">Crear Objetivo</button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-700">
          <Target size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium text-gray-500">Sin objetivos</p>
          <p className="text-sm">Creá tu primer OKR haciendo click en "Nuevo objetivo"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(obj => (
            <ObjectiveCard key={obj.id} obj={obj}
              onUpdate={u => setObjectives(prev => prev.map(o => o.id === u.id ? u : o))}
              onDelete={() => setObjectives(prev => prev.filter(o => o.id !== obj.id))} />
          ))}
        </div>
      )}
    </div>
  )
}
