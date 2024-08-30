import kv from '@vercel/kv';

export default async function handler(req, res) {
    try {
        // Define allowed origin
        const allowedOrigin = 'https://amritacybernation.com';

        // Check if the request origin matches the allowed origin
        if (req.headers.origin !== allowedOrigin) {
            res.status(403).json({ error: 'Forbidden' });
            return;
        }

        // Add CORS headers to the response
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle preflight OPTIONS request
        if (req.method === 'OPTIONS') {
            res.status(204).end();
            return;
        }

        // Fetch Firebase configuration
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

