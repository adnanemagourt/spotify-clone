<template>
  <div 
    v-if="show"
    class="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
  >
    Added to queue
  </div>
</template>

<script setup>
const props = defineProps({
  show: Boolean
})
</script>