import { api } from './client';

export const careerPlansApi = {
  create: (data) => api.post('/career-plans', data),
  getMine: () => api.get('/career-plans/mine'),
  getByEmployee: (employeeId) => api.get(`/career-plans/by-employee/${employeeId}`),
  getById: (id) => api.get(`/career-plans/${id}`),
  getPending: (managerId) => api.get(`/career-plans/pending/${managerId}`),
  getByManager: (managerId) => api.get(`/career-plans/by-manager/${managerId}`),
  update: (id, data) => api.put(`/career-plans/${id}`, data),
  approve: (id) => api.post(`/career-plans/${id}/approve`),
  requestChanges: (id, feedback, managerName) => api.post(`/career-plans/${id}/request-changes`, { feedback, managerName }),
  addFeedback: (id, message, fromName) => api.post(`/career-plans/${id}/feedback`, { message, fromName }),
  markFeedbackSeen: (id) => api.post(`/career-plans/${id}/mark-feedback-seen`),
  resubmit: (id, data) => api.post(`/career-plans/${id}/resubmit`, data),
  toggleObjective: (planId, objId) => api.patch(`/career-plans/${planId}/objectives/${objId}/toggle`),
  updateCourseProgress: (planId, courseId, status) => api.patch(`/career-plans/${planId}/courses/${courseId}/progress`, { status }),
  addObjective: (planId, data) => api.post(`/career-plans/${planId}/objectives`, data),
  removeObjective: (planId, objId) => api.delete(`/career-plans/${planId}/objectives/${objId}`),
  addCourse: (planId, data) => api.post(`/career-plans/${planId}/courses`, data),
  removeCourse: (planId, courseId) => api.delete(`/career-plans/${planId}/courses/${courseId}`),
  updateSkills: (planId, data) => api.put(`/career-plans/${planId}/skills`, data),
};
