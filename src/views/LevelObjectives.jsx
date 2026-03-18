import { useState } from 'react'
import { Plus, Edit3, Trash2, ChevronDown } from 'lucide-react'
import { useApp } from '../App'

const LEVEL_COLORS = { L1: '#c5d4f8', L2: '#496be3', L3: '#3851d8', L4: '#29317f' }
const AREA_OPTIONS = ['Técnico', 'Liderazgo', 'Colaboración', 'Visibilidad', 'Estrategia', 'Aprendizaje', 'Impacto']
const AREA_BADGE   = { 'Técnico': 'bg-h-50 text-h-700', 'Liderazgo': 'bg-p-50 text-p-700', 'Colaboración': 'bg-t-50 text-t-700', 'Visibilidad': 'bg-s-100 text-s-800', 'Estrategia': 'bg-y-50 text-y-700', 'Aprendizaje': 'bg-g-50 text-g-800', 'Impacto': 'bg-r-50 text-r-600' }
const ROLE_OPTIONS = [
  { group: 'Diseño',       roles: ['Junior Designer', 'Mid Designer', 'Senior Designer', 'Lead Designer', 'Head of Design'] },
  { group: 'Ingeniería',   roles: ['Junior Developer', 'Mid Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'] },
  { group: 'Producto',     roles: ['Junior PM', 'Product Manager', 'Senior PM', 'Head of Product', 'Chief Product Officer'] },
  { group: 'Datos',        roles: ['Data Analyst', 'Senior Analyst', 'Data Scientist', 'Data Lead', 'Head of Data'] },
  { group: 'Marketing',    roles: ['Growth Analyst', 'Growth Manager', 'Senior Growth', 'Head of Growth', 'CMO'] },
  { group: 'People',       roles: ['HR Analyst', 'HR Specialist', 'HR Business Partner', 'People Manager', 'Head of People'] },
]

export default function LevelObjectives() {
  const { levelObjectives, setLevelObjectives } = useApp()
  const [adding, setAdding]         = useState(null)
  const [draft, setDraft]           = useState({ area: 'Técnico', text: '' })
  const [editingObj, setEditingObj] = useState(null)
  const [editDraft, setEditDraft]   = useState({ area: 'Técnico', text: '' })
  const [trackOpen, setTrackOpen]   = useState(false)

  // Detecta el track activo comparando el primer rol del grupo con L1
  const activeTrack = ROLE_OPTIONS.find(g => g.roles[0] === levelObjectives[0]?.role)?.group || null

  const applyTrack = (group) => {
    const { roles } = ROLE_OPTIONS.find(g => g.group === group)
    setLevelObjectives(p => p.map((l, i) => ({ ...l, role: roles[i] ?? roles[roles.length - 1] })))
    setTrackOpen(false)
  }
  const clearTrack = () => {
    setLevelObjectives(p => p.map(l => ({ ...l, role: '' })))
    setTrackOpen(false)
  }
  const addObj = (level) => {
    if (!draft.text.trim()) return
    setLevelObjectives(p => p.map(l => l.level === level
      ? { ...l, objectives: [...l.objectives, { id: Date.now(), area: draft.area, text: draft.text.trim() }] }
      : l))
    setDraft({ area: 'Técnico', text: '' })
    setAdding(null)
  }
  const deleteObj = (level, id) => {
    setLevelObjectives(p => p.map(l => l.level === level
      ? { ...l, objectives: l.objectives.filter(o => o.id !== id) } : l))
  }
  const saveEdit = () => {
    if (!editDraft.text.trim() || !editingObj) return
    setLevelObjectives(p => p.map(l => l.level === editingObj.level
      ? { ...l, objectives: l.objectives.map(o => o.id === editingObj.id ? { ...o, ...editDraft } : o) }
      : l))
    setEditingObj(null)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Un solo desplegable de rol — fuera de las cajas ── */}
      <div className="bg-white rounded-2xl shadow-4dp p-5">
        <p className="text-[11px] font-semibold text-n-600 uppercase tracking-widest mb-3">Rol del framework</p>
        <div className="flex items-start gap-4">
          <div className="relative flex-1 max-w-xs">
            <button
              onClick={() => setTrackOpen(o => !o)}
              className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-[13px] transition-all ${activeTrack ? 'bg-h-50 border-h-200 text-h-800 font-semibold' : 'bg-n-50 border-n-200 text-n-600 hover:border-n-300'}`}
            >
              <span>{activeTrack ? `Área: ${activeTrack}` : 'Asignar rol…'}</span>
              <ChevronDown size={14} className={`shrink-0 transition-transform ${trackOpen ? 'rotate-180' : ''}`} />
            </button>

            {trackOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-8dp border border-n-200 z-30 overflow-hidden animate-fade-in">
                {activeTrack && (
                  <button onClick={clearTrack}
                    className="w-full px-4 py-2.5 text-left text-[12px] text-r-500 hover:bg-r-50 transition-colors border-b border-n-100">
                    × Quitar rol
                  </button>
                )}
                {ROLE_OPTIONS.map(g => (
                  <button key={g.group} onClick={() => applyTrack(g.group)}
                    className={`w-full px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-h-50 hover:text-h-800 ${activeTrack === g.group ? 'bg-h-50 text-h-700 font-semibold' : 'text-n-800'}`}>
                    {g.group}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview de roles asignados */}
          {activeTrack && (
            <div className="flex items-center gap-2 flex-wrap">
              {levelObjectives.map(lvl => (
                <div key={lvl.level} className="flex items-center gap-1.5 bg-n-50 border border-n-200 px-2.5 py-1 rounded-lg">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                    style={{ backgroundColor: LEVEL_COLORS[lvl.level] }}>{lvl.level}</span>
                  <span className="text-[11px] text-n-800 font-medium">{lvl.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Level objective cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {levelObjectives.map(lvl => (
          <div key={lvl.level} className="bg-white rounded-2xl shadow-4dp overflow-hidden flex flex-col"
            style={{ borderTop: `3px solid ${LEVEL_COLORS[lvl.level]}` }}>

            {/* Card header */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-n-100">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                style={{ backgroundColor: LEVEL_COLORS[lvl.level] }}>{lvl.level}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-n-950">{lvl.title}</p>
                <p className="text-[10px] text-n-600">{lvl.objectives.length} objetivos</p>
              </div>
              <button onClick={() => { setAdding(lvl.level); setDraft({ area: 'Técnico', text: '' }) }}
                className="w-6 h-6 rounded-lg bg-n-100 hover:bg-h-100 text-n-600 hover:text-h-600 flex items-center justify-center transition">
                <Plus size={12} />
              </button>
            </div>

            {/* Objectives list */}
            <div className="flex-1 p-3 flex flex-col gap-2">
              {lvl.objectives.length === 0 && (
                <p className="text-[11px] text-n-400 italic text-center py-3">Sin objetivos aún</p>
              )}
              {lvl.objectives.map(obj => (
                <div key={obj.id}>
                  {editingObj?.id === obj.id && editingObj?.level === lvl.level ? (
                    <div className="bg-h-50 border border-h-100 rounded-lg p-2 flex flex-col gap-1.5">
                      <select value={editDraft.area} onChange={e => setEditDraft(d => ({ ...d, area: e.target.value }))}
                        className="input-humand text-xs" style={{ height: 28 }}>
                        {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <textarea value={editDraft.text} onChange={e => setEditDraft(d => ({ ...d, text: e.target.value }))}
                        rows={2} className="textarea-humand text-xs" style={{ minHeight: 52 }} />
                      <div className="flex gap-1.5 justify-end">
                        <button onClick={() => setEditingObj(null)} className="text-[11px] text-n-600 hover:text-n-950">Cancelar</button>
                        <button onClick={saveEdit} className="h-6 px-2 bg-h-500 text-white rounded text-[11px] font-semibold hover:bg-h-600 transition">OK</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-2 rounded-lg border border-n-100 hover:border-n-200 group transition-colors">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 mt-0.5 ${AREA_BADGE[obj.area] || 'bg-n-100 text-n-700'}`}>{obj.area}</span>
                      <p className="flex-1 text-[12px] text-n-800 leading-relaxed">{obj.text}</p>
                      <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                        <button onClick={() => { setEditingObj({ level: lvl.level, id: obj.id }); setEditDraft({ area: obj.area, text: obj.text }) }}
                          className="p-0.5 text-n-400 hover:text-h-600 transition"><Edit3 size={11} /></button>
                        <button onClick={() => deleteObj(lvl.level, obj.id)}
                          className="p-0.5 text-n-400 hover:text-r-600 transition"><Trash2 size={11} /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {adding === lvl.level && (
                <div className="bg-h-50 border border-h-100 rounded-lg p-2 flex flex-col gap-1.5 animate-slide-in">
                  <select value={draft.area} onChange={e => setDraft(d => ({ ...d, area: e.target.value }))}
                    className="input-humand text-xs" style={{ height: 28 }}>
                    {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <textarea value={draft.text} onChange={e => setDraft(d => ({ ...d, text: e.target.value }))}
                    placeholder="Describí el objetivo esperado para este nivel..."
                    rows={2} className="textarea-humand text-xs" style={{ minHeight: 52 }} />
                  <div className="flex gap-1.5 justify-end">
                    <button onClick={() => setAdding(null)} className="text-[11px] text-n-600 hover:text-n-950">Cancelar</button>
                    <button onClick={() => addObj(lvl.level)} className="h-6 px-2 bg-h-500 text-white rounded text-[11px] font-semibold hover:bg-h-600 transition">Agregar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
