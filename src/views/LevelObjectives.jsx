import { useState } from 'react'
import { Plus, Edit3, Trash2, ChevronDown, X } from 'lucide-react'
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
  const [roleOpen, setRoleOpen]     = useState(null)

  const setRole = (level, role) => {
    setLevelObjectives(p => p.map(l => l.level === level ? { ...l, role } : l))
    setRoleOpen(null)
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
    setLevelObjectives(p => p.map(l => l.level === level ? { ...l, objectives: l.objectives.filter(o => o.id !== id) } : l))
  }
  const saveEdit = () => {
    if (!editDraft.text.trim() || !editingObj) return
    setLevelObjectives(p => p.map(l => l.level === editingObj.level
      ? { ...l, objectives: l.objectives.map(o => o.id === editingObj.id ? { ...o, ...editDraft } : o) }
      : l))
    setEditingObj(null)
  }

  const totalObjs = levelObjectives.reduce((a, l) => a + l.objectives.length, 0)
  const rolesSet  = levelObjectives.filter(l => l.role).length

  return (
    <div className="p-8 max-w-6xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-n-950">Objetivos por Nivel</h1>
          <p className="text-[13px] text-n-600 mt-0.5">Definí los objetivos esperables y el rol asociado a cada nivel de carrera</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-xl font-bold text-h-600">{totalObjs}</p>
            <p className="text-[10px] text-n-500">objetivos</p>
          </div>
          <div className="w-px h-8 bg-n-200" />
          <div className="text-center">
            <p className="text-xl font-bold text-p-700">{rolesSet}/4</p>
            <p className="text-[10px] text-n-500">roles asignados</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {levelObjectives.map(lvl => (
          <div key={lvl.level} className="bg-white rounded-2xl shadow-4dp overflow-hidden flex flex-col">

            {/* Level header */}
            <div className="border-b border-n-100" style={{ borderTop: `3px solid ${LEVEL_COLORS[lvl.level]}` }}>
              <div className="px-4 py-3 flex items-center gap-2">
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

              {/* Role dropdown */}
              <div className="px-4 pb-3 relative">
                <button
                  onClick={() => setRoleOpen(o => o === lvl.level ? null : lvl.level)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border text-[11px] transition-all ${lvl.role ? 'bg-h-50 border-h-200 text-h-800 font-semibold' : 'bg-n-50 border-n-200 text-n-500 hover:border-n-300'}`}
                >
                  <span className="truncate">{lvl.role || 'Asignar rol…'}</span>
                  <ChevronDown size={12} className={`shrink-0 transition-transform ${roleOpen === lvl.level ? 'rotate-180' : ''}`} />
                </button>

                {roleOpen === lvl.level && (
                  <div className="absolute left-4 right-4 top-full mt-1 bg-white rounded-xl shadow-8dp border border-n-200 z-20 max-h-60 overflow-y-auto animate-fade-in">
                    {lvl.role && (
                      <button onClick={() => setRole(lvl.level, '')}
                        className="w-full px-3 py-2 text-left text-[11px] text-r-500 hover:bg-r-50 transition-colors border-b border-n-100">
                        × Quitar rol
                      </button>
                    )}
                    {ROLE_OPTIONS.map(group => (
                      <div key={group.group}>
                        <p className="px-3 py-1.5 text-[9px] font-bold text-n-500 uppercase tracking-widest bg-n-50 sticky top-0">{group.group}</p>
                        {group.roles.map(r => (
                          <button key={r} onClick={() => setRole(lvl.level, r)}
                            className={`w-full px-3 py-2 text-left text-[12px] transition-colors hover:bg-h-50 hover:text-h-800 ${lvl.role === r ? 'bg-h-50 text-h-700 font-semibold' : 'text-n-800'}`}>
                            {r}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                      <select value={editDraft.area} onChange={e => setEditDraft(d => ({ ...d, area: e.target.value }))} className="input-humand text-xs" style={{ height: 28 }}>
                        {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <textarea value={editDraft.text} onChange={e => setEditDraft(d => ({ ...d, text: e.target.value }))} rows={2} className="textarea-humand text-xs" style={{ minHeight: 52 }} />
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
                  <select value={draft.area} onChange={e => setDraft(d => ({ ...d, area: e.target.value }))} className="input-humand text-xs" style={{ height: 28 }}>
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
