import { api } from './client';

export const careerPathsApi = {
  getAll: (search) => api.get(`/career-paths${search ? `?search=${search}` : ''}`),
  getGrouped: () => api.get('/career-paths/grouped'),
  getRoutes: (growthType) => api.get(`/career-paths/routes/${growthType}`),
  getSkills: (route) => api.get(`/career-paths/${route}/skills`),
  getObjectives: (route) => api.get(`/career-paths/${route}/objectives`),
  getById: (id) => api.get(`/career-paths/${id}`),
  create: (data) => api.post('/career-paths', data),
  update: (id, data) => api.put(`/career-paths/${id}`, data),
  delete: (id) => api.delete(`/career-paths/${id}`),
};
