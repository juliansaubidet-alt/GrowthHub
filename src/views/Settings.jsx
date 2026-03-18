import { useState } from 'react'
import { useApp, LEADER_PASSWORD } from '../App'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${checked ? 'bg-h-500' : 'bg-n-200'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

const NOTIFICATION_PREFS = [
  { id: 'review_due',     label: 'Review deadlines',         description: 'Get notified when a review is due soon' },
  { id: 'goal_update',    label: 'Goal updates',             description: 'Notifications when teammates update shared goals' },
  { id: 'plan_approved',  label: 'Career plan approved',     description: 'When your manager approves or comments on your plan' },
  { id: 'meeting_remind', label: '1:1 reminders',           description: '24h reminder before scheduled 1:1s' },
  { id: 'weekly_digest',  label: 'Weekly digest',           description: 'Summary of your progress and upcoming tasks every Monday' },
]

export default function Settings() {
  const { profile, setProfile, leaderRole, setLeaderRole } = useApp()

  const [name, setName]       = useState(profile?.role     || 'Sofia Carro')
  const [roleVal, setRoleVal] = useState(profile?.industry || 'Product Designer · Mid')
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [saved, setSaved]     = useState(false)

  const [notifs, setNotifs] = useState({
    review_due: true, goal_update: true, plan_approved: true, meeting_remind: true, weekly_digest: false,
  })

  const [theme, setTheme] = useState('light')

  function handleSaveProfile() {
    setProfile(prev => ({ ...prev, role: name, industry: roleVal }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleLeaderLogin() {
    if (pwInput === LEADER_PASSWORD) {
      setLeaderRole(true)
      setPwError('')
      setPwSuccess(true)
    } else {
      setPwError('Incorrect password. Try: lider2026')
      setPwSuccess(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-slide-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-n-950">Settings</h1>
        <p className="text-[13px] text-n-600 mt-0.5">Manage your account and preferences</p>
      </div>

      {/* Profile section */}
      <div className="bg-white rounded-2xl shadow-4dp mb-4">
        <div className="px-6 py-4 border-b border-n-100">
          <p className="text-[13px] font-semibold text-n-950">Profile</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-h-100 text-h-600 text-xl font-bold flex items-center justify-center shrink-0">
              {name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-[14px] font-semibold text-n-950">{name}</p>
              <p className="text-[12px] text-n-600">{roleVal}</p>
              <button className="mt-1 text-[11px] text-h-600 font-medium hover:underline">Change avatar</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-semibold text-n-600 mb-1.5">Full Name</label>
              <input className="input-humand" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-n-600 mb-1.5">Role &amp; Level</label>
              <input className="input-humand" value={roleVal} onChange={e => setRoleVal(e.target.value)} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-n-600 mb-1.5">Email</label>
              <input className="input-humand" defaultValue="sofia.carro@company.com" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-n-600 mb-1.5">Department</label>
              <input className="input-humand" defaultValue="Design" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveProfile}
              className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors"
            >
              Save changes
            </button>
            {saved && <span className="text-[12px] text-g-600 font-medium">✓ Saved!</span>}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-4dp mb-4">
        <div className="px-6 py-4 border-b border-n-100">
          <p className="text-[13px] font-semibold text-n-950">Notifications</p>
        </div>
        <div className="divide-y divide-n-50">
          {NOTIFICATION_PREFS.map(n => (
            <div key={n.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-medium text-n-950">{n.label}</p>
                <p className="text-[11px] text-n-600 mt-0.5">{n.description}</p>
              </div>
              <Toggle
                checked={notifs[n.id]}
                onChange={v => setNotifs(prev => ({ ...prev, [n.id]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-2xl shadow-4dp mb-4">
        <div className="px-6 py-4 border-b border-n-100">
          <p className="text-[13px] font-semibold text-n-950">Appearance</p>
        </div>
        <div className="p-6">
          <p className="text-[11px] font-semibold text-n-600 mb-3">Theme</p>
          <div className="flex gap-3">
            {[
              { id: 'light', label: 'Light', emoji: '☀️' },
              { id: 'dark',  label: 'Dark',  emoji: '🌙' },
              { id: 'auto',  label: 'Auto',  emoji: '⚙️' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center gap-2 h-9 px-4 rounded-lg border text-[13px] font-medium transition-all ${
                  theme === t.id
                    ? 'border-h-500 bg-h-50 text-h-600'
                    : 'border-n-200 text-n-600 hover:border-n-300'
                }`}
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Leader Access */}
      <div className="bg-white rounded-2xl shadow-4dp">
        <div className="px-6 py-4 border-b border-n-100 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-n-950">Leader Access</p>
            <p className="text-[11px] text-n-600 mt-0.5">Unlock manager and admin capabilities</p>
          </div>
          {leaderRole && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-h-100 text-h-800">Active</span>
          )}
        </div>
        <div className="p-6">
          {leaderRole ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-h-50 flex items-center justify-center text-xl">🛡️</div>
                <div>
                  <p className="text-[13px] font-semibold text-n-950">Leader role active</p>
                  <p className="text-[11px] text-n-600">You have access to manager and admin features</p>
                </div>
              </div>
              <button
                onClick={() => setLeaderRole(false)}
                className="h-9 px-4 bg-white border border-r-600 text-r-600 rounded-lg text-[13px] font-semibold hover:bg-r-50 transition-colors"
              >
                Revoke access
              </button>
            </div>
          ) : (
            <div>
              <p className="text-[12px] text-n-600 mb-3">Enter the leader password to unlock manager and HR admin features in the Career Path view.</p>
              <div className="flex gap-2">
                <input
                  className="input-humand"
                  type="password"
                  placeholder="Enter leader password..."
                  value={pwInput}
                  onChange={e => { setPwInput(e.target.value); setPwError(''); setPwSuccess(false) }}
                  onKeyDown={e => e.key === 'Enter' && handleLeaderLogin()}
                  style={{ maxWidth: 240 }}
                />
                <button
                  onClick={handleLeaderLogin}
                  className="h-9 px-4 bg-h-500 hover:bg-h-600 text-white rounded-lg text-[13px] font-semibold transition-colors shrink-0"
                >
                  Unlock
                </button>
              </div>
              {pwError && <p className="text-[12px] text-r-600 mt-1.5">{pwError}</p>}
              {pwSuccess && <p className="text-[12px] text-g-600 mt-1.5 font-medium">✓ Leader access granted!</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
