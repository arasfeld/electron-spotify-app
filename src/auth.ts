import { BrowserWindow } from 'electron';

import { SPOTIFY_CONFIG } from './config';
import type { Tokens } from './types';

const { CLIENT_ID, REDIRECT_URI, SCOPES } = SPOTIFY_CONFIG;

export const authenticateSpotify = async (mainWindow: BrowserWindow) => {
  const authWindow = new BrowserWindow({
    width: 600,
    height: 800,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES.join(' '),
  });

  authWindow.loadURL(
    'https://accounts.spotify.com/authorize?' + params.toString()
  );

  authWindow.webContents.session.webRequest.onBeforeRequest(
    { urls: [REDIRECT_URI + '*'] },
    async ({ url }) => {
      const code = new URL(url).searchParams.get('code');

      if (code) {
        // close the browser window
        authWindow.close();

        // use the authorization code to get auth tokens
        const tokens = await getTokens(code, codeVerifier);

        // send the tokens back to the main window
        mainWindow.webContents.send('spotify-auth-callback', tokens);
      }
    }
  );
};

const getTokens = async (
  code: string,
  codeVerifier: string
): Promise<Tokens> => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return null;
  }
};

const generateRandomString = (length: number) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};
