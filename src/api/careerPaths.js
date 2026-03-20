import { api } from './client';

export const careerPathsApi = {
  getAll: (search) => api.get(`/career-paths${search ? `?search=${search}` : ''}`),
  getGrouped: () => api.get('/career-paths/grouped'),
  getRoutes: (growthType, department, level) => {
    const params = new URLSearchParams();
    if (department) params.set('department', department);
    if (level) params.set('level', level);
    const q = params.toString();
    return api.get(`/career-paths/routes/${growthType}${q ? `?${q}` : ''}`);
  },
  getSkills: (route) => api.get(`/career-paths/${route}/skills`),
  getSoftSkills: (route) => api.get(`/career-paths/${route}/soft-skills`),
  getSuggestedCourses: (route) => api.get(`/career-paths/${route}/suggested-courses`),
  getObjectives: (route) => api.get(`/career-paths/${route}/objectives`),
  getById: (id) => api.get(`/career-paths/${id}`),
  create: (data) => api.post('/career-paths', data),
  update: (id, data) => api.put(`/career-paths/${id}`, data),
  delete: (id) => api.delete(`/career-paths/${id}`),
};
