import { api } from './client';

export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getManagers: () => api.get('/users/managers'),
  getTeam: (managerId) => api.get(`/users/team/${managerId}`),
};
