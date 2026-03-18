import { useState } from 'react'
import { Target, Plus, Trash2, Calendar, ChevronDown, ChevronUp, Edit3, X } from 'lucide-react'
import { useApp } from '../App'

const PRIORITIES = [
  { key: 'high',   label: 'Alta',  badge: 'bg-r-100 text-r-600' },
  { key: 'medium', label: 'Media', badge: 'bg-y-100 text-y-700' },
  { key: 'low',    label: 'Baja',  badge: 'bg-g-100 text-g-800' },
]
const CATEGORIES = [
  { key: 'liderazgo',   label: 'Liderazgo',   emoji: '🎯', badge: 'bg-p-100 text-p-800' },
  { key: 'técnico',     label: 'Técnico',     emoji: '💻', badge: 'bg-h-100 text-h-800' },
  { key: 'soft skills', label: 'Soft Skills', emoji: '🤝', badge: 'bg-t-100 text-t-800' },
  { key: 'networking',  label: 'Networking',  emoji: '🌐', badge: 'bg-y-100 text-y-700' },
  { key: 'visibilidad', label: 'Visibilidad', emoji: '✨', badge: 'bg-s-100 text-s-800' },
]
const BLANK_OBJ = {
  title: '', description: '', priority: 'medium', category: 'técnico',
  deadline: '', keyResults: [{ id: Date.now(), text: '', done: false }],
}

function ObjectiveCard({ obj, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing]   = useState(false)
  const [draft, setDraft]       = useState(obj)

  const pct      = obj.keyResults.length ? Math.round(obj.keyResults.filter(k => k.done).length / obj.keyResults.length * 100) : 0
  const priority = PRIORITIES.find(p => p.key === obj.priority)
  const category = CATEGORIES.find(c => c.key === obj.category)

  const toggleKR     = (krId)     => onUpdate({ ...obj, keyResults: obj.keyResults.map(k => k.id === krId ? { ...k, done: !k.done } : k) })
  const saveDraft    = ()         => { onUpdate(draft); setEditing(false) }
  const addKR        = ()         => setDraft(d => ({ ...d, keyResults: [...d.keyResults, { id: Date.now(), text: '', done: false }] }))
  const removeKR     = (id)       => setDraft(d => ({ ...d, keyResults: d.keyResults.filter(k => k.id !== id) }))
  const updateKRText = (id, text) => setDraft(d => ({ ...d, keyResults: d.keyResults.map(k => k.id === id ? { ...k, text } : k) }))

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-8dp border-2 border-h-300 p-5 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-n-950">Editar Objetivo</h3>
          <button onClick={() => setEditing(false)} className="text-n-600 hover:text-n-950 transition"><X size={16} /></button>
        </div>
        <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="Título" className="input-humand" />
        <textarea value={draft.description} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="Descripción" rows={2} className="textarea-humand" />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Prioridad</label>
            <select value={draft.priority} onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))} className="input-humand">
              {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Categoría</label>
            <select value={draft.category} onChange={e => setDraft(d => ({ ...d, category: e.target.value }))} className="input-humand">
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Fecha límite</label>
            <input type="date" value={draft.deadline} onChange={e => setDraft(d => ({ ...d, deadline: e.target.value }))} className="input-humand" />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-2 block">Key Results</label>
          <div className="space-y-2">
            {draft.keyResults.map((kr, i) => (
              <div key={kr.id} className="flex items-center gap-2">
                <span className="text-xs text-n-600 w-5">{i + 1}.</span>
                <input value={kr.text} onChange={e => updateKRText(kr.id, e.target.value)} placeholder={`Key Result ${i + 1}`} className="input-humand flex-1" />
                <button onClick={() => removeKR(kr.id)} className="text-n-400 hover:text-r-600 transition"><X size={14} /></button>
              </div>
            ))}
          </div>
          <button onClick={addKR} className="mt-2 text-[12px] font-semibold text-h-500 hover:text-h-600 flex items-center gap-1">
            <Plus size={12} /> Agregar Key Result
          </button>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-n-100">
          <button onClick={() => setEditing(false)} className="h-9 px-4 text-[13px] font-semibold text-n-800 hover:text-n-950 rounded-lg hover:bg-n-100 transition">Cancelar</button>
          <button onClick={saveDraft} className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition">Guardar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-4dp hover:shadow-8dp transition-shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-semibold text-n-950 leading-tight">{obj.title || 'Sin título'}</h3>
            {obj.description && <p className="text-xs text-n-800 mt-0.5 line-clamp-1">{obj.description}</p>}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <button onClick={() => setEditing(true)} className="p-1.5 text-n-600 hover:text-h-600 hover:bg-h-50 transition rounded-lg"><Edit3 size={13} /></button>
            <button onClick={onDelete}              className="p-1.5 text-n-600 hover:text-r-600 hover:bg-r-50 transition rounded-lg"><Trash2 size={13} /></button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {priority && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${priority.badge}`}>{priority.label} prioridad</span>}
          {category && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${category.badge}`}>{category.emoji} {category.label}</span>}
          {obj.deadline && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-n-100 text-n-800 flex items-center gap-1">
              <Calendar size={9} />{new Date(obj.deadline).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-n-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full bar-fill ${pct === 100 ? 'bg-g-600' : 'bg-h-500'}`} style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-semibold text-n-800 w-8 text-right">{pct}%</span>
          <button onClick={() => setExpanded(!expanded)} className="p-1 text-n-500 hover:text-n-950 transition">
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
        <p className="text-[10px] text-n-600 mt-1">{obj.keyResults.filter(k => k.done).length}/{obj.keyResults.length} key results completados</p>
      </div>
      {expanded && (
        <div className="border-t border-n-100 px-5 py-4 space-y-2 bg-n-50 animate-fade-in">
          {obj.keyResults.map(kr => (
            <button key={kr.id} onClick={() => toggleKR(kr.id)} className="w-full flex items-start gap-3 text-left group">
              <div className={`mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${
                kr.done ? 'bg-h-500 border-h-500 text-white' : 'border-n-300 group-hover:border-h-400'
              }`}>
                {kr.done && <span className="text-[9px]">✓</span>}
              </div>
              <span className={`text-[13px] leading-relaxed ${kr.done ? 'line-through text-n-500' : 'text-n-950'}`}>
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

  const totalDone = objectives.filter(o => o.keyResults.length && o.keyResults.every(k => k.done)).length
  const inProgress = objectives.filter(o => { const p = o.keyResults.filter(k => k.done).length; return p > 0 && p < o.keyResults.length }).length

  return (
    <div className="p-8 max-w-3xl mx-auto animate-slide-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-n-950">Objetivos OKR</h1>
          <p className="text-sm text-n-800 mt-1">Define metas claras y medibles con key results</p>
        </div>
        <button onClick={() => setAdding(!adding)}
          className="inline-flex items-center gap-1.5 h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors shadow-4dp">
          <Plus size={15} /> Nuevo objetivo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total',        value: objectives.length, bg: 'bg-n-50',  text: 'text-n-950' },
          { label: 'En progreso',  value: inProgress,        bg: 'bg-h-50',  text: 'text-h-600' },
          { label: 'Completados',  value: totalDone,          bg: 'bg-g-50',  text: 'text-g-800' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center shadow-4dp`}>
            <p className={`text-2xl font-semibold ${stat.text}`}>{stat.value}</p>
            <p className="text-xs text-n-800 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[['all', 'Todos'], ...PRIORITIES.map(p => [p.key, p.label]), ...CATEGORIES.map(c => [c.key, `${c.emoji} ${c.label}`])].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`h-7 px-3 rounded-full text-[12px] font-semibold border transition-all ${
              filter === k ? 'bg-h-50 text-h-600 border-h-200' : 'bg-n-100 text-n-800 border-transparent hover:border-n-300'
            }`}>
            {l}
          </button>
        ))}
      </div>

      {/* New form */}
      {adding && (
        <div className="bg-h-50 border-2 border-h-200 rounded-2xl p-5 mb-5 space-y-4 animate-slide-in">
          <h3 className="text-sm font-semibold text-h-800">Nuevo Objetivo</h3>
          <input value={newObj.title} onChange={e => setNewObj(n => ({ ...n, title: e.target.value }))} placeholder="¿Qué querés lograr?" className="input-humand" />
          <textarea value={newObj.description} onChange={e => setNewObj(n => ({ ...n, description: e.target.value }))} placeholder="Descripción (opcional)" rows={2} className="textarea-humand" />
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Prioridad</label>
              <select value={newObj.priority} onChange={e => setNewObj(n => ({ ...n, priority: e.target.value }))} className="input-humand">
                {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Categoría</label>
              <select value={newObj.category} onChange={e => setNewObj(n => ({ ...n, category: e.target.value }))} className="input-humand">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-1 block">Fecha límite</label>
              <input type="date" value={newObj.deadline} onChange={e => setNewObj(n => ({ ...n, deadline: e.target.value }))} className="input-humand" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-n-800 uppercase tracking-wide mb-2 block">Key Results</label>
            <div className="space-y-2">
              {newObj.keyResults.map((kr, i) => (
                <div key={kr.id} className="flex gap-2">
                  <input value={kr.text}
                    onChange={e => setNewObj(n => ({ ...n, keyResults: n.keyResults.map(k => k.id === kr.id ? { ...k, text: e.target.value } : k) }))}
                    placeholder={`Key Result ${i + 1}`} className="input-humand flex-1" />
                  {newObj.keyResults.length > 1 && (
                    <button onClick={() => setNewObj(n => ({ ...n, keyResults: n.keyResults.filter(k => k.id !== kr.id) }))} className="text-n-400 hover:text-r-600 transition">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => setNewObj(n => ({ ...n, keyResults: [...n.keyResults, { id: Date.now(), text: '', done: false }] }))}
              className="mt-2 text-[12px] font-semibold text-h-500 hover:text-h-600 flex items-center gap-1">
              <Plus size={12} /> Agregar Key Result
            </button>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-h-100">
            <button onClick={() => setAdding(false)} className="h-9 px-4 text-[13px] font-semibold text-n-800 hover:text-n-950 rounded-lg hover:bg-n-100 transition">Cancelar</button>
            <button onClick={addObjective} className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition shadow-4dp">Crear Objetivo</button>
          </div>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-n-600">
          <Target size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold text-n-800">Sin objetivos</p>
          <p className="text-sm mt-1">Creá tu primer OKR haciendo click en "Nuevo objetivo"</p>
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
