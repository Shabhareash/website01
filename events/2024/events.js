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

let db, db1, auth1, storage;

async function initializeApp() {
    try {
        const token = await getToken();

        // Fetch and initialize the first Firebase app
        const config1 = await getFirebaseConfig(token, 'firebase-config');
        const app = firebase.initializeApp(config1, "app");
        db = app.firestore();
        storage = app.storage();

        // Fetch and initialize the second Firebase app
        const config2 = await getFirebaseConfig(token, 'firebase-config1');
        const app1 = firebase.initializeApp(config2, "app1");
        db1 = app1.firestore();
        auth1 = app1.auth();

        console.log("Both Firebase apps initialized successfully");
    } catch (error) {
        console.error("Error initializing apps:", error);
    }
}

initializeApp();

function updateFirebaseDocument(collection, document, data) {
    return db.collection(collection).doc(document).set(data, { merge: true });
}

async function fetchAndDisplayImages() {
    try {
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
            displayText(`card-text${i + 1}`, text);
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

function displayText(textElementId, text) {
    const textElement = document.getElementById(textElementId);
    if (textElement) {
        textElement.textContent = text;
        console.info("done")
    } else {
        console.error(`No element found with ID: ${textElementId}`);
    }
}

function displayHeader(headerElementId, head){
    const headerElement = document.getElementById(headerElementId);
    if(headerElement){
        headerElement.textContent = head;
        console.info("done")
    } else{
        console.error(`No element found with ID: ${headerElementId}`);
    }
}

function displayEvents(eventsElementId,eventdetailsElementId, events,eventdetails){
    const eventsdetailsElement = document.getElementById(eventsElementId);
    const eventsElement = document.getElementById(eventdetailsElementId);
    if(eventsElement){
        eventsdetailsElement.textContent = eventdetails;
        console.info("done")
    } else{
        console.error(`No element found with ID: ${eventdetailsElementId}`);
    }
    if(eventsdetailsElement){
        eventsElement.textContent = events;
        console.info("done")
    } else{
        console.error(`No element found with ID: ${eventsElementId}`);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayImages);