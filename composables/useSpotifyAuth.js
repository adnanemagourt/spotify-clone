export const useSpotifyAuth = () => {
  const config = useRuntimeConfig()
  
  const spotifyConfig = {
    clientId: config.public.SPOTIFY_CLIENT_ID,
    clientSecret: config.public.SPOTIFY_CLIENT_SECRET,
    redirectUri: `http://localhost:3000/callback`,
    scope: [
      'streaming',
      'user-read-private',
      'user-read-email',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
      'user-library-read',
      'user-library-modify',
      'user-read-playback-state',
      'user-modify-playback-state',
      'app-remote-control',
      'user-read-currently-playing'
    ].join(' ')
  }

  const login = () => {
    const params = new URLSearchParams({
      client_id: spotifyConfig.clientId,
      response_type: 'code',
      redirect_uri: spotifyConfig.redirectUri,
      scope: spotifyConfig.scope,
      show_dialog: true
    })
    
    window.location.href = `https://accounts.spotify.com/authorize?${params}`
  }

  const getAccessToken = async (code) => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(spotifyConfig.clientId + ':' + spotifyConfig.clientSecret)
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: spotifyConfig.redirectUri
        })
      })

      return await response.json()
    } catch (error) {
      console.error('Error getting access token:', error)
      return null
    }
  }

  return {
    login,
    getAccessToken
  }
}