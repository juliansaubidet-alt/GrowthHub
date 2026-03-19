import { api } from './client';

export const competenciesApi = {
  getAll: () => api.get('/competencies'),
  getById: (id) => api.get(`/competencies/${id}`),
  create: (data) => api.post('/competencies', data),
  update: (id, data) => api.put(`/competencies/${id}`, data),
  remove: (id) => api.delete(`/competencies/${id}`),
  addSkill: (compId, data) => api.post(`/competencies/${compId}/skills`, data),
  updateSkill: (compId, skillId, data) => api.put(`/competencies/${compId}/skills/${skillId}`, data),
  removeSkill: (compId, skillId) => api.delete(`/competencies/${compId}/skills/${skillId}`),
};
