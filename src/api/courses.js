import { api } from './client';

export const coursesApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/courses${query ? `?${query}` : ''}`);
  },
  getByRoute: (route) => api.get(`/courses/by-route/${route}`),
  getById: (id) => api.get(`/courses/${id}`),
};
