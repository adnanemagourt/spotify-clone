<template>
  <div class="p-6">
    <div v-if="loading" class="text-white">Loading...</div>
    <div v-else>
      <!-- Featured Section -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold text-white mb-4">Featured Playlists</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div 
            v-for="playlist in featuredPlaylists" 
            :key="playlist.id"
            @click="navigateToPlaylist(playlist.id)"
            class="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <button 
              v-if="!isInUserLibrary(playlist.id)"
              @click="addToLibrary(playlist)"
              class="absolute top-2 right-2 p-2 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <PlusIcon class="w-4 h-4 text-white" />
            </button>
            <img 
              :src="playlist.images[0]?.url" 
              :alt="playlist.name"
              class="w-full aspect-square object-cover rounded-md mb-4"
            >
            <h3 class="text-white font-medium truncate">{{ playlist.name }}</h3>
            <p class="text-gray-400 text-sm truncate">{{ playlist.description }}</p>
          </div>
        </div>
      </section>

      <!-- Recommendations Section -->
      <section>
        <h2 class="text-2xl font-bold text-white mb-4">Recommended for You</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div 
            v-for="track in recommendations" 
            :key="track.id"
            @click="playTrack(track)"
            class="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <img 
              :src="track.album.images[0]?.url" 
              :alt="track.name"
              class="w-full aspect-square object-cover rounded-md mb-4"
            >
            <h3 class="text-white font-medium truncate">{{ track.name }}</h3>
            <p class="text-gray-400 text-sm truncate">{{ track.artists[0].name }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSpotifyApi } from '~/composables/useSpotifyApi'
import { usePlayerStore } from '~/stores/player'
import { usePlaylistStore } from '~/stores/playlist'
import { useAuthStore } from '~/stores/auth'
// import { navigateTo } from '~/utils/router'
// import { PlusIcon } from '~/components/icons'


const { getFeaturedPlaylists, getRecommendations } = useSpotifyApi()
const playerStore = usePlayerStore()

const playlistStore = usePlaylistStore()


const loading = ref(true)
const featuredPlaylists = ref([])
const recommendations = ref([])

const isInUserLibrary = (playlistId) => {
  return playlistStore.userPlaylists.some(p => p.id === playlistId)
}

const addToLibrary = async (playlist) => {
  // Create a new playlist with the same name and description
  const newPlaylist = await playlistStore.createPlaylist(
    playlist.name,
    playlist.description
  )

  // Copy tracks from featured playlist to new playlist
  const response = await fetch(`${playlist.tracks.href}`, {
    headers: {
      'Authorization': `Bearer ${authStore.token}`
    }
  })
  const data = await response.json()
  
  const trackUris = data.items.map(item => item.track.uri)
  await playlistStore.addToPlaylist(newPlaylist.id, trackUris)
}

const fetchData = async () => {
  try {
    const [playlistsData, recommendationsData] = await Promise.all([
      getFeaturedPlaylists(),
      getRecommendations()
    ])
    
    featuredPlaylists.value = playlistsData.playlists.items
    recommendations.value = recommendationsData.tracks
  } catch (error) {
    console.error('Error fetching home data:', error)
  } finally {
    loading.value = false
  }
}

const navigateToPlaylist = (id) => {
  navigateTo(`/playlist/${id}`)
}

const playTrack = (track) => {
  playerStore.setTrack(track.uri)
}

onMounted(() => {
  fetchData()
})
</script>