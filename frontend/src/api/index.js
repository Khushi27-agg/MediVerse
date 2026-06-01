import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('mediverse_user')
  if (stored) {
    try {
      const { token } = JSON.parse(stored)
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {}
  }
  return config
})

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getPatients: () => api.get('/auth/patients'),
}

export const appointmentsAPI = {
  getAll: () => api.get('/appointments'),
  create: (data) => api.post('/appointments', data),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  delete: (id) => api.delete(`/appointments/${id}`),
}

export const medicalAPI = {
  getAll: () => api.get('/medical'),
  create: (data) => api.post('/medical', data),
  update: (id, data) => api.put(`/medical/${id}`, data),
  delete: (id) => api.delete(`/medical/${id}`),
}

export const prescriptionsAPI = {
  getAll: () => api.get('/prescriptions'),
  create: (data) => api.post('/prescriptions', data),
  delete: (id) => api.delete(`/prescriptions/${id}`),
}

export default api
