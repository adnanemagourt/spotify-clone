import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('spotify_token') || null,
    refreshToken: localStorage.getItem('spotify_refresh_token') || null,
    expiresIn: localStorage.getItem('spotify_expires_in') || null,
    user: null,
    isAuthenticated: !!localStorage.getItem('spotify_token')
  }),

  actions: {
    setToken(token, refreshToken, expiresIn) {
      this.token = token
      this.refreshToken = refreshToken
      this.expiresIn = expiresIn
      this.isAuthenticated = true
      
      localStorage.setItem('spotify_token', token)
      localStorage.setItem('spotify_refresh_token', refreshToken)
      localStorage.setItem('spotify_expires_in', expiresIn)
    },

    clearAuth() {
      this.token = null
      this.refreshToken = null
      this.expiresIn = null
      this.user = null
      this.isAuthenticated = false
      
      localStorage.removeItem('spotify_token')
      localStorage.removeItem('spotify_refresh_token')
      localStorage.removeItem('spotify_expires_in')
    },

    async fetchUserProfile() {
      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })
        const data = await response.json()
        this.user = data
        return data
      } catch (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
    }
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.user?.display_name || 'User',
    userImage: (state) => state.user?.images?.[0]?.url || null,
    userEmail: (state) => state.user?.email || '',
    userCountry: (state) => state.user?.country || '',
    userProduct: (state) => state.user?.product || '',
    userFollowers: (state) => state.user?.followers?.total || 0
  }
})