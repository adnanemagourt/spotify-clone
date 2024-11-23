import { useAuthStore } from '@/stores/auth'

export const useSpotifyApi = () => {
  const authStore = useAuthStore()
  const config = {
    baseUrl: 'https://api.spotify.com/v1'
  }

  const fetchWithToken = async (endpoint, options = {}) => {
    try {
      const response = await fetch(`${config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      if (response.status === 401) {
        const newToken = await authStore.refreshAccessToken()
        if (newToken) {
          return fetchWithToken(endpoint, options)
        }
        throw new Error('Authentication failed')
      }

      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  const getFeaturedPlaylists = () => {
    return fetchWithToken('/browse/featured-playlists')
  }

  const getRecommendations = () => {
    return fetchWithToken('/recommendations')
  }

  const search = (query, types = ['track', 'artist', 'album']) => {
    return fetchWithToken(`/search?q=${encodeURIComponent(query)}&type=${types.join(',')}`)
  }

  const getPlaylist = (playlistId) => {
    return fetchWithToken(`/playlists/${playlistId}`)
  }

  const createPlaylist = (userId, name, description = '') => {
    return fetchWithToken(`/users/${userId}/playlists`, {
      method: 'POST',
      body: JSON.stringify({ name, description, public: true })
    })
  }

  const addTracksToPlaylist = (playlistId, uris) => {
    return fetchWithToken(`/playlists/${playlistId}/tracks`, {
      method: 'POST',
      body: JSON.stringify({ uris })
    })
  }

  return {
    getFeaturedPlaylists,
    getRecommendations,
    search,
    getPlaylist,
    createPlaylist,
    addTracksToPlaylist
  }
}