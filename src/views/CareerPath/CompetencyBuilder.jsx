import { useState, useEffect } from 'react'
import { X, Plus, Trash2, Edit3 } from 'lucide-react'
import { useApp } from '../../App'
import { competenciesApi } from '../../api/competencies'

const CAT_OPTIONS = ['Técnico', 'Liderazgo', 'Soft Skills', 'Estrategia', 'Otro']
const CAT_COLORS  = { 'Técnico': 'bg-h-50 text-h-800', 'Liderazgo': 'bg-p-50 text-p-800', 'Soft Skills': 'bg-t-50 text-t-800', 'Estrategia': 'bg-y-50 text-y-700', 'Otro': 'bg-n-100 text-n-800' }

/* Normalize MongoDB _id → id for competencies and nested skills */
function normalize(comp) {
  return {
    ...comp,
    id: comp._id || comp.id,
    skills: (comp.skills || []).map(sk => ({
      ...sk,
      id: sk._id || sk.id,
    })),
  }
}

async function refetch(setCompetencies) {
  const data = await competenciesApi.getAll()
  setCompetencies(data.map(normalize))
}

// Map department/area to relevant competency categories
const AREA_COMPETENCY_MAP = {
  'DESIGN':      ['Técnico', 'Liderazgo', 'Soft Skills'],
  'ENGINEERING':  ['Técnico', 'Liderazgo', 'Soft Skills'],
  'PRODUCT':     ['Estrategia', 'Liderazgo', 'Soft Skills'],
  'MARKETING':   ['Estrategia', 'Liderazgo', 'Soft Skills'],
  'PEOPLE':      ['Liderazgo', 'Soft Skills', 'Estrategia'],
  'SALES':       ['Liderazgo', 'Soft Skills', 'Estrategia'],
}

// Map department to specific competency names for more precise filtering
const AREA_COMPETENCY_NAMES = {
  'DESIGN':      ['Diseño Visual', 'Gestión de Stakeholders', 'Colaboración', 'Liderazgo de Equipos'],
  'ENGINEERING':  ['Desarrollo Frontend', 'Desarrollo Backend', 'Arquitectura de Software', 'Colaboración', 'Liderazgo de Equipos'],
  'PRODUCT':     ['Gestión de Producto', 'Gestión de Stakeholders', 'Colaboración', 'Liderazgo de Equipos'],
  'MARKETING':   ['Growth Marketing', 'Gestión de Stakeholders', 'Colaboración', 'Liderazgo de Equipos'],
  'PEOPLE':      ['Gestión de Talento', 'Colaboración', 'Liderazgo de Equipos'],
  'SALES':       ['Gestión de Stakeholders', 'Colaboración', 'Liderazgo de Equipos'],
}

export default function CompetencyBuilder({ naked = false, filterArea }) {
  const { competencies, setCompetencies } = useApp()
  const [selected, setSelected]   = useState(null)

  // Filter competencies by area if provided
  const filteredCompetencies = filterArea && AREA_COMPETENCY_NAMES[filterArea]
    ? competencies.filter(c => AREA_COMPETENCY_NAMES[filterArea].includes(c.name))
    : competencies

  // Auto-select first competency when data loads or filter changes
  useEffect(() => {
    if (filteredCompetencies.length > 0) {
      const currentStillValid = filteredCompetencies.find(c => (c._id || c.id) === selected)
      if (!currentStillValid) {
        setSelected(filteredCompetencies[0]._id || filteredCompetencies[0].id)
      }
    }
  }, [filteredCompetencies, filterArea])
  const [editingComp, setEditingComp] = useState(null)
  const [compDraft, setCompDraft] = useState({ name: '', category: 'Técnico', description: '' })
  const [newSkillText, setNewSkillText] = useState('')
  const [editingSkill, setEditingSkill] = useState(null)
  const [skillDraft, setSkillDraft]     = useState({ name: '', description: '' })

  const selComp = filteredCompetencies.find(c => (c._id || c.id) === selected)

  const saveComp = async () => {
    if (!compDraft.name.trim()) return
    if (editingComp === 'new') {
      try {
        const created = await competenciesApi.create(compDraft)
        await refetch(setCompetencies)
        const normalized = normalize(created)
        setSelected(normalized.id)
      } catch (err) {
        console.error('Error creating competency:', err)
      }
    } else {
      try {
        await competenciesApi.update(editingComp, compDraft)
        await refetch(setCompetencies)
      } catch (err) {
        console.error('Error updating competency:', err)
      }
    }
    setEditingComp(null)
  }
  const deleteComp = async (id) => {
    try {
      await competenciesApi.remove(id)
      await refetch(setCompetencies)
    } catch (err) {
      console.error('Error deleting competency:', err)
    }
    if (selected === id) {
      const next = filteredCompetencies.find(c => (c._id || c.id) !== id)
      setSelected(next?._id || next?.id || null)
    }
  }
  const startNewComp = () => { setCompDraft({ name: '', category: 'Técnico', description: '' }); setEditingComp('new') }
  const startEditComp = (c) => { setCompDraft({ name: c.name, category: c.category, description: c.description }); setEditingComp(c.id) }

  const addSkill = async (compId) => {
    if (!newSkillText.trim()) return
    try {
      await competenciesApi.addSkill(compId, { name: newSkillText.trim(), description: '' })
      await refetch(setCompetencies)
    } catch (err) {
      console.error('Error adding skill:', err)
    }
    setNewSkillText('')
  }
  const deleteSkill = async (compId, skillId) => {
    try {
      await competenciesApi.removeSkill(compId, skillId)
      await refetch(setCompetencies)
    } catch (err) {
      console.error('Error deleting skill:', err)
    }
  }
  const saveSkill = async () => {
    if (!skillDraft.name.trim() || !editingSkill) return
    try {
      await competenciesApi.updateSkill(editingSkill.compId, editingSkill.skillId, skillDraft)
      await refetch(setCompetencies)
    } catch (err) {
      console.error('Error updating skill:', err)
    }
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
            {filteredCompetencies.map(c => (
              <div key={c._id || c.id} onClick={() => setSelected(c._id || c.id)}
                className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors group ${selected === (c._id || c.id) ? 'bg-h-50' : 'hover:bg-n-50'}`}>
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
                {selComp.skills.map((sk, skIdx) => {
                  const skId = sk._id || sk.id || `sk-${skIdx}`
                  return (
                  <div key={skId}>
                    {editingSkill?.skillId === skId ? (
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
                          <button onClick={() => { setEditingSkill({ compId: selComp._id || selComp.id, skillId: skId }); setSkillDraft({ name: sk.name, description: sk.description || '' }) }}
                            className="p-1 text-n-500 hover:text-h-600 rounded transition"><Edit3 size={12} /></button>
                          <button onClick={() => deleteSkill(selComp._id || selComp.id, skId)}
                            className="p-1 text-n-500 hover:text-r-600 rounded transition"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    )}
                  </div>
                  )})}
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
