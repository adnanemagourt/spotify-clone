<template>
  <div class="p-6">
    <div class="text-white">
      <p v-if="loading">Authenticating...</p>
      <p v-if="error" class="text-red-500">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
const initializeSpotifyPlayer = async (token) => {
  if (window.Spotify) {
    playerStore.initializePlayer(token)
  } else {
    await new Promise(resolve => {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          playerStore.initializePlayer(token)
          resolve()
        }
      }
      document.body.appendChild(script)
    })
  }
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const playerStore = usePlayerStore()
const { getAccessToken } = useSpotifyAuth()

const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const code = route.query.code
  
  if (!code) {
    error.value = 'No authorization code provided'
    loading.value = false
    return
  }

  try {
    const tokenData = await getAccessToken(code)
    
    if (tokenData.error) {
      throw new Error(tokenData.error_description || 'Authentication failed')
    }

    authStore.setToken(
      tokenData.access_token,
      tokenData.refresh_token,
      tokenData.expires_in
    )

    await authStore.fetchUserProfile()
    await playerStore.initializePlayer(tokenData.access_token)
    
    await router.push('/')
  } catch (err) {
    error.value = err.message
    console.error('Authentication error:', err)
  } finally {
    loading.value = false
  }
})
</script>