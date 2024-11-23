<template>
  <div class="p-6">
    <div v-if="!authStore.user" class="text-white">
      Loading profile...
    </div>
    
    <div v-else class="max-w-4xl mx-auto">
      <!-- Profile Header -->
      <div class="flex items-center space-x-6 mb-8">
        <img 
          v-if="authStore.user.images?.[0]?.url"
          :src="authStore.user.images[0].url"
          :alt="authStore.user.display_name"
          class="w-40 h-40 rounded-full"
        >
        <div 
          v-else
          class="w-40 h-40 rounded-full bg-gray-800 flex items-center justify-center"
        >
          <UserIcon class="w-20 h-20 text-gray-600" />
        </div>
        
        <div>
          <p class="text-sm text-gray-400 uppercase font-bold">Profile</p>
          <h1 class="text-5xl font-bold text-white mt-2">
            {{ authStore.user.display_name }}
          </h1>
          <div class="mt-4 flex items-center text-gray-400">
            <div class="flex items-center">
              <MusicNoteIcon class="w-5 h-5 mr-2" />
              <span>{{ playlistCount }} Public Playlists</span>
            </div>
            <div class="mx-2">•</div>
            <div class="flex items-center">
              <UsersIcon class="w-5 h-5 mr-2" />
              <span>{{ authStore.user.followers?.total || 0 }} Followers</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="bg-gray-900 rounded-lg p-6 space-y-4">
        <div>
          <h2 class="text-sm text-gray-400 uppercase font-bold mb-2">
            Account Details
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-400">Username</p>
              <p class="text-white">{{ authStore.user.id }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Email</p>
              <p class="text-white">{{ authStore.user.email }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Country</p>
              <p class="text-white">{{ authStore.user.country }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-400">Product</p>
              <p class="text-white capitalize">{{ authStore.user.product }}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-sm text-gray-400 uppercase font-bold mb-4">
            Your Top Playlists
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div 
              v-for="playlist in userPlaylists.slice(0, 4)" 
              :key="playlist.id"
              class="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition"
            >
              <NuxtLink :to="`/playlist/${playlist.id}`">
                <img 
                  v-if="playlist.images?.[0]?.url"
                  :src="playlist.images[0].url"
                  :alt="playlist.name"
                  class="w-full aspect-square object-cover rounded-md mb-4"
                >
                <div 
                  v-else
                  class="w-full aspect-square bg-gray-700 rounded-md mb-4"
                ></div>
                <h3 class="text-white font-medium truncate">
                  {{ playlist.name }}
                </h3>
                <p class="text-gray-400 text-sm truncate">
                  {{ playlist.tracks.total }} tracks
                </p>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  UserIcon, 
  MusicNoteIcon, 
  UsersIcon 
} from '@heroicons/vue/solid'
import { ref, onMounted, computed } from 'vue'

const authStore = useAuthStore()
const playlistStore = usePlaylistStore()

const userPlaylists = computed(() => playlistStore.userPlaylists)
const playlistCount = computed(() => playlistStore.userPlaylists.length)

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUserProfile()
  }
  await playlistStore.fetchUserPlaylists()
})
</script>