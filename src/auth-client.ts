import { SPOTIFY_CONFIG } from './config';

const { CLIENT_ID } = SPOTIFY_CONFIG;

export const refreshTokens = async (
  refreshToken: string
): Promise<{ access_token: string; expires_in: number } | null> => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      access_token: data.access_token,
      expires_in: data.expires_in,
    };
  } catch (error) {
    return null;
  }
};
