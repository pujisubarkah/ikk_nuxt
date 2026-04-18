import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    id: null as string | null,
    role_id: null as string | null,
    username: '',
    name: '',
    role: '',
    isAuthenticated: false,
  }),
  actions: {
    setAuth(data: { id: string; role_id: string; username: string; name: string; role: string }) {
      this.id = data.id
      this.role_id = data.role_id
      this.username = data.username
      this.name = data.name
      this.role = data.role
      this.isAuthenticated = true
    },
    clearAuth() {
      this.id = null
      this.role_id = null
      this.username = ''
      this.name = ''
      this.role = ''
      this.isAuthenticated = false
    },
  },
  persist: true,
})
