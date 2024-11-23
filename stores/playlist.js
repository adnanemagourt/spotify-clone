import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    userPlaylists: [],
    loading: false
  }),

  actions: {
    async fetchUserPlaylists() {
      this.loading = true
      const authStore = useAuthStore()
      
      try {
        console.log('Fetching with token:', authStore.token) // Debug log
        const response = await fetch('https://api.spotify.com/v1/me/playlists', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('Playlists data:', data) // Debug log
        this.userPlaylists = data.items || []
      } catch (error) {
        console.error('Error fetching playlists:', error)
        this.userPlaylists = []
      } finally {
        this.loading = false
      }
    },

    async createPlaylist(name, description = '') {
      const authStore = useAuthStore()
      
      try {
        // Get user ID first
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        const userData = await userResponse.json()

        // Create playlist
        const response = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name,
            description,
            public: false
          })
        })
        
        const playlist = await response.json()
        this.userPlaylists.unshift(playlist)
      } catch (error) {
        console.error('Error creating playlist:', error)
      }
    },

    async deletePlaylist(playlistId) {
      const authStore = useAuthStore()
      
      try {
        await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        this.userPlaylists = this.userPlaylists.filter(p => p.id !== playlistId)
      } catch (error) {
        console.error('Error deleting playlist:', error)
      }
    },

    // In stores/playlist.js
async getPlaylist(playlistId) {
  const authStore = useAuthStore()
  
  try {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error getting playlist:', error)
    return null
  }
},

async addToPlaylist(playlistId, trackUri) {
  const authStore = useAuthStore()
  
  try {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uris: [trackUri]
      })
    })
  } catch (error) {
    console.error('Error adding track to playlist:', error)
  }
},

async removeFromPlaylist(playlistId, trackUri) {
  const authStore = useAuthStore()
  
  try {
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tracks: [{ uri: trackUri }]
      })
    })
  } catch (error) {
    console.error('Error removing track from playlist:', error)
  }
}

    
  }
})