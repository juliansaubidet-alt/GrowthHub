import { api } from './client';

export const hrMetricsApi = {
  getStats: () => api.get('/hr/stats'),
  getTeamHealth: () => api.get('/hr/team-health'),
  getAlerts: () => api.get('/hr/alerts'),
  resolveAlert: (id) => api.post(`/hr/alerts/${id}/resolve`),
  notifyManager: (id) => api.post(`/hr/alerts/${id}/notify`),
  getAdoption: () => api.get('/hr/metrics/adoption'),
  getNps: () => api.get('/hr/metrics/nps'),
  getPopularPaths: () => api.get('/hr/metrics/popular-paths'),
  getRetention: () => api.get('/hr/metrics/retention'),
};
