async function getToken() {
    const response = await fetch('https://backend-server-black.vercel.app/api/get-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.token;
}

async function getFirebaseConfig(token) {
    const response = await fetch('https://backend-server-black.vercel.app/api/firebase-config?configType=config1', {
        headers: {
            'Authorization': token
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

let db;
let storage;

async function initializeApp() {
    try {
        const token = await getToken();
        const config = await getFirebaseConfig(token);
        firebase.initializeApp(config);
        db = firebase.firestore();
        storage = firebase.storage();
        
        console.log("Firebase and Firestore initialized successfully");
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

initializeApp();


async function fetchAndDisplayImages() {
    try {
        if (!db) {
            throw new Error("Firestore DB is not initialized");
        }
        const collectionRef = db.collection('2022');
        const querySnapshot = await collectionRef.get();

        if (querySnapshot.empty) {
            console.warn('No documents found in the "history" collection');
            return;
        }
        const docs = querySnapshot.docs;
        for (let i = 0; i < docs.length; i++) {
            if (i < docs.length) {
                const doc = docs[i];
                const imagePath = doc.data().image;
                const imageRef = storage.refFromURL(imagePath);
                const imageUrl = await imageRef.getDownloadURL();
                displayImage(`img${i + 1}`, imageUrl);
            } else {
                console.warn(`No document available for day${i + 1}Image`);
            }
        }
    } catch (error) {
        console.error('Error fetching and displaying images:', error);
    }
}

function displayImage(imgElementId, imageUrl) {
    const imgElement = document.getElementById(imgElementId);
    if (imgElement) {
        imgElement.src = imageUrl;
        imgElement.alt = `Image for ${imgElementId}`;
    } else {
        console.error(`No element found with ID: ${imgElementId}`);
    }
}


async function initializeAppAndFetchImages() {
    await initializeApp();
    await fetchAndDisplayImages();
}

document.addEventListener('DOMContentLoaded', initializeAppAndFetchImages);
