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

async function fetchAndDisplayImages() {
    try {
        if (!db) {
            throw new Error("Firestore DB is not initialized");
        }

        const collectionRef = db.collection('history');
        const querySnapshot = await collectionRef.get();

        if (querySnapshot.empty) {
            console.warn('No documents found in the "history" collection');
            return;
        }

        const docs = querySnapshot.docs;
        for (let i = 0; i < docs.length; i++) {
            const doc = docs[i];
            const imagePath = doc.data().image;
            const imageRef = storage.refFromURL(imagePath);
            const imageUrl = await imageRef.getDownloadURL();
            const text = doc.data().about;
            const header = doc.data().header;
            const events = doc.data().events;
            const eventdetails = doc.data().eventdetails;

            displayImage(`img${i + 1}`, imageUrl);
            displayImage1(`day${i + 1}Image`, imageUrl);
            displayText(`card-text${i + 1}`, text);
            displayHeader(`header${i + 1}`, header);
            displayEvents(`events${i + 1}`, `eventdetails${i + 1}`, events, eventdetails);
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


function displayImage1(imgElementId1, imageUrl) {
    const imgElement = document.getElementById(imgElementId1);
    if (imgElement) {
        imgElement.src = imageUrl;
        imgElement.alt = `Image for ${imgElementId1}`;
    } else {
        console.error(`No element found with ID: ${imgElementId1}`);
    }
}


function displayText(textElementId, text) {
    const textElement = document.getElementById(textElementId);
    if (textElement) {
        textElement.textContent = text;
    } else {
        console.error(`No element found with ID: ${textElementId}`);
    }
}


function displayHeader(headerElementId, head) {
    const headerElement = document.getElementById(headerElementId);
    if (headerElement) {
        headerElement.textContent = head;
    } else {
        console.error(`No element found with ID: ${headerElementId}`);
    }
}


function displayEvents(eventsElementId, eventdetailsElementId, events, eventdetails) {
    const eventsElement = document.getElementById(eventsElementId);
    const eventdetailsElement = document.getElementById(eventdetailsElementId);
    
    if (eventsElement) {
        eventsElement.textContent = events;
    } else {
        console.error(`No element found with ID: ${eventsElementId}`);
    }
    
    if (eventdetailsElement) {
        eventdetailsElement.textContent = eventdetails;
    } else {
        console.error(`No element found with ID: ${eventdetailsElementId}`);
    }
}


async function initializeAppAndFetchImages() {
    await initializeApp();
    await fetchAndDisplayImages();
}

document.addEventListener('DOMContentLoaded', initializeAppAndFetchImages);
