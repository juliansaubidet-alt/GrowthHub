import { useState } from 'react'
import { Target, Plus, Trash2, CheckSquare, Square, Calendar, Tag, ChevronDown, ChevronUp, Edit3, X } from 'lucide-react'
import { useApp } from '../App'

const PRIORITIES = [
  { key: 'high',   label: 'Alta',  color: 'bg-red-100 text-red-700 border-red-200' },
  { key: 'medium', label: 'Media', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { key: 'low',    label: 'Baja',  color: 'bg-green-100 text-green-700 border-green-200' },
]

const CATEGORIES = [
  { key: 'liderazgo',   label: 'Liderazgo',    emoji: '🎯' },
  { key: 'técnico',     label: 'Técnico',       emoji: '💻' },
  { key: 'soft skills', label: 'Soft Skills',   emoji: '🤝' },
  { key: 'networking',  label: 'Networking',    emoji: '🌐' },
  { key: 'visibilidad', label: 'Visibilidad',   emoji: '✨' },
]

const CAT_COLORS = {
  liderazgo:   'bg-purple-100 text-purple-700',
  técnico:     'bg-blue-100 text-blue-700',
  'soft skills': 'bg-teal-100 text-teal-700',
  networking:  'bg-orange-100 text-orange-700',
  visibilidad: 'bg-pink-100 text-pink-700',
}

const BLANK_OBJ = {
  title: '', description: '', priority: 'medium', category: 'técnico',
  deadline: '', keyResults: [{ id: Date.now(), text: '', done: false }],
}

function ObjectiveCard({ obj, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(obj)

  const pct = obj.keyResults.length
    ? Math.round(obj.keyResults.filter(k => k.done).length / obj.keyResults.length * 100)
    : 0

  const priority = PRIORITIES.find(p => p.key === obj.priority)
  const category = CATEGORIES.find(c => c.key === obj.category)

  const toggleKR = (krId) => {
    onUpdate({ ...obj, keyResults: obj.keyResults.map(k => k.id === krId ? { ...k, done: !k.done } : k) })
  }

  const saveDraft = () => {
    onUpdate(draft)
    setEditing(false)
  }

  const addKR = () => setDraft(d => ({ ...d, keyResults: [...d.keyResults, { id: Date.now(), text: '', done: false }] }))
  const removeKR = (id) => setDraft(d => ({ ...d, keyResults: d.keyResults.filter(k => k.id !== id) }))
  const updateKRText = (id, text) => setDraft(d => ({ ...d, keyResults: d.keyResults.map(k => k.id === id ? { ...k, text } : k) }))

  if (editing) {
    return (
      <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-5 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Editar Objetivo</h3>
          <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>

        <input
          value={draft.title}
          onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
          placeholder="Título del objetivo"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <textarea
          value={draft.description}
          onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
          placeholder="Descripción (opcional)"
          rows={2}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Prioridad</label>
            <select
              value={draft.priority}
              onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Categoría</label>
            <select
              value={draft.category}
              onChange={e => setDraft(d => ({ ...d, category: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fecha límite</label>
            <input
              type="date"
              value={draft.deadline}
              onChange={e => setDraft(d => ({ ...d, deadline: e.target.value }))}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-2 block font-medium">Key Results</label>
          <div className="space-y-2">
            {draft.keyResults.map((kr, i) => (
              <div key={kr.id} className="flex items-center gap-2">
                <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                <input
                  value={kr.text}
                  onChange={e => updateKRText(kr.id, e.target.value)}
                  placeholder={`Key Result ${i + 1}`}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button onClick={() => removeKR(kr.id)} className="text-gray-300 hover:text-red-400 transition">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addKR}
            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <Plus size={13} /> Agregar Key Result
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
          <button onClick={saveDraft} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
            Guardar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 leading-tight">{obj.title || 'Sin título'}</h3>
            {obj.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{obj.description}</p>}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 text-gray-300 hover:text-indigo-500 transition rounded-lg hover:bg-indigo-50">
              <Edit3 size={14} />
            </button>
            <button onClick={onDelete} className="p-1.5 text-gray-300 hover:text-red-500 transition rounded-lg hover:bg-red-50">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {priority && (
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${priority.color}`}>
              {priority.label} prioridad
            </span>
          )}
          {category && (
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${CAT_COLORS[obj.category] || 'bg-gray-100 text-gray-600'}`}>
              {category.emoji} {category.label}
            </span>
          )}
          {obj.deadline && (
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center gap-1">
              <Calendar size={10} />
              {new Date(obj.deadline).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-600 w-8 text-right">{pct}%</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-400 hover:text-gray-600 transition"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">
          {obj.keyResults.filter(k => k.done).length}/{obj.keyResults.length} key results completados
        </p>
      </div>

      {/* Key Results */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-2 bg-gray-50/50 animate-fade-in">
          {obj.keyResults.map(kr => (
            <button
              key={kr.id}
              onClick={() => toggleKR(kr.id)}
              className="w-full flex items-start gap-3 text-left group"
            >
              {kr.done
                ? <CheckSquare size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                : <Square size={16} className="text-gray-300 group-hover:text-indigo-400 mt-0.5 shrink-0 transition" />
              }
              <span className={`text-sm leading-relaxed ${kr.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
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

  const updateObjective = (updated) => {
    setObjectives(prev => prev.map(o => o.id === updated.id ? updated : o))
  }

  const deleteObjective = (id) => {
    setObjectives(prev => prev.filter(o => o.id !== id))
  }

  const filtered = filter === 'all' ? objectives : objectives.filter(o => o.priority === filter || o.category === filter)

  return (
    <div className="p-8 max-w-3xl mx-auto animate-slide-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Objetivos OKR</h1>
          <p className="text-gray-500 mt-1">Define metas claras y medibles con key results</p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm"
        >
          <Plus size={16} /> Nuevo objetivo
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total', value: objectives.length, color: 'text-gray-900' },
          { label: 'En progreso', value: objectives.filter(o => { const p = o.keyResults.filter(k=>k.done).length; return p > 0 && p < o.keyResults.length }).length, color: 'text-indigo-600' },
          { label: 'Completados', value: objectives.filter(o => o.keyResults.length && o.keyResults.every(k=>k.done)).length, color: 'text-emerald-600' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl p-3 text-center border border-gray-100 shadow-sm">
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[{ k: 'all', l: 'Todos' }, ...PRIORITIES.map(p => ({ k: p.key, l: p.label })), ...CATEGORIES.map(c => ({ k: c.key, l: `${c.emoji} ${c.label}` }))].map(({ k, l }) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filter === k ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* New objective form */}
      {adding && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-5 mb-5 space-y-4 animate-slide-in">
          <h3 className="font-semibold text-indigo-800">Nuevo Objetivo</h3>
          <input
            value={newObj.title}
            onChange={e => setNewObj(n => ({ ...n, title: e.target.value }))}
            placeholder="¿Qué quieres lograr?"
            className="w-full border border-indigo-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />
          <div className="grid grid-cols-3 gap-3">
            <select value={newObj.priority} onChange={e => setNewObj(n => ({ ...n, priority: e.target.value }))}
              className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
              {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label} prioridad</option>)}
            </select>
            <select value={newObj.category} onChange={e => setNewObj(n => ({ ...n, category: e.target.value }))}
              className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
            </select>
            <input type="date" value={newObj.deadline} onChange={e => setNewObj(n => ({ ...n, deadline: e.target.value }))}
              className="border border-indigo-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-indigo-700 font-medium">Key Results</label>
            {newObj.keyResults.map((kr, i) => (
              <div key={kr.id} className="flex gap-2">
                <input
                  value={kr.text}
                  onChange={e => setNewObj(n => ({ ...n, keyResults: n.keyResults.map(k => k.id === kr.id ? { ...k, text: e.target.value } : k) }))}
                  placeholder={`Key Result ${i + 1}`}
                  className="flex-1 border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                />
                {newObj.keyResults.length > 1 && (
                  <button onClick={() => setNewObj(n => ({ ...n, keyResults: n.keyResults.filter(k => k.id !== kr.id) }))}
                    className="text-indigo-300 hover:text-red-400 transition"><X size={14} /></button>
                )}
              </div>
            ))}
            <button onClick={() => setNewObj(n => ({ ...n, keyResults: [...n.keyResults, { id: Date.now(), text: '', done: false }] }))}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
              <Plus size={13} /> Agregar Key Result
            </button>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setAdding(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
            <button onClick={addObjective} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-sm">
              Crear Objetivo
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Target size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Sin objetivos</p>
          <p className="text-sm">Crea tu primer OKR haciendo click en "Nuevo objetivo"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(obj => (
            <ObjectiveCard
              key={obj.id}
              obj={obj}
              onUpdate={updateObjective}
              onDelete={() => deleteObjective(obj.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
