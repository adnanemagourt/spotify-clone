<template>
  <div class="flex h-screen bg-black">
    <!-- Sidebar -->
    <nav class="w-64 bg-black border-r border-gray-800 hidden md:block">
      <div class="p-6">
        <img src="/spotify-logo.svg" alt="Spotify" class="w-32">
        <div class="mt-8 space-y-4">
          <NuxtLink 
            to="/" 
            class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
            :class="{ 'bg-gray-800 text-white': route.path === '/' }"
          >
            <HomeIcon class="w-6 h-6 mr-3" />
            <span>Home</span>
          </NuxtLink>
          <NuxtLink 
            to="/search" 
            class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
            :class="{ 'bg-gray-800 text-white': route.path === '/search' }"
          >
            <SearchIcon class="w-6 h-6 mr-3" />
            <span>Search</span>
          </NuxtLink>
          <NuxtLink 
            to="/library" 
            class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
            :class="{ 'bg-gray-800 text-white': route.path === '/library' }"
          >
            <LibraryIcon class="w-6 h-6 mr-3" />
            <span>Your Library</span>
          </NuxtLink>
          <!-- <NuxtLink 
            to="/queue" 
            class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
            :class="{ 'bg-gray-800 text-white': route.path === '/queue' }"
          >
            <ListIcon class="w-6 h-6 mr-3" />
            <span>Queue</span>
          </NuxtLink> -->
          <NuxtLink 
            to="/profile" 
            class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
            :class="{ 'bg-gray-800 text-white': route.path === '/profile' }"
          >
            <UserIcon class="w-6 h-6 mr-3" />
            <span>Profile</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
 
    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-4 md:px-8">
        <div class="md:hidden">
          <button @click="toggleSidebar" class="text-white">
            <MenuIcon class="w-6 h-6" />
          </button>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            v-if="authStore.isLoggedIn" 
            @click="logout" 
            class="text-white hover:text-gray-300 transition"
          >
            Logout
          </button>
          <NuxtLink 
            v-else 
            to="/login" 
            class="text-white hover:text-gray-300 transition"
          >
            Login
          </NuxtLink>
        </div>
      </header>
 
      <!-- Content -->
      <main class="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
        <slot />
      </main>
 
      <!-- Player -->
      <footer class="h-20 bg-black border-t border-gray-800">
        <div class="flex items-center justify-between px-4 h-full">
          <!-- Track Info --> 
          <div class="w-1/3 flex items-center space-x-4" v-if="playerStore.currentTrack">
            <img 
              :src="playerStore.currentTrack.album.images[2]?.url" 
              :alt="playerStore.currentTrack.name"
              class="w-14 h-14 rounded"
            >
            <div>
              <div class="text-white text-sm">{{ playerStore.currentTrack.name }}</div>
              <div class="text-gray-400 text-xs">{{ playerStore.currentTrack.artists[0].name }}</div>
            </div>
          </div>
          <div v-else class="w-1/3">
            <div class="w-14 h-14 bg-gray-800 rounded"></div>
          </div>
 
          <!-- Player Controls -->
          <div class="w-1/3 flex flex-col items-center">
            <div class="flex items-center space-x-4">
              <button 
                @click="playerStore.previousTrack"
                class="text-gray-400 hover:text-white transition"
              >
                <BackwardIcon class="w-5 h-5" />
              </button>
              <button 
                @click="playerStore.togglePlay"
                class="text-white p-2 rounded-full bg-white hover:bg-gray-200 transition"
              >
                <component 
                  :is="playerStore.isPlaying ? PauseIcon : PlayIcon" 
                  class="w-6 h-6 text-black"
                />
              </button>
              <button 
                @click="playerStore.nextTrack"
                class="text-gray-400 hover:text-white transition"
              >
                <ForwardIcon class="w-5 h-5" />
              </button>
            </div>
            <div class="w-full mt-2 flex items-center space-x-2">
              <span class="text-xs text-gray-400">{{ formatTime(playerStore.progress) }}</span>
              <div class="flex-1 h-1 bg-gray-800 rounded-full">
                <div 
                  class="h-full bg-white rounded-full"
                  :style="{ width: `${(playerStore.progress / playerStore.duration) * 100}%` }"
                ></div>
              </div>
              <span class="text-xs text-gray-400">{{ formatTime(playerStore.duration) }}</span>
            </div>
          </div>
 
          <!-- Volume Control -->
          <div class="w-1/3 flex justify-end items-center space-x-2">
            <VolumeIcon class="w-5 h-5 text-gray-400" />
            <div class="w-24 h-1 bg-gray-800 rounded-full">
              <div 
                class="h-full bg-white rounded-full"
                :style="{ width: `${playerStore.volume * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
 
    <!-- Mobile Sidebar -->
    <div 
      v-if="showMobileSidebar" 
      class="fixed inset-0 bg-black bg-opacity-50 md:hidden"
      @click="toggleSidebar"
    >
      <div 
        class="w-64 h-full bg-black"
        @click.stop
      >
        <div class="p-6">
          <div class="flex justify-between items-center">
            <img src="/spotify-logo.svg" alt="Spotify" class="w-32">
            <button @click="toggleSidebar" class="text-white">
              <XIcon class="w-6 h-6" />
            </button>
          </div>
          <div class="mt-8 space-y-4">
            <NuxtLink 
              to="/" 
              class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
              :class="{ 'bg-gray-800 text-white': route.path === '/' }"
              @click="toggleSidebar"
            >
              <HomeIcon class="w-6 h-6 mr-3" />
              <span>Home</span>
            </NuxtLink>
            <NuxtLink 
              to="/search" 
              class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
              :class="{ 'bg-gray-800 text-white': route.path === '/search' }"
              @click="toggleSidebar"
            >
              <SearchIcon class="w-6 h-6 mr-3" />
              <span>Search</span>
            </NuxtLink>
            <NuxtLink 
              to="/library" 
              class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
              :class="{ 'bg-gray-800 text-white': route.path === '/library' }"
              @click="toggleSidebar"
            >
              <LibraryIcon class="w-6 h-6 mr-3" />
              <span>Your Library</span>
            </NuxtLink>
            <!-- <NuxtLink 
              to="/queue" 
              class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
              :class="{ 'bg-gray-800 text-white': route.path === '/queue' }"
            >
              <ListIcon class="w-6 h-6 mr-3" />
              <span>Queue</span>
            </NuxtLink> -->
            <NuxtLink 
              to="/profile" 
              class="flex items-center text-gray-300 hover:text-white p-2 rounded transition"
              :class="{ 'bg-gray-800 text-white': route.path === '/profile' }"
            >
              <UserIcon class="w-6 h-6 mr-3" />
              <span>Profile</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
 </template>
 
 <script setup>
 import { ref, computed, onMounted } from 'vue'
 import { 
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlayIcon,
  PauseIcon,
  ArrowLeftIcon as BackwardIcon,
  ArrowRightIcon as ForwardIcon,
  VolumeUpIcon as VolumeIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  ViewListIcon as ListIcon  // Changed this line
} from '@heroicons/vue/solid'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { usePlayerStore } from '~/stores/player'
 
 const route = useRoute()
 const authStore = useAuthStore()
 const playerStore = usePlayerStore()
 const showMobileSidebar = ref(false)
 
 const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = ((ms % 60000) / 1000).toFixed(0)
  return `${minutes}:${seconds.padStart(2, '0')}`
 }
 
 const toggleSidebar = () => {
  showMobileSidebar.value = !showMobileSidebar.value
 }
 
 const logout = () => {
  authStore.clearAuth()
  navigateTo('/login')
 }
 
 onMounted(async () => {
  if (authStore.token) {
    await new Promise(resolve => {
      const script = document.createElement('script')
      script.src = 'https://sdk.scdn.co/spotify-player.js'
      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          playerStore.initializePlayer(authStore.token)
          resolve()
        }
      }
      document.body.appendChild(script)
    })
  }
 })
</script>