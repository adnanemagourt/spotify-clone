export const useSpotifyAuth = () => {
  const config = useRuntimeConfig()
  
  const spotifyConfig = {
    // clientId: config.public.SPOTIFY_CLIENT_ID,
    clientId: "d73dc5ebc3994ac3b57cf655fce8f0aa",
    // clientSecret: config.public.SPOTIFY_CLIENT_SECRET,
    clientSecret: "d41f1561a2dd4ba9a7e8712e5b53ef44",
    redirectUri: `https://spotify-clone-23-11.netlify.app/callback`,
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

  const getAuthUrl = () => {
    const params = new URLSearchParams({
      client_id: spotifyConfig.clientId,
      response_type: 'code',
      redirect_uri: spotifyConfig.redirectUri,
      scope: spotifyConfig.scope
    })
    return `https://accounts.spotify.com/authorize?${params.toString()}`
  }

  return {
    login,
    getAccessToken,
    getAuthUrl
  }
}