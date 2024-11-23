<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-white">Your Library</h1>
      <button 
        @click="openCreateModal"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
      >
        Create Playlist
      </button>
    </div>

    <div v-if="playlistStore.loading" class="text-gray-400">
      Loading playlists...
    </div>

    <div 
      v-else-if="playlistStore.userPlaylists?.length" 
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <div 
        v-for="playlist in playlistStore.userPlaylists" 
        :key="playlist.id"
        class="bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition group"
      >
        <div class="relative">
          <div 
            v-if="playlist.images && playlist.images.length > 0"
            :style="{ backgroundImage: `url(${playlist.images[0].url})` }"
            class="w-full aspect-square bg-cover bg-center rounded-md mb-4"
          ></div>
          <div 
            v-else
            class="w-full aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-md mb-4 flex items-center justify-center"
          >
            <span class="text-gray-400">No Cover</span>
          </div>
          <button 
            @click.stop="deletePlaylist(playlist.id)"
            class="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <TrashIcon class="w-4 h-4 text-white" />
          </button>
        </div>
        <NuxtLink :to="`/playlist/${playlist.id}`" class="block">
          <h3 class="text-white font-medium truncate">{{ playlist.name }}</h3>
          <p class="text-gray-400 text-sm truncate">
            {{ playlist.tracks?.total || 0 }} tracks
          </p>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="text-gray-400">
      No playlists found. Create one to get started!
    </div>

    <!-- Create Playlist Modal -->
    <div 
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showCreateModal = false"
    >
      <div 
        class="bg-gray-900 p-6 rounded-lg w-96"
        @click.stop
      >
        <h2 class="text-xl font-bold text-white mb-4">Create New Playlist</h2>
        <input 
          v-model="newPlaylistName"
          type="text"
          placeholder="Playlist Name"
          class="w-full p-2 mb-4 bg-gray-800 text-white rounded"
        />
        <textarea 
          v-model="newPlaylistDescription"
          placeholder="Description"
          class="w-full p-2 mb-4 bg-gray-800 text-white rounded"
        ></textarea>
        <button 
          @click="createNewPlaylist"
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { TrashIcon } from '@heroicons/vue/solid'
import { usePlaylistStore } from '~/stores/playlist'

const playlistStore = usePlaylistStore()
const showCreateModal = ref(false)
const newPlaylistName = ref('')
const newPlaylistDescription = ref('')

onMounted(async () => {
  try {
    await playlistStore.fetchUserPlaylists()
    console.log('Playlists:', playlistStore.userPlaylists) // Debug log
  } catch (error) {
    console.error('Error loading playlists:', error)
  }
})

const openCreateModal = () => {
  console.log('Opening create modal') // Debug log
  showCreateModal.value = true
}

const createNewPlaylist = async () => {
  if (!newPlaylistName.value.trim()) return

  await playlistStore.createPlaylist(
    newPlaylistName.value,
    newPlaylistDescription.value
  )
  
  showCreateModal.value = false
  newPlaylistName.value = ''
  newPlaylistDescription.value = ''
}

const deletePlaylist = async (playlistId) => {
  if (confirm('Are you sure you want to delete this playlist?')) {
    await playlistStore.deletePlaylist(playlistId)
  }
}
</script>