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
    const response = await fetch('https://backend-server-black.vercel.app/api/firebase-config', {
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

async function initializeApp() {
    try {
        const token = await getToken();
        const config = await getFirebaseConfig(token);
        firebase.initializeApp(config);
        db = firebase.firestore();
        const storage = firebase.storage();
        
        console.log("Firebase and Firestore initialized successfully");
    } catch (error) {
        console.error("Error initializing app:", error);
    }
}

initializeApp();

function updateFirebaseDocument(collection, document, data) {
    return db.collection(collection).doc(document).set(data, { merge: true });
}
async function fetchAndDisplayImages() {
    try {
        const collectionRef = db.collection('2022');
        const querySnapshot = await collectionRef.get();
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


document.addEventListener('DOMContentLoaded', fetchAndDisplayImages);
