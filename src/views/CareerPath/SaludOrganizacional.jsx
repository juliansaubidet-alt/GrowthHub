import { useState } from 'react'
import { Check, ChevronDown, ChevronRight, TrendingDown, AlertTriangle, AlertCircle, CheckCircle, AlertOctagon } from 'lucide-react'
import { useApp } from '../../App'

const TEAM_HEALTH = [
  {
    team: 'Product Design', engagement: 82, planActivo: 75, retencion: 91, riesgo: 'bajo', manager: 'Valentina Cruz',
    members: [
      { name: 'Sofia Carro',    initials: 'SC', color: 'bg-h-100 text-h-700', role: 'Mid Designer',    plan: { active: true,  title: 'Avanzar a Senior Designer',     progress: 68, nextLevel: 'Senior' } },
      { name: 'Ana Martínez',   initials: 'AM', color: 'bg-p-100 text-p-700', role: 'Senior Designer', plan: { active: true,  title: 'Avanzar a Lead Designer',       progress: 45, nextLevel: 'Lead'   } },
      { name: 'Tomás Ríos',     initials: 'TR', color: 'bg-g-100 text-g-800', role: 'Junior Designer', plan: { active: true,  title: 'Avanzar a Mid Designer',        progress: 30, nextLevel: 'Mid'    } },
      { name: 'Lucía Pérez',    initials: 'LP', color: 'bg-y-100 text-y-700', role: 'Junior Designer', plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
    ],
  },
  {
    team: 'Frontend Engineering', engagement: 74, planActivo: 60, retencion: 84, riesgo: 'medio', manager: 'Martina Sol',
    members: [
      { name: 'Carlos Ruiz',    initials: 'CR', color: 'bg-h-100 text-h-700', role: 'Mid Frontend',    plan: { active: true,  title: 'Avanzar a Senior Frontend',     progress: 55, nextLevel: 'Senior' } },
      { name: 'Martina Sol',    initials: 'MS', color: 'bg-t-100 text-t-700', role: 'Senior Frontend', plan: { active: true,  title: 'Especialización en Arquitectura', progress: 72, nextLevel: 'Lead'  } },
      { name: 'Diego Vega',     initials: 'DV', color: 'bg-p-100 text-p-700', role: 'Junior Frontend', plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Paula Méndez',   initials: 'PM', color: 'bg-r-100 text-r-600', role: 'Mid Frontend',    plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Nicolás Vidal',  initials: 'NV', color: 'bg-g-100 text-g-800', role: 'Junior Frontend', plan: { active: true,  title: 'Avanzar a Mid Frontend',        progress: 22, nextLevel: 'Mid'    } },
    ],
  },
  {
    team: 'Backend Engineering', engagement: 68, planActivo: 45, retencion: 78, riesgo: 'alto', manager: 'Fernanda Ortiz',
    members: [
      { name: 'Rodrigo Blanco', initials: 'RB', color: 'bg-n-200 text-n-700', role: 'Mid Backend',     plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Fernanda Ortiz', initials: 'FO', color: 'bg-h-100 text-h-700', role: 'Senior Backend',  plan: { active: true,  title: 'Tech Lead Backend',             progress: 40, nextLevel: 'Lead'   } },
      { name: 'Gustavo Sosa',   initials: 'GS', color: 'bg-n-200 text-n-700', role: 'Junior Backend',  plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Emilia Castro',  initials: 'EC', color: 'bg-p-100 text-p-700', role: 'Mid Backend',     plan: { active: true,  title: 'Avanzar a Senior Backend',      progress: 60, nextLevel: 'Senior' } },
    ],
  },
  {
    team: 'Data & Analytics', engagement: 79, planActivo: 70, retencion: 88, riesgo: 'bajo', manager: 'Matías Leal',
    members: [
      { name: 'Valentina Cruz', initials: 'VC', color: 'bg-t-100 text-t-700', role: 'Data Analyst',    plan: { active: true,  title: 'Avanzar a Senior Analyst',      progress: 65, nextLevel: 'Senior' } },
      { name: 'Matías Leal',    initials: 'ML', color: 'bg-h-100 text-h-700', role: 'Senior Analyst',  plan: { active: true,  title: 'Data Science Lead',             progress: 50, nextLevel: 'Lead'   } },
      { name: 'Camila Rojas',   initials: 'CR', color: 'bg-g-100 text-g-800', role: 'Junior Analyst',  plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
    ],
  },
  {
    team: 'People & Culture', engagement: 88, planActivo: 90, retencion: 94, riesgo: 'bajo', manager: 'Sebastián Gil',
    members: [
      { name: 'Laura Romero',   initials: 'LR', color: 'bg-p-100 text-p-700', role: 'HR Specialist',   plan: { active: true,  title: 'Avanzar a HR Business Partner', progress: 80, nextLevel: 'Senior' } },
      { name: 'Sebastián Gil',  initials: 'SG', color: 'bg-h-100 text-h-700', role: 'Talent Manager',  plan: { active: true,  title: 'Head of People',                progress: 55, nextLevel: 'Lead'   } },
      { name: 'Agustina Mora',  initials: 'AM', color: 'bg-g-100 text-g-800', role: 'HR Analyst',      plan: { active: true,  title: 'Avanzar a HR Specialist',       progress: 70, nextLevel: 'Mid'    } },
    ],
  },
  {
    team: 'Growth Marketing', engagement: 65, planActivo: 40, retencion: 75, riesgo: 'alto', manager: 'Renata Lagos',
    members: [
      { name: 'Ignacio Funes',  initials: 'IF', color: 'bg-n-200 text-n-700', role: 'Growth Analyst',  plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Renata Lagos',   initials: 'RL', color: 'bg-y-100 text-y-700', role: 'Growth Manager',  plan: { active: true,  title: 'Head of Growth',                progress: 35, nextLevel: 'Lead'   } },
      { name: 'Bruno Espejo',   initials: 'BE', color: 'bg-n-200 text-n-700', role: 'Junior Growth',   plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Daniela Vera',   initials: 'DV', color: 'bg-r-100 text-r-600', role: 'Content Manager', plan: { active: false, title: 'Sin plan asignado',             progress: 0,  nextLevel: '—'      } },
      { name: 'Tomás Herrera',  initials: 'TH', color: 'bg-h-100 text-h-700', role: 'SEO Specialist',  plan: { active: true,  title: 'Avanzar a Senior Growth',       progress: 28, nextLevel: 'Senior' } },
    ],
  },
]

const RIESGO_BADGE = { bajo: 'bg-g-50 text-g-800', medio: 'bg-y-50 text-y-700', alto: 'bg-r-50 text-r-600' }
const ENG_THRESHOLD = 70
const PLAN_THRESHOLD = 0.5

const SEVERITY_STYLE = {
  alto:  { bar: 'border-l-4 border-r-600 bg-r-50',  badge: 'bg-r-50 text-r-600',  btn: 'bg-r-600 hover:bg-r-700' },
  medio: { bar: 'border-l-4 border-y-400 bg-y-50',  badge: 'bg-y-50 text-y-700',  btn: 'bg-y-500 hover:bg-y-600' },
}

function computeRiskAlerts() {
  const alerts = []
  TEAM_HEALTH.forEach(t => {
    const sinPlan = t.members.filter(m => !m.plan.active).length
    const sinPlanPct = sinPlan / t.members.length
    if (t.engagement < ENG_THRESHOLD)
      alerts.push({ id: `eng-${t.team}`, team: t.team, manager: t.manager, severity: t.engagement < 60 ? 'alto' : 'medio',
        type: 'Engagement bajo', message: `Engagement del equipo en ${t.engagement}% (umbral: ${ENG_THRESHOLD}%)`, Icon: TrendingDown })
    if (sinPlanPct > PLAN_THRESHOLD)
      alerts.push({ id: `plan-${t.team}`, team: t.team, manager: t.manager, severity: sinPlanPct > 0.7 ? 'alto' : 'medio',
        type: 'Baja actividad', message: `${sinPlan} de ${t.members.length} integrantes sin plan activo`, Icon: AlertTriangle })
    if (t.riesgo === 'alto' && t.engagement >= ENG_THRESHOLD && sinPlanPct <= PLAN_THRESHOLD)
      alerts.push({ id: `riesgo-${t.team}`, team: t.team, manager: t.manager, severity: 'alto',
        type: 'Equipo en riesgo', message: `Retención proyectada en ${t.retencion}% — requiere atención`, Icon: AlertCircle })
  })
  return alerts
}

export default function SaludOrganizacional() {
  const { resolvedAlerts, setResolvedAlerts } = useApp()
  const [expanded, setExpanded] = useState(null)
  const [sent, setSent] = useState({})
  const toggle = (team) => setExpanded(e => e === team ? null : team)
  const avg = (key) => Math.round(TEAM_HEALTH.reduce((a, t) => a + t[key], 0) / TEAM_HEALTH.length)
  const riesgoAlto = TEAM_HEALTH.filter(t => t.riesgo === 'alto').length

  const allAlerts   = computeRiskAlerts()
  const activeAlerts = allAlerts.filter(a => !resolvedAlerts.includes(a.id))

  const sendNotification = (alert) => {
    setSent(s => ({ ...s, [alert.id]: true }))
    setTimeout(() => setResolvedAlerts(r => [...r, alert.id]), 3000)
  }
  const resolveAlert = (id) => setResolvedAlerts(r => [...r, id])

  return (
    <div className="flex flex-col gap-5">
      {activeAlerts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
          <div className="px-5 py-3.5 border-b border-n-100 flex items-center gap-2">
            <AlertOctagon size={16} className="text-r-600" />
            <p className="text-[13px] font-semibold text-n-950 flex-1">Alertas de riesgo detectadas</p>
            <span className="text-[11px] font-bold bg-r-50 text-r-600 px-2 py-0.5 rounded-full">{activeAlerts.length} activas</span>
          </div>
          <div className="divide-y divide-n-50">
            {activeAlerts.map(alert => {
              const st = SEVERITY_STYLE[alert.severity]
              const wasSent = sent[alert.id]
              return (
                <div key={alert.id} className={`flex items-start gap-4 px-5 py-4 ${st.bar}`}>
                  <alert.Icon size={18} className="shrink-0 mt-0.5 text-current" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.badge}`}>{alert.severity.toUpperCase()}</span>
                      <span className="text-[12px] font-semibold text-n-950">{alert.type} — {alert.team}</span>
                    </div>
                    <p className="text-[12px] text-n-600">{alert.message}</p>
                    <p className="text-[11px] text-n-500 mt-0.5">Manager: <span className="font-semibold text-n-800">{alert.manager}</span></p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {wasSent ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-g-700 bg-g-50 px-3 py-1.5 rounded-lg">
                        <Check size={13} /> Notificación enviada
                      </span>
                    ) : (
                      <button onClick={() => sendNotification(alert)}
                        className={`h-8 px-3 text-white text-[12px] font-semibold rounded-lg transition ${st.btn}`}>
                        Notificar a {alert.manager.split(' ')[0]}
                      </button>
                    )}
                    <button onClick={() => resolveAlert(alert.id)} className="text-n-400 hover:text-n-700 text-xs transition px-2">Ignorar</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {activeAlerts.length === 0 && (
        <div className="flex items-center gap-3 px-5 py-4 bg-g-50 border border-g-200 rounded-2xl">
          <CheckCircle size={18} className="text-g-600" />
          <p className="text-[13px] font-semibold text-g-800">Sin alertas activas — todos los equipos dentro de los umbrales normales</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Engagement promedio', value: `${avg('engagement')}%`, sub: '+3% vs mes anterior',    color: 'text-h-600' },
          { label: '% con plan activo',    value: `${avg('planActivo')}%`, sub: `${TEAM_HEALTH.filter(t => t.planActivo >= 60).length}/${TEAM_HEALTH.length} equipos`, color: 'text-g-800' },
          { label: 'Retención proyectada', value: `${avg('retencion')}%`, sub: 'Próximos 12 meses',      color: 'text-t-700' },
          { label: 'Equipos en riesgo',    value: riesgoAlto,             sub: 'Requieren atención',     color: 'text-r-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-4dp p-4">
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[12px] font-semibold text-n-950 mt-1">{s.label}</p>
            <p className="text-[11px] text-n-600">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
        <div className="px-6 py-4 border-b border-n-100">
          <p className="text-[13px] font-semibold text-n-950">Salud por equipo</p>
          <p className="text-[11px] text-n-600">Hacé click en un equipo para ver sus integrantes y planes de carrera</p>
        </div>
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_32px] items-center px-6 py-2.5 border-b border-n-100 bg-n-50">
          {['Equipo','Engagement','Plan activo','Riesgo',''].map(h => (
            <span key={h} className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">{h}</span>
          ))}
        </div>
        <div className="divide-y divide-n-50">
          {TEAM_HEALTH.map(t => {
            const open = expanded === t.team
            const withPlan = t.members.filter(m => m.plan.active).length
            return (
              <div key={t.team}>
                <button
                  onClick={() => toggle(t.team)}
                  className={`w-full grid grid-cols-[2fr_1fr_1fr_1fr_32px] items-center px-6 py-3.5 text-left transition-colors ${open ? 'bg-h-50' : 'hover:bg-n-50'}`}
                >
                  <div className="flex items-center gap-2">
                    {open ? <ChevronDown size={14} className="text-h-500 shrink-0" /> : <ChevronRight size={14} className="text-n-400 shrink-0" />}
                    <span className="text-[13px] font-semibold text-n-950">{t.team}</span>
                    <span className="text-[10px] text-n-500 font-medium">{t.members.length} personas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-n-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${t.engagement}%`, backgroundColor: t.engagement >= 80 ? '#35a48e' : t.engagement >= 70 ? '#f59e0b' : '#ef4444' }} />
                    </div>
                    <span className="text-[12px] text-n-600">{t.engagement}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-n-100 rounded-full overflow-hidden">
                      <div className="h-full bg-h-500 rounded-full" style={{ width: `${t.planActivo}%` }} />
                    </div>
                    <span className="text-[12px] text-n-600">{withPlan}/{t.members.length}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize w-fit ${RIESGO_BADGE[t.riesgo]}`}>{t.riesgo}</span>
                  <span />
                </button>

                {open && (
                  <div className="bg-h-50 border-t border-h-100 px-6 py-4 animate-fade-in">
                    <div className="grid grid-cols-[2fr_2fr_1fr_80px] gap-2 px-3 pb-2">
                      {['Integrante','Plan de carrera','Siguiente nivel','Progreso'].map(h => (
                        <span key={h} className="text-[10px] font-semibold text-n-600 uppercase tracking-widest">{h}</span>
                      ))}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {t.members.map(m => (
                        <div key={m.name} className={`grid grid-cols-[2fr_2fr_1fr_80px] gap-2 items-center px-3 py-2.5 rounded-xl border ${m.plan.active ? 'bg-white border-n-100' : 'bg-n-50 border-n-100 opacity-75'}`}>
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${m.color}`}>{m.initials}</div>
                            <div className="min-w-0">
                              <p className="text-[12px] font-semibold text-n-950 truncate">{m.name}</p>
                              <p className="text-[10px] text-n-500 truncate">{m.role}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {m.plan.active
                              ? <span className="text-[12px] text-n-800 truncate">{m.plan.title}</span>
                              : <span className="text-[11px] text-n-400 italic">Sin plan asignado</span>}
                          </div>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full w-fit ${m.plan.active ? 'bg-h-50 text-h-700' : 'bg-n-100 text-n-400'}`}>{m.plan.nextLevel}</span>
                          {m.plan.active ? (
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 h-1.5 bg-n-100 rounded-full overflow-hidden">
                                <div className="h-full bg-h-500 rounded-full" style={{ width: `${m.plan.progress}%` }} />
                              </div>
                              <span className="text-[11px] font-semibold text-h-600 w-7 text-right shrink-0">{m.plan.progress}%</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-n-300">—</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
