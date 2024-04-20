import admin from 'firebase-admin';
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { config } from 'dotenv';

config();

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY.toString());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const db = getFirestore();
export const auth = getAuth();

export const checkUserRecord = async (email) => {
    try {
        const userRecord = await auth.getUserByEmail(email);
        return userRecord;
    } 
    catch (error) {
        console.log(error.message);
        return error.code;
    }
};

export const createFbToken = async (uid) => {
    try {
        const customToken = await auth.createCustomToken(uid);
        return customToken;
    }
    catch (error) {
        console.error(error.message);
        return null;
    }
};

export const updateTokens = async (email, refreshToken, accessToken, updateRefresh = true) => {
    try {
        const userRef = db.collection('Users').doc(email);
        const user = await userRef.get();
        if (!user.exists) {
            await userRef.set({
                refresh_Token: refreshToken,
                access_Token: accessToken,
                token_expiration: Date.now() + 3600 * 1000,
            });
        }
        else {
            if (updateRefresh) {
                await userRef.update({
                    refresh_Token: refreshToken,
                    access_Token: accessToken,
                    token_expiration: Date.now() + 3600 * 1000,
                });
            } else {
                await userRef.update({
                    access_Token: accessToken,
                    token_expiration: Date.now() + 3600 * 1000,
                });
            }
        }
        console.log('Tokens updated successfully for user', email);
    }
    catch (error) {
        console.error(`Error updating tokens for user ${email}: ${error.message}`);
    }
};

export const getTokens = async (email) => {
    try {
        const userRef = db.collection('Users').doc(email);
        const userDoc = await userRef.get();
        if (userDoc.exists) {
            const { refresh_Token, access_Token, token_expiration } = userDoc.data();
            return { refresh_Token, access_Token, token_expiration };
        } else {
            console.log('User document not found');
            return null;
        }
    } catch (error) {
        console.error(`Error getting tokens for user ${email}: ${error.message}`);
        return null;
    }
};