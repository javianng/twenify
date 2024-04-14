import express from 'express';
import { google } from 'googleapis';
import { checkUserRecord, createFbToken, updateTokens, getTokens } from '../utils/firebase.js';
import axios from 'axios';
import { config } from 'dotenv';

config();

const router = express.Router();
const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URI
});

router.post('/authlink', (req, res) => {
    try {
        const scopes = [
            'profile',
            'email',
            'https://www.googleapis.com/auth/calendar.readonly'
        ];
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });
        res.json({ authLink: url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/login_redirect', async (req, res) => {
    try {
        const auth_code = req.query.code ? req.query.code.toString() : null;

        if (auth_code) {
            const { tokens } = await oauth2Client.getToken(auth_code);
            oauth2Client.setCredentials(tokens);
            const oauth2 = google.oauth2({
                auth: oauth2Client,
                version: 'v2'
            });

            const userInfo = await oauth2.userinfo.get();
            const userRecord = await checkUserRecord(userInfo.data.email);

            if (userRecord === 'auth/user-not-found') {
                res.status(404).json({ error: 'User not found' });
            } else {
                console.log('User exists', userRecord.uid);

                const fbToken = await createFbToken(userRecord.uid);
                await updateTokens(userInfo.data.email, tokens.refresh_token, tokens.access_token);
                res.redirect(`http://localhost:5173/calendarToDo?id_token=${fbToken}`);
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/refresh_token', async (req, res) => {
    try {
        const email = req.body.email;
        const tokens = await getTokens(email);

        if (tokens) {
            const refreshToken = tokens.refresh_Token;
            const response = await axios.post('https://oauth2.googleapis.com/token', {
                client_id: oauth2Client._clientId,
                client_secret: oauth2Client._clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            });

            const newAccessToken = response.data.access_token;
            const newExpirationTime = Date.now() + response.data.expires_in * 1000;

            await updateTokens(email, refreshToken, newAccessToken, newExpirationTime);

            // Set a timeout to automatically refresh the token before it expires
            setTimeout(async () => {
                try {
                    const newTokens = await refreshGoogleAccessToken(email);
                    await updateTokens(email, newTokens.refresh_token, newTokens.access_token, Date.now() + newTokens.expires_in * 1000);
                    console.log('Tokens refreshed automatically');
                } catch (error) {
                    console.error('Automatic token refresh failed:', error);
                }
            }, (newExpirationTime - Date.now()) - 5 * 60 * 1000); // Refresh 5 minutes before expiration

            res.json({ access_token: newAccessToken });
        } else {
            res.status(404).json({ error: 'Tokens not found' });
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Helper function to refresh Google access token
async function refreshGoogleAccessToken(email) {
    const tokens = await getTokens(email);
    const refreshToken = tokens.refresh_Token;
    const response = await axios.post('https://oauth2.googleapis.com/token', {
        client_id: oauth2Client._clientId,
        client_secret: oauth2Client._clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
    });
    return response.data;
}

export default router;