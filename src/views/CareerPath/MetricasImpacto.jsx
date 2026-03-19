import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

const MONTHLY_ADOPTION = [
  { month: 'Oct', pct: 38 }, { month: 'Nov', pct: 45 }, { month: 'Dic', pct: 52 },
  { month: 'Ene', pct: 58 }, { month: 'Feb', pct: 65 }, { month: 'Mar', pct: 72 },
]

const NPS_BY_TEAM = [
  { team: 'Product Design',       nps: 71, responses: 9  },
  { team: 'Frontend Engineering', nps: 58, responses: 12 },
  { team: 'Backend Engineering',  nps: 42, responses: 10 },
  { team: 'Data & Analytics',     nps: 65, responses: 8  },
  { team: 'People & Culture',     nps: 80, responses: 5  },
  { team: 'Growth Marketing',     nps: 38, responses: 4  },
]

export default function MetricasImpacto() {
  const NPS = 62
  const npsColor = NPS >= 50 ? 'text-g-700' : NPS >= 30 ? 'text-y-600' : 'text-r-600'
  const [showNPSDetail, setShowNPSDetail] = useState(false)
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '% con plan activo',    value: '72%',  sub: '+14% vs inicio año',     color: 'text-h-600' },
          { label: 'NPS del módulo',        value: NPS,    sub: 'Basado en 48 respuestas', color: npsColor    },
          { label: 'Retención (con plan)',  value: '91%',  sub: 'vs 74% sin plan',         color: 'text-g-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[12px] font-semibold text-n-950 mt-1">{s.label}</p>
            <p className="text-[11px] text-n-600">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl shadow-4dp p-5">
          <p className="text-[13px] font-semibold text-n-950 mb-1">Adopción — últimos 6 meses</p>
          <p className="text-[11px] text-n-600 mb-4">% de empleados con plan activo</p>
          <div className="flex items-end gap-2 h-32">
            {MONTHLY_ADOPTION.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-semibold text-h-600">{m.pct}%</span>
                <div className="w-full bg-h-500 rounded-t-md" style={{ height: `${(m.pct / 100) * 96}px`, opacity: 0.55 + (m.pct / 250) }} />
                <span className="text-[10px] text-n-500">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-4dp p-5">
          <p className="text-[13px] font-semibold text-n-950 mb-1">NPS del módulo Career Path</p>
          <p className="text-[11px] text-n-600 mb-3">¿Recomendarías usar esta herramienta?</p>
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <p className={`text-5xl font-bold ${npsColor}`}>{NPS}</p>
              <p className="text-[12px] text-n-600 mt-1">NPS Score</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Promotores (9-10)',  pct: 68, color: 'bg-g-400'  },
              { label: 'Neutrales (7-8)',     pct: 26, color: 'bg-y-400'  },
              { label: 'Detractores (0-6)',   pct:  6, color: 'bg-r-400'  },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-2">
                <span className="text-[11px] text-n-600 w-36 shrink-0">{r.label}</span>
                <div className="flex-1 h-1.5 bg-n-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.color} bar-fill`} style={{ width: `${r.pct}%` }} />
                </div>
                <span className="text-[11px] font-semibold text-n-950 w-7 text-right shrink-0">{r.pct}%</span>
              </div>
            ))}
          </div>

          <div className="mt-3 border-t border-n-100 pt-3">
            <button
              onClick={() => setShowNPSDetail(o => !o)}
              className="flex items-center gap-1.5 text-[12px] font-semibold text-h-600 hover:text-h-700 transition-colors"
            >
              {showNPSDetail ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              Ver detalle por equipo
            </button>
            {showNPSDetail && (
              <div className="mt-3 flex flex-col gap-4">
                {[
                  { label: 'Promotores',  filter: t => t.nps >= 50, dot: 'bg-g-400', score: 'text-g-700' },
                  { label: 'Neutrales',   filter: t => t.nps >= 30 && t.nps < 50, dot: 'bg-y-400', score: 'text-y-600' },
                  { label: 'Detractores', filter: t => t.nps < 30,  dot: 'bg-r-400', score: 'text-r-600' },
                ].map(group => {
                  const teams = NPS_BY_TEAM.filter(group.filter)
                  if (!teams.length) return null
                  return (
                    <div key={group.label}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className={`w-2 h-2 rounded-full ${group.dot}`} />
                        <span className="text-[10px] font-semibold text-n-500 uppercase tracking-widest">{group.label}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 pl-3.5">
                        {teams.map(t => (
                          <div key={t.team} className="flex items-center gap-3">
                            <span className="text-[11px] text-n-700 flex-1">{t.team}</span>
                            <span className={`text-[11px] font-bold w-8 text-right shrink-0 ${group.score}`}>{t.nps}</span>
                            <span className="text-[10px] text-n-400 w-14 text-right shrink-0">{t.responses} resp.</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-4dp p-5">
        <p className="text-[13px] font-semibold text-n-950 mb-1">Planes de carrera más utilizados</p>
        <p className="text-[11px] text-n-600 mb-4">Rutas con mayor adopción activa en la organización</p>
        {(() => {
          const data = [
            { label: 'Mid → Sr. Designer',  count: 18 },
            { label: 'Jr. → Mid Engineer',  count: 15 },
            { label: 'Sr. → Lead Eng.',     count: 11 },
            { label: 'Assoc. → PM',         count: 9  },
            { label: 'Mid → Sr. Frontend',  count: 8  },
            { label: 'Growth → Manager',    count: 5  },
          ]
          const maxVal = Math.max(...data.map(d => d.count))
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-n-400">Ruta</span>
                <span className="text-[10px] text-n-400">Nº de colaboradores activos</span>
              </div>
              {data.map((d) => (
                <div key={d.label} className="flex items-center gap-3">
                  <span className="text-[12px] text-n-700 w-40 shrink-0">{d.label}</span>
                  <div className="flex-1 h-6 bg-n-50 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-h-500 rounded-lg bar-fill flex items-center justify-end pr-2"
                      style={{ width: `${(d.count / maxVal) * 100}%` }}
                    >
                      <span className="text-[11px] font-bold text-white">{d.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        })()}
      </div>
      <div className="bg-white rounded-2xl shadow-4dp p-5">
        <p className="text-[13px] font-semibold text-n-950 mb-1">Correlación con retención</p>
        <p className="text-[11px] text-n-600 mb-4">Empleados con plan activo tienen 17pp más de retención proyectada</p>
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: 'Con plan activo', value: 91, color: 'bg-h-500', textColor: 'text-h-600' },
            { label: 'Sin plan activo', value: 74, color: 'bg-n-300', textColor: 'text-n-500' },
          ].map(b => (
            <div key={b.label} className="flex flex-col items-center gap-2">
              <p className={`text-4xl font-bold ${b.textColor}`}>{b.value}%</p>
              <div className="w-full h-2 bg-n-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${b.color} bar-fill`} style={{ width: `${b.value}%` }} />
              </div>
              <p className="text-[12px] text-n-600">{b.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
