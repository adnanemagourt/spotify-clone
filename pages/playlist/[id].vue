<template>
  <div class="p-6">
    <div v-if="loading" class="text-white">
      Loading playlist...
    </div>

    <div v-else-if="playlist" class="space-y-6">
      <!-- Playlist Header -->
      <div class="flex items-end space-x-6">
        <img 
          :src="playlist.images[0]?.url" 
          :alt="playlist.name"
          class="w-60 h-60 shadow-lg object-cover"
        >
        <div>
          <p class="text-sm text-white uppercase font-bold">Playlist</p>
          <h1 class="text-5xl font-bold text-white mt-2 mb-4">{{ playlist.name }}</h1>
          <p class="text-gray-400">{{ playlist.description }}</p>
          <p class="text-gray-400 mt-2">
            {{ playlist.owner.display_name }} • {{ playlist.tracks.total }} songs
          </p>
        </div>
      </div>

      <!-- Playlist Tracks -->
      <div class="space-y-2">
        <div 
          v-for="(item, index) in playlist.tracks.items" 
          :key="item.track.id"
          class="flex items-center p-4 hover:bg-gray-800 rounded-lg cursor-pointer group"
        >
          <div class="w-8 text-gray-400 text-right mr-4">{{ index + 1 }}</div>
          <img 
            :src="item.track.album.images[2]?.url" 
            :alt="item.track.album.name"
            class="w-12 h-12 rounded mr-4"
          >
          <div class="flex-1">
            <h3 class="text-white font-medium">{{ item.track.name }}</h3>
            <p class="text-gray-400 text-sm">{{ item.track.artists[0].name }}</p>
          </div>
          <div class="flex items-center space-x-3">
            <button 
              @click="playTrack(item.track)"
              class="p-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
            >
              <PlayIcon class="w-5 h-5" />
            </button>
            <button 
              @click="removeFromPlaylist(item.track)"
              class="p-2 text-red-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PlayIcon, TrashIcon } from '@heroicons/vue/solid'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '~/stores/player'
import { usePlaylistStore } from '~/stores/playlist'

const route = useRoute()
const playerStore = usePlayerStore()
const playlistStore = usePlaylistStore()

const loading = ref(true)
const playlist = ref(null)

const fetchPlaylist = async () => {
  try {
    playlist.value = await playlistStore.getPlaylist(route.params.id)
  } catch (error) {
    console.error('Error fetching playlist:', error)
  } finally {
    loading.value = false
  }
}

const playTrack = (track) => {
  playerStore.setTrack(track.uri)
}

const removeFromPlaylist = async (track) => {
  if (confirm('Remove this song from playlist?')) {
    await playlistStore.removeFromPlaylist(playlist.value.id, track.uri)
    await fetchPlaylist() // Refresh playlist after removal
  }
}

onMounted(() => {
  fetchPlaylist()
})
</script>