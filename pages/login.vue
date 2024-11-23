<template>
  <div class="flex items-center justify-center min-h-screen bg-black">
    <div class="text-center">
      <img src="/spotify-logo.svg" alt="Spotify" class="w-40 mx-auto mb-8">
      <button 
        @click="handleLogin"
        class="px-8 py-3 text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors"
      >
        Login with Spotify
      </button>
    </div>
  </div>
</template>

<script setup>
const { login } = useSpotifyAuth()
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  // If already logged in, redirect to home
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})

const handleLogin = () => {
  login()
}
</script>