# Electron Spotify App

A desktop Spotify client built with Electron, React, and TypeScript.

## Setup

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager
- A Spotify Developer Account

### Environment Configuration

1. Create a `.env` file in the project root:

```bash
# Development environment
NODE_ENV=development

# Spotify API Configuration
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

2. Get your Spotify Client ID:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app or use an existing one
   - Copy the Client ID and paste it in your `.env` file
   - Add `http://localhost:5173/callback` to your app's Redirect URIs

### Installation

1. Install dependencies:

```bash
yarn install
```

2. Start the development server:

```bash
yarn start
```

## Features

- Spotify OAuth authentication
- View user profile and playlists
- Display top tracks and artists with time period filtering
- Recently played tracks
- Modern UI with Mantine components
- Responsive design

## Development

The app is built with:

- **Electron**: Desktop app framework
- **React**: UI library
- **TypeScript**: Type safety
- **Redux Toolkit**: State management
- **Mantine**: UI components
- **Vite**: Build tool

## Security

- Environment variables are used for sensitive configuration
- Never commit your `.env` file to version control
- The `.env` file is already added to `.gitignore`
