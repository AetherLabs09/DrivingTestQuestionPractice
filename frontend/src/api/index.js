import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

api.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error.response?.data || error)
)

export const login = (data) => api.post('/users/login', data)
export const register = (data) => api.post('/users/register', data)
export const getUsers = () => api.get('/users')
export const updateUserStatus = (id, status) => api.put(`/users/${id}/status`, { status })
export const deleteUser = (id) => api.delete(`/users/${id}`)

export const getQuestions = (params) => api.get('/questions', { params })
export const createQuestion = (data) => api.post('/questions', data)
export const updateQuestion = (id, data) => api.put(`/questions/${id}`, data)
export const reviewQuestion = (id, status) => api.put(`/questions/${id}/review`, { status })
export const correctQuestion = (id, error_correction) => api.put(`/questions/${id}/correct`, { error_correction })
export const deleteQuestion = (id) => api.delete(`/questions/${id}`)

export const getOverview = () => api.get('/stats/overview')
export const getUserActivity = () => api.get('/stats/user-activity')
export const getAnswerRate = () => api.get('/stats/answer-rate')
export const getPassRate = () => api.get('/stats/pass-rate')
export const getHotTopics = () => api.get('/stats/hot-topics')

export const getFeedbacks = (params) => api.get('/feedback', { params })
export const replyFeedback = (id, reply) => api.put(`/feedback/${id}/reply`, { reply })
export const deleteFeedback = (id) => api.delete(`/feedback/${id}`)

export const getAds = (params) => api.get('/ads', { params })
export const createAd = (content) => api.post('/ads', { content })
export const updateAdStatus = (id, status) => api.put(`/ads/${id}/status`, { status })
export const deleteAd = (id) => api.delete(`/ads/${id}`)

export const getCheatLogs = () => api.get('/risk/cheat-logs')
export const getViolations = () => api.get('/risk/violations')
export const checkSpeed = (data) => api.post('/risk/check-speed', data)