import axios from 'axios';
import { getAuth, signInWithCustomToken, signOut } from 'firebase/auth';

const auth = getAuth();

const backend = axios.create({
    baseURL: 'http://localhost:8000',
});

export const getGoogleAuthLink = async () => {
    const response = await backend.post('/authlink')
        .then((res) => {
            return res.data;
        })
        .catch((error) => {
            console.error(`Error getting google auth link: ${error.message}`);
            return null;
        });
    return response?.authLink;
};

export const logInViaProvider = async (idToken) => {
    const response = await signInWithCustomToken(auth, idToken)
        .then(async (result) => {
            const user = result.user;
            return user;
        })
        .catch((error) => {
            console.error(`Error logging in via provider: ${error.message}`);
            return null;
        });
    return response;
};

export const revokeGoogleAccess = async (accessToken) => {
    try {
        await axios.get('https://accounts.google.com/o/oauth2/revoke', {
            params: { token: accessToken }
        });
        console.log('Google access revoked successfully');
    }
    catch(error) {
        console.error(`Error revoking google access: ${error.message}`);
    }
}