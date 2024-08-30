import kv from '@vercel/kv';

export default async function handler(req, res) {
    try {
        const firebaseConfig = {
            apiKey: await kv.get("FIREBASE_API_KEY"),
            authDomain: await kv.get("FIREBASE_AUTH_DOMAIN"),
            measurementId: await kv.get("FIREBASE_MEASUREMENT_ID"),
            appId: await kv.get("FIREBASE_APP_ID"),
            messagingSenderId: await kv.get("FIREBASE_MESSAGING_SENDER_ID"),
            storageBucket: await kv.get("FIREBASE_STORAGE_BUCKET"),
            projectId: await kv.get("FIREBASE_PROJECT_ID")
        };

        res.status(200).json(firebaseConfig);
    } catch (error) {
        console.error('Error fetching Firebase config:', error);
        res.status(500).json({ error: 'Failed to fetch Firebase configuration' });
    }
}
