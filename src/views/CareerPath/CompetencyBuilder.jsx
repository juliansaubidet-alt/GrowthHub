import { useState } from 'react'
import { X, Plus, Trash2, Edit3 } from 'lucide-react'
import { useApp } from '../../App'

const CAT_OPTIONS = ['Técnico', 'Liderazgo', 'Soft Skills', 'Estrategia', 'Otro']
const CAT_COLORS  = { 'Técnico': 'bg-h-50 text-h-800', 'Liderazgo': 'bg-p-50 text-p-800', 'Soft Skills': 'bg-t-50 text-t-800', 'Estrategia': 'bg-y-50 text-y-700', 'Otro': 'bg-n-100 text-n-800' }

export default function CompetencyBuilder({ naked = false }) {
  const { competencies, setCompetencies } = useApp()
  const [selected, setSelected]   = useState(competencies[0]?.id ?? null)
  const [editingComp, setEditingComp] = useState(null)
  const [compDraft, setCompDraft] = useState({ name: '', category: 'Técnico', description: '' })
  const [newSkillText, setNewSkillText] = useState('')
  const [editingSkill, setEditingSkill] = useState(null)
  const [skillDraft, setSkillDraft]     = useState({ name: '', description: '' })

  const selComp = competencies.find(c => c.id === selected)

  const saveComp = () => {
    if (!compDraft.name.trim()) return
    if (editingComp === 'new') {
      const next = { ...compDraft, id: Date.now(), skills: [] }
      setCompetencies(p => [...p, next])
      setSelected(next.id)
    } else {
      setCompetencies(p => p.map(c => c.id === editingComp ? { ...c, ...compDraft } : c))
    }
    setEditingComp(null)
  }
  const deleteComp = (id) => {
    setCompetencies(p => p.filter(c => c.id !== id))
    if (selected === id) setSelected(competencies.find(c => c.id !== id)?.id ?? null)
  }
  const startNewComp = () => { setCompDraft({ name: '', category: 'Técnico', description: '' }); setEditingComp('new') }
  const startEditComp = (c) => { setCompDraft({ name: c.name, category: c.category, description: c.description }); setEditingComp(c.id) }

  const addSkill = (compId) => {
    if (!newSkillText.trim()) return
    setCompetencies(p => p.map(c => c.id === compId
      ? { ...c, skills: [...c.skills, { id: Date.now(), name: newSkillText.trim(), description: '' }] }
      : c))
    setNewSkillText('')
  }
  const deleteSkill = (compId, skillId) => {
    setCompetencies(p => p.map(c => c.id === compId ? { ...c, skills: c.skills.filter(s => s.id !== skillId) } : c))
  }
  const saveSkill = () => {
    if (!skillDraft.name.trim() || !editingSkill) return
    setCompetencies(p => p.map(c => c.id === editingSkill.compId
      ? { ...c, skills: c.skills.map(s => s.id === editingSkill.skillId ? { ...s, ...skillDraft } : s) }
      : c))
    setEditingSkill(null)
  }

  return (
    <div className="flex gap-5">
      {/* LEFT: list */}
      <div style={{ width: 240 }} className="shrink-0">
        <div className={naked ? '' : 'bg-white rounded-2xl shadow-4dp overflow-hidden'}>
          <div className={`flex items-center justify-between ${naked ? 'mb-2' : 'px-4 py-3.5 border-b border-n-100'}`}>
            <span className="text-[13px] font-semibold text-n-950">Competencias</span>
            <button onClick={startNewComp} className="h-7 px-2.5 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1">
              <Plus size={11} /> Nueva
            </button>
          </div>
          <div className={`flex flex-col gap-0.5 ${naked ? '' : 'p-2'}`}>
            {competencies.map(c => (
              <div key={c.id} onClick={() => setSelected(c.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors group ${selected === c.id ? 'bg-h-50' : 'hover:bg-n-50'}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-n-950 truncate">{c.name}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0 rounded-full ${CAT_COLORS[c.category] || 'bg-n-100 text-n-800'}`}>{c.category}</span>
                </div>
                <span className="text-[10px] text-n-500 shrink-0">{c.skills.length} skills</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: detail / editor */}
      <div className="flex-1 min-w-0 flex flex-col gap-4">
        {editingComp && (
          <div className="bg-h-50 border-2 border-h-200 rounded-2xl p-5 animate-slide-in">
            <p className="text-[13px] font-semibold text-h-800 mb-3">{editingComp === 'new' ? 'Nueva Competencia' : 'Editar Competencia'}</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] font-semibold text-n-700 uppercase tracking-wide mb-1 block">Nombre *</label>
                <input value={compDraft.name} onChange={e => setCompDraft(d => ({ ...d, name: e.target.value }))} placeholder="Ej: Diseño Visual" className="input-humand" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-n-700 uppercase tracking-wide mb-1 block">Categoría</label>
                <select value={compDraft.category} onChange={e => setCompDraft(d => ({ ...d, category: e.target.value }))} className="input-humand">
                  {CAT_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-semibold text-n-700 uppercase tracking-wide mb-1 block">Descripción</label>
                <input value={compDraft.description} onChange={e => setCompDraft(d => ({ ...d, description: e.target.value }))} placeholder="Descripción breve..." className="input-humand" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingComp(null)} className="h-8 px-3 text-[12px] font-semibold text-n-800 hover:text-n-950 rounded-lg hover:bg-n-100 transition">Cancelar</button>
              <button onClick={saveComp} className="h-8 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition">Guardar</button>
            </div>
          </div>
        )}

        {selComp && !editingComp && (
          <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
            <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-semibold text-n-950">{selComp.name}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CAT_COLORS[selComp.category] || 'bg-n-100 text-n-800'}`}>{selComp.category}</span>
                </div>
                {selComp.description && <p className="text-[11px] text-n-600 mt-0.5">{selComp.description}</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEditComp(selComp)} className="p-1.5 text-n-500 hover:text-h-600 hover:bg-h-50 rounded-lg transition"><Edit3 size={14} /></button>
                <button onClick={() => deleteComp(selComp.id)} className="p-1.5 text-n-500 hover:text-r-600 hover:bg-r-50 rounded-lg transition"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className="p-5">
              <p className="text-[10px] font-semibold text-n-600 uppercase tracking-widest mb-3">Habilidades ({selComp.skills.length})</p>
              <div className="flex flex-col gap-2 mb-4">
                {selComp.skills.length === 0 && <p className="text-xs text-n-500 italic">Sin habilidades aún. Agregá la primera abajo.</p>}
                {selComp.skills.map(sk => (
                  <div key={sk.id}>
                    {editingSkill?.skillId === sk.id ? (
                      <div className="flex gap-2 items-center bg-n-50 p-2 rounded-lg">
                        <input value={skillDraft.name} onChange={e => setSkillDraft(d => ({ ...d, name: e.target.value }))} className="input-humand flex-1" style={{ height: 32 }} />
                        <input value={skillDraft.description} onChange={e => setSkillDraft(d => ({ ...d, description: e.target.value }))} placeholder="Descripción" className="input-humand flex-1" style={{ height: 32 }} />
                        <button onClick={saveSkill} className="h-8 px-3 bg-h-500 text-white rounded-lg text-[12px] font-semibold hover:bg-h-600 transition shrink-0">OK</button>
                        <button onClick={() => setEditingSkill(null)} className="text-n-500 hover:text-n-950"><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-n-100 hover:border-n-200 group transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-h-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-n-950">{sk.name}</p>
                          {sk.description && <p className="text-[11px] text-n-600">{sk.description}</p>}
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingSkill({ compId: selComp.id, skillId: sk.id }); setSkillDraft({ name: sk.name, description: sk.description }) }}
                            className="p-1 text-n-500 hover:text-h-600 rounded transition"><Edit3 size={12} /></button>
                          <button onClick={() => deleteSkill(selComp.id, sk.id)}
                            className="p-1 text-n-500 hover:text-r-600 rounded transition"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newSkillText} onChange={e => setNewSkillText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill(selComp.id)}
                  placeholder="Nombre de nueva habilidad..." className="input-humand flex-1" style={{ height: 36 }} />
                <button onClick={() => addSkill(selComp.id)}
                  className="h-9 px-3 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[12px] font-semibold transition flex items-center gap-1">
                  <Plus size={13} /> Agregar
                </button>
              </div>
            </div>
          </div>
        )}

        {!selComp && !editingComp && (
          <div className="bg-white rounded-2xl shadow-4dp flex items-center justify-center py-16 text-n-500">
            <p className="text-sm">Seleccioná una competencia o creá una nueva</p>
          </div>
        )}
      </div>
    </div>
  )
}
