
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-white mb-6">Queue</h1>
    
    <!-- Current Track -->
    <div v-if="playerStore.currentTrack" class="mb-8">
      <h2 class="text-lg font-semibold text-white mb-4">Now Playing</h2>
      <div class="flex items-center p-4 bg-gray-900 rounded-lg">
        <img 
          :src="playerStore.currentTrack.album.images[2]?.url" 
          :alt="playerStore.currentTrack.name"
          class="w-16 h-16 rounded mr-4"
        >
        <div>
          <h3 class="text-white font-medium">{{ playerStore.currentTrack.name }}</h3>
          <p class="text-gray-400">{{ playerStore.currentTrack.artists[0].name }}</p>
        </div>
      </div>
    </div>

    <!-- Queue -->
    <div v-if="playerStore.queue.length">
      <h2 class="text-lg font-semibold text-white mb-4">Next in Queue</h2>
      <div class="space-y-2">
        <div 
          v-for="(track, index) in playerStore.queue" 
          :key="index"
          class="flex items-center justify-between p-4 bg-gray-900 hover:bg-gray-800 rounded-lg group"
        >
          <div class="flex items-center flex-1">
            <img 
              :src="track.album.images[2]?.url" 
              :alt="track.name"
              class="w-12 h-12 rounded mr-4"
            >
            <div>
              <h3 class="text-white font-medium">{{ track.name }}</h3>
              <p class="text-gray-400 text-sm">{{ track.artists[0].name }}</p>
            </div>
          </div>
          <button 
            @click="removeFromQueue(index)"
            class="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
          >
            <XIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <div v-else class="text-gray-400">
      No tracks in queue
    </div>
  </div>
</template>

<script setup>
import { XIcon } from '@heroicons/vue/solid'
const playerStore = usePlayerStore()

const removeFromQueue = (index) => {
  playerStore.removeFromQueue(index)
}
</script>