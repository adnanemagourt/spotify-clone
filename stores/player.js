import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const usePlayerStore = defineStore('player', {
  state: () => {
    console.log('Initializing player store state')
    return {
      player: null,
      currentTrack: null,
      isPlaying: false,
      volume: 1,
      progress: 0,
      deviceId: null,
      duration: 0,
      queue: []
    }
  },

  actions: {
    async initializePlayer(token) {
      console.log('Initializing player with token:', token?.substring(0, 10) + '...')

      if (!window.Spotify) {
        console.log('Loading Spotify SDK...')
        try {
          await new Promise(resolve => {
            window.onSpotifyWebPlaybackSDKReady = () => {
              console.log('Spotify SDK loaded successfully')
              resolve()
            }
            const script = document.createElement('script')
            script.onerror = (error) => {
              console.error('Failed to load Spotify SDK:', error)
              throw new Error('Spotify SDK failed to load')
            }
            script.onload = () => {
              console.log('Spotify SDK script loaded')
            }
            script.src = 'https://sdk.scdn.co/spotify-player.js'
            document.head.appendChild(script)
            console.log('Added Spotify SDK script to document')
          })
        } catch (error) {
          console.error('Error loading Spotify SDK:', error)
          throw error
        }
      }

      try {
        console.log('Setting up new Spotify player instance')
        await this.setupPlayer(token)
      } catch (error) {
        console.error('Error setting up player:', error)
        throw error
      }
    },

    async setupPlayer(token) {
      console.log('Setting up player with token:', token?.substring(0, 10) + '...')
      this.player = new window.Spotify.Player({
        name: 'Spotify Clone Player',
        getOAuthToken: cb => {
          console.log('OAuth token requested by player')
          cb(token)
        },
        volume: this.volume
      })

      this.player.addListener('ready', ({ device_id }) => {
        console.log('Player ready with device ID:', device_id)
        this.deviceId = device_id
      })

      this.player.addListener('not_ready', ({ device_id }) => {
        console.warn('Player device went offline:', device_id)
        this.deviceId = null
      })

      this.player.addListener('player_state_changed', state => {
        console.log('Player state changed:', state ? {
          track: state.track_window.current_track.name,
          paused: state.paused,
          position: state.position,
          duration: state.duration
        } : 'No state')

        if (state) {
          this.currentTrack = state.track_window.current_track
          this.isPlaying = !state.paused
          this.progress = state.position
          this.duration = state.duration
        }
      })

      this.player.addListener('initialization_error', ({ message }) => {
        console.error('Player initialization error:', message)
        throw new Error('Player initialization failed')
      })

      this.player.addListener('authentication_error', ({ message }) => {
        console.error('Player authentication error:', message)
        throw new Error('Player authentication failed')
      })

      this.player.addListener('account_error', ({ message }) => {
        console.error('Player account error:', message)
        throw new Error('Player account error')
      })

      this.player.addListener('playback_error', ({ message }) => {
        console.error('Player playback error:', message)
        throw new Error('Player playback error')
      })

      try {
        console.log('Connecting player...')
        const connected = await this.player.connect()
        if (!connected) {
          throw new Error('Player connection failed')
        }
        console.log('Player connected successfully')
      } catch (error) {
        console.error('Error connecting player:', error)
        throw error
      }
    },

    async playTrack(trackUri) {
      console.log('Attempting to play track:', trackUri)
      console.log('Current device ID:', this.deviceId)

      if (!this.deviceId) {
        console.error('No active device found')
        throw new Error('No active device found. Please open Spotify on your device and try again.')
      }

      const authStore = useAuthStore()
      
      try {
        await authStore.refreshAccessToken() // Refresh the access token if needed
        console.log('Sending play request to Spotify API')
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authStore.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uris: [trackUri]
          })
        })

        if (!response.ok) {
          const error = await response.json()
          console.error('Play request failed:', error)
          throw new Error(`Playback failed: ${response.status} - ${error.error.message}`)
        }
        console.log('Track playback started successfully')
      } catch (error) {
        console.error('Playback error:', error)
        throw error
      }
    },

    async addToQueue(track) {
      console.log('Adding to queue:', track)
      if (!this.deviceId) {
        console.error('No device ID available for queue addition')
        throw new Error('No active device found')
      }

      const authStore = useAuthStore()

      try {
        console.log('Sending add to queue request')
        const response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${track.uri}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })

        if (!response.ok) {
          const error = await response.json()
          console.error('Queue API error:', error)
          throw new Error(`Add to queue failed: ${response.status} - ${error.error.message}`)
        }

        this.queue.push(track)
        console.log('Track added to queue successfully')
      } catch (error) {
        console.error('Error adding to queue:', error)
        throw error
      }
    },

    async removeFromQueue(index) {
      console.log('Removing track from queue at index:', index)
      this.queue.splice(index, 1)
    },

    async togglePlay() {
      console.log('Toggling play state')
      if (this.player) {
        try {
          await this.player.togglePlay()
          console.log('Play state toggled')
        } catch (error) {
          console.error('Error toggling play:', error)
          throw error
        }
      }
    },

    async setVolume(value) {
      console.log('Setting volume to:', value)
      this.volume = value
      if (this.player) {
        try {
          await this.player.setVolume(value)
          console.log('Volume updated successfully')
        } catch (error) {
          console.error('Error setting volume:', error)
          throw error
        }
      }
    },

    async seekToPosition(position) {
      console.log('Seeking to position:', position)
      if (this.player) {
        try {
          await this.player.seek(position)
          console.log('Seek completed')
        } catch (error) {
          console.error('Error seeking position:', error)
          throw error
        }
      }
    },

    async nextTrack() {
      console.log('Skipping to next track')
      if (this.player) {
        try {
          await this.player.nextTrack()
          if (this.queue.length > 0) {
            console.log('Removing played track from queue')
            this.queue.shift()
          }
          console.log('Next track initiated')
        } catch (error) {
          console.error('Error skipping to next track:', error)
          throw error
        }
      }
    },

    async previousTrack() {
      console.log('Going to previous track')
      if (this.player) {
        try {
          await this.player.previousTrack()
          console.log('Previous track initiated')
        } catch (error) {
          console.error('Error going to previous track:', error)
          throw error
        }
      }
    }
  },

  getters: {
    currentTime: (state) => {
      const minutes = Math.floor(state.progress / 60000)
      const seconds = ((state.progress % 60000) / 1000).toFixed(0)
      return `${minutes}:${seconds.padStart(2, '0')}`
    },

    totalTime: (state) => {
      const minutes = Math.floor(state.duration / 60000)
      const seconds = ((state.duration % 60000) / 1000).toFixed(0)
      return `${minutes}:${seconds.padStart(2, '0')}`
    },

    queuedTracks: (state) => state.queue
  }
})