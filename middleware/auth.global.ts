export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // Allow access to login and callback pages
  if (to.path === '/login' || to.path === '/callback') {
    return
  }

  // If not logged in, redirect to login
  if (!authStore.isLoggedIn) {
    return navigateTo('/login')
  }
})