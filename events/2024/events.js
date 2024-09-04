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

async function getFirebaseConfig(token, configEndpoint) {
    const response = await fetch(`https://backend-server-black.vercel.app/api/${configEndpoint}`, {
        headers: {
            'Authorization': token
        }
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

let db, db1, auth, storage;

async function initializeApp() {
    try {
        const token = await getToken();

        const config1 = await getFirebaseConfig(token, 'firebase-config');
        const app = firebase.initializeApp(config1, "app");
        db = app.firestore();
        storage = app.storage();

    
        const config2 = await getFirebaseConfig(token, 'firebase-config?configType=config1');
        const app1 = firebase.initializeApp(config2, "app1");
        db1 = app1.firestore();
        auth = app1.auth();  

        console.log("Both Firebase apps initialized successfully");

    
        fetchAndDisplayImages();
        document.dispatchEvent(new Event('firebaseInitialized'));

    } catch (error) {
        console.error("Error initializing apps:", error);
    }
}

initializeApp();

async function fetchAndDisplayImages() {
    try {
        if (!db || !storage) {
            throw new Error("Firebase is not initialized properly.");
        }

        const collectionRef = db.collection('images');
        const querySnapshot = await collectionRef.get();
        const docs = querySnapshot.docs;

        docs.forEach(async (doc, i) => {
            const imagePath = doc.data().image;
            const imageRef = storage.refFromURL(imagePath);
            const imageUrl = await imageRef.getDownloadURL();
            const text = doc.data().about;
            const header = doc.data().name;

            displayImage(`day${i + 1}Image`, imageUrl);
            displayHeader(`header${i + 1}`, header);
        });

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



function displayHeader(headerElementId, head) {
    const headerElement = document.getElementById(headerElementId);
    if (headerElement) {
        headerElement.textContent = head;
        console.info("done")
    } else {
        console.error(`No element found with ID: ${headerElementId}`);
    }
}

function displayEvents(eventsElementId, eventdetailsElementId, events, eventdetails) {
    const eventsdetailsElement = document.getElementById(eventsElementId);
    const eventsElement = document.getElementById(eventdetailsElementId);
    if (eventsElement) {
        eventsdetailsElement.textContent = eventdetails;
        console.info("done");
    } else {
        console.error(`No element found with ID: ${eventdetailsElementId}`);
    }
    if (eventsdetailsElement) {
        eventsElement.textContent = events;
        console.info("done");
    } else {
        console.error(`No element found with ID: ${eventsElementId}`);
    }
}


