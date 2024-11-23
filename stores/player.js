import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
 state: () => ({
   player: null,
   currentTrack: null,
   isPlaying: false,
   volume: 1,
   progress: 0,
   deviceId: null,
   duration: 0
 }),

 actions: {
   initializePlayer(token) {
     console.log('Initializing player with token:', token)
     
     if (!window.Spotify) {
       window.onSpotifyWebPlaybackSDKReady = () => {
         this.setupPlayer(token)
       }
     } else {
       this.setupPlayer(token)
     }
   },

   setupPlayer(token) {
     console.log('Setting up player')
     this.player = new window.Spotify.Player({
       name: 'Spotify Clone Player',
       getOAuthToken: cb => { cb(token) },
       volume: this.volume
     })

     this.player.addListener('ready', ({ device_id }) => {
       console.log('Device ready, ID:', device_id)
       this.deviceId = device_id
     })

     this.player.addListener('not_ready', ({ device_id }) => {
       console.log('Device has gone offline:', device_id)
     })

     this.player.addListener('player_state_changed', state => {
       if (state) {
         this.currentTrack = state.track_window.current_track
         this.isPlaying = !state.paused
         this.progress = state.position
         this.duration = state.duration
       }
     })

     this.player.addListener('initialization_error', ({ message }) => {
       console.error('Initialization error:', message)
     })

     this.player.addListener('authentication_error', ({ message }) => {
       console.error('Authentication error:', message)
     })

     this.player.addListener('account_error', ({ message }) => {
       console.error('Account error:', message)
     })

     this.player.addListener('playback_error', ({ message }) => {
       console.error('Playback error:', message)
     })

     console.log('Connecting player...')
     this.player.connect().then(success => {
       console.log('Player connected:', success)
     })
   },

   async playTrack(trackUri) {
     console.log('Attempting to play:', trackUri)
     console.log('Device ID:', this.deviceId)
     if (!this.deviceId) {
       console.error('No device ID available')
       return
     }

     const authStore = useAuthStore()
     console.log('Auth token:', authStore.token)
     
     try {
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
       console.log('Play response:', response)
       
       if (!response.ok) {
         const error = await response.json()
         console.error('Playback API error:', error)
       }

       // Set track duration
       if (this.player) {
         const state = await this.player.getCurrentState()
         if (state) {
           this.duration = state.duration
         }
       }
     } catch (error) {
       console.error('Playback error:', error)
     }
   },

   async togglePlay() {
     if (this.player) {
       await this.player.togglePlay()
     }
   },

   async setVolume(value) {
     this.volume = value
     if (this.player) {
       await this.player.setVolume(value)
     }
   },

   async seekToPosition(position) {
     if (this.player) {
       await this.player.seek(position)
     }
   },

   async nextTrack() {
     if (this.player) {
       await this.player.nextTrack()
     }
   },

   async previousTrack() {
     if (this.player) {
       await this.player.previousTrack()
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
   }
 }
})