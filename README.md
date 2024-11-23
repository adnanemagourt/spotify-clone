# Spotify Clone

This project is a Spotify clone built with Nuxt.js, and TailwindCSS. It allows users to browse featured playlists, get recommendations, and manage their own playlists.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
BASE_URL=your_base_url
```

## Project Structure

```
.env
.gitignore
.nuxt/
app.vue
assets/
components/
composables/
layouts/
middleware/
netlify.toml
nuxt.config.ts
package.json
pages/
public/
README.md
server/
stores/
tailwind.config.js
tsconfig.json
```

## Key Files and Directories

- `nuxt.config.ts`: Nuxt.js configuration file.
- `package.json`: Contains scripts and dependencies.
- `pages/`: Contains the Vue components for each page.
- `components/`: Contains reusable Vue components.
- `composables/`: Contains custom composable functions.
- `stores/`: Contains Pinia stores for state management.
- `layouts/`: Contains layout components.
- `middleware/`: Contains middleware for route handling.
- `assets/`: Contains static assets like CSS files.
- `public/`: Contains public assets.
- `server/`: Contains server-side code.
- `tailwind.config.js`: TailwindCSS configuration file.

## Features

- **Featured Playlists**: Browse featured playlists.
- **Recommendations**: Get track recommendations.
- **User Playlists**: Create, delete, and manage your own playlists.
- **Player**: Play tracks with a custom player.

## Usage

### Fetching User Playlists

The `usePlaylistStore` store provides methods to fetch and manage user playlists.

```js
const playlistStore = usePlaylistStore()
await playlistStore.fetchUserPlaylists()
```

### Playing Tracks

The `usePlayerStore` store provides methods to control the player.

```js
const playerStore = usePlayerStore()
playerStore.playTrack(trackUri)
```

### Spotify API

The `useSpotifyApi` composable provides methods to interact with the Spotify API.

```js
const { getFeaturedPlaylists, getRecommendations } = useSpotifyApi()
const playlists = await getFeaturedPlaylists()
const recommendations = await getRecommendations()
```

## Deployment

This project is configured to be deployed on Netlify. The `netlify.toml` file contains the necessary configuration.

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20.15.1"

[[redirects]]
  from = "/callback"
  to = "/index.html"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  framework = "nuxt"
```

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

This project is licensed under the MIT License.
