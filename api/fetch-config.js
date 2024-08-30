import kv from '@vercel/kv';

export default async function handler(req, res) {
    try {
        const firebaseConfig = {
            apiKey: await kv.get("FIREBASE_API_KEY"),
            authDomain: await kv.get("FIREBASE_AUTH_DOMAIN"),
            projectId: await kv.get("FIREBASE_PROJECT_ID"),
            storageBucket: await kv.get("FIREBASE_STORAGE_BUCKET"),
            messagingSenderId: await kv.get("FIREBASE_MESSAGING_SENDER_ID"),
            appId: await kv.get("FIREBASE_APP_ID"),
            measurementId: await kv.get("FIREBASE_MEASUREMENT_ID")
        };
        res.status(200).json(firebaseConfig);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Firebase configuration' });
    }
}

