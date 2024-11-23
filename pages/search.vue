<template>
  <div class="p-6">
    <div class="max-w-3xl mx-auto">
      <div class="relative">
        <input 
          type="text" 
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Search for songs, artists, or albums..."
          class="w-full px-4 py-3 bg-white bg-opacity-10 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-white"
        >
        <SearchIcon class="w-6 h-6 text-white absolute right-4 top-1/2 transform -translate-y-1/2" />
      </div>

      <div v-if="loading" class="mt-8 text-white">
        Searching...
      </div>

      <div v-else-if="searchResults.tracks?.items?.length" class="mt-8">
        <!-- Tracks -->
        <h2 class="text-xl font-bold text-white mb-4">Songs</h2>
        <div class="space-y-2">
          <div 
            v-for="track in searchResults.tracks.items" 
            :key="track.id"
            class="flex items-center p-4 hover:bg-gray-800 rounded-lg group"
          >
            <img 
              :src="track.album.images[2]?.url" 
              :alt="track.album.name"
              class="w-12 h-12 rounded mr-4"
            >
            <div class="flex-1">
              <h3 class="text-white font-medium">{{ track.name }}</h3>
              <p class="text-gray-400 text-sm">{{ track.artists[0].name }}</p>
            </div>
            <div class="flex items-center space-x-3">
              <button 
                @click="playTrack(track)"
                class="p-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
              >
                <PlayIcon class="w-5 h-5" />
              </button>
              <button 
                @click="showAddToPlaylistModal(track)"
                class="p-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
              >
                <PlusIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add to Playlist Modal -->
      <div 
        v-if="showPlaylistModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="showPlaylistModal = false"
      >
        <div 
          class="bg-gray-900 p-6 rounded-lg w-96"
          @click.stop
        >
          <h2 class="text-xl font-bold text-white mb-4">Add to Playlist</h2>
          <div class="max-h-96 overflow-y-auto">
            <button 
              v-for="playlist in playlistStore.userPlaylists"
              :key="playlist.id"
              @click="addToPlaylist(playlist.id)"
              class="w-full p-4 text-left hover:bg-gray-800 rounded transition flex items-center space-x-4"
            >
              <img 
                :src="playlist.images[0]?.url" 
                class="w-12 h-12 rounded"
                :alt="playlist.name"
              >
              <div>
                <p class="text-white font-medium">{{ playlist.name }}</p>
                <p class="text-gray-400 text-sm">{{ playlist.tracks.total }} tracks</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- No results found message -->
      <div v-else-if="searchQuery" class="mt-8 text-gray-400">
        No results found
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { SearchIcon, PlayIcon, PlusIcon } from '@heroicons/vue/solid'
import { debounce } from 'lodash'

const { search } = useSpotifyApi()
const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

const searchQuery = ref('')
const searchResults = ref({})
const loading = ref(false)
const showPlaylistModal = ref(false)
const selectedTrack = ref(null)

onMounted(() => {
  playlistStore.fetchUserPlaylists()
})

const handleSearch = debounce(async () => {
  if (!searchQuery.value) {
    searchResults.value = {}
    return
  }

  loading.value = true
  try {
    searchResults.value = await search(searchQuery.value)
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
  }
}, 300)

const showAddToPlaylistModal = (track) => {
  selectedTrack.value = track
  showPlaylistModal.value = true
}

const addToPlaylist = async (playlistId) => {
  if (!selectedTrack.value) return
  
  await playlistStore.addToPlaylist(playlistId, selectedTrack.value.uri)
  showPlaylistModal.value = false
  selectedTrack.value = null
}

const playTrack = (track) => {
  playerStore.playTrack(track.uri)
}
</script>
