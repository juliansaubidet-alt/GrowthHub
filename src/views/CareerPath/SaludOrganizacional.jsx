import { useState, useEffect } from 'react'
import { Check, ChevronDown, ChevronRight, AlertCircle, CheckCircle, AlertOctagon } from 'lucide-react'
import { hrMetricsApi } from '../../api/hrMetrics'

const RIESGO_BADGE = { bajo: 'bg-g-50 text-g-800', medio: 'bg-y-50 text-y-700', alto: 'bg-r-50 text-r-600' }

const SEVERITY_STYLE = {
  alto:  { bar: 'border-l-4 border-r-600 bg-r-50',  badge: 'bg-r-50 text-r-600',  btn: 'bg-r-600 hover:bg-r-700' },
  medio: { bar: 'border-l-4 border-y-400 bg-y-50',  badge: 'bg-y-50 text-y-700',  btn: 'bg-y-500 hover:bg-y-600' },
}

export default function SaludOrganizacional() {
  const [teamHealth, setTeamHealth] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [alertsExpanded, setAlertsExpanded] = useState(false)
  const [sent, setSent] = useState({})

  useEffect(() => {
    Promise.all([
      hrMetricsApi.getTeamHealth(),
      hrMetricsApi.getAlerts(),
    ]).then(([health, alertsData]) => {
      setTeamHealth(health)
      setAlerts(alertsData.filter(a => !a.resolved))
      setLoading(false)
    }).catch(err => { console.error(err); setLoading(false) })
  }, [])

  const toggle = (team) => setExpanded(e => e === team ? null : team)
  const avg = (key) => teamHealth.length ? Math.round(teamHealth.reduce((a, t) => a + t[key], 0) / teamHealth.length) : 0
  const riesgoAlto = teamHealth.filter(t => t.riskLevel === 'alto').length

  const sendNotification = (alert) => {
    const alertId = alert._id || alert.id
    hrMetricsApi.notifyManager(alertId).then(() => {
      setSent(s => ({ ...s, [alertId]: true }))
    }).catch(err => console.error(err))
  }
  const resolveAlert = (id) => {
    hrMetricsApi.resolveAlert(id).then(() => {
      setAlerts(prev => prev.filter(a => (a._id || a.id) !== id))
    }).catch(err => console.error(err))
  }

  if (loading) return <div className="text-center py-8 text-n-500">Cargando...</div>

  return (
    <div className="flex flex-col gap-5">
      {alerts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-4dp overflow-hidden">
          <button
            onClick={() => setAlertsExpanded(e => !e)}
            className="w-full px-5 py-3.5 border-b border-n-100 flex items-center gap-2 hover:bg-n-50 transition-colors"
          >
            {alertsExpanded ? <ChevronDown size={14} className="text-r-500 shrink-0" /> : <ChevronRight size={14} className="text-r-500 shrink-0" />}
            <AlertOctagon size={16} className="text-r-600" />
            <p className="text-[13px] font-semibold text-n-950 flex-1 text-left">Alertas de riesgo detectadas</p>
            <span className="text-[11px] font-bold bg-r-50 text-r-600 px-2 py-0.5 rounded-full">{alerts.length} activas</span>
          </button>
          {alertsExpanded && <div className="divide-y divide-n-50">
            {alerts.map(alert => {
              const alertId = alert._id || alert.id
              const st = SEVERITY_STYLE[alert.severity] || SEVERITY_STYLE.medio
              const wasSent = sent[alertId]
              const mgrName = alert.managerName || alert.manager || ''
              return (
                <div key={alertId} className={`flex items-start gap-4 px-5 py-4 ${st.bar}`}>
                  <AlertCircle size={18} className="shrink-0 mt-0.5 text-current" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${st.badge}`}>{alert.severity?.toUpperCase()}</span>
                      <span className="text-[12px] font-semibold text-n-950">{alert.type} — {alert.team}</span>
                    </div>
                    <p className="text-[12px] text-n-600">{alert.message}</p>
                    <p className="text-[11px] text-n-500 mt-0.5">Manager: <span className="font-semibold text-n-800">{mgrName}</span></p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {wasSent ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-g-700 bg-g-50 px-3 py-1.5 rounded-lg">
                        <Check size={13} /> Notificación enviada
                      </span>
                    ) : (
                      <button onClick={() => sendNotification(alert)}
                        className={`h-8 px-3 text-white text-[12px] font-semibold rounded-lg transition ${st.btn}`}>
                        Notificar a {mgrName.split(' ')[0] || 'Manager'}
                      </button>
                    )}
                    <button onClick={() => resolveAlert(alertId)} className="text-n-400 hover:text-n-700 text-xs transition px-2">Ignorar</button>
                  </div>
                </div>
              )
            })}
          </div>}
        </div>
      )}

      {alerts.length === 0 && (
        <div className="flex items-center gap-3 px-5 py-4 bg-g-50 border border-g-200 rounded-2xl">
          <CheckCircle size={18} className="text-g-600" />
          <p className="text-[13px] font-semibold text-g-800">Sin alertas activas — todos los equipos dentro de los umbrales normales</p>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Engagement promedio', value: `${avg('engagement')}%`, sub: '+3% vs mes anterior',    color: 'text-h-600' },
          { label: '% con plan activo',    value: `${avg('planAdoption')}%`, sub: `${teamHealth.filter(t => t.planAdoption >= 60).length}/${teamHealth.length} equipos`, color: 'text-g-800' },
          { label: 'Retención proyectada', value: `${avg('retention')}%`, sub: 'Próximos 12 meses',      color: 'text-t-700' },
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
          {teamHealth.map(t => {
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
                      <div className="h-full bg-h-500 rounded-full" style={{ width: `${t.planAdoption}%` }} />
                    </div>
                    <span className="text-[12px] text-n-600">{withPlan}/{t.members.length}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize w-fit ${RIESGO_BADGE[t.riskLevel]}`}>{t.riskLevel}</span>
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
