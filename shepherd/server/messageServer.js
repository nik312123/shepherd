let admin = require('firebase-admin');
let serviceAccount = require("./shepherd-be6df-firebase-adminsdk-g53dz-efd58d9b21.json");


let app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})
let messaging = app.messaging();
let db = app.firestore();

const sendNotifications = (messages, docIds) => {
    messaging.sendAll(messages)
        .then((response) => {
            console.log('Successfully sent message:', JSON.stringify(response));
            if(response.failureCount === 0) {
               docIds.forEach(docId => {
                   db.collection('notes').doc(docId).update({
                       notified: true
                   }).then(() => {
                       console.log("Notified for docId: ", docId);
                   }).catch((err) => {
                       console.log("Error updating docId: ", docId, err);
                   })
               });
            }
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}

db.collection("notes")
    .where("notified", "==", false)
    .where("reminderDateTime", "<=", new Date(Date.now()))
    .get()
    .then((querySnapshot) => {
        let messages = [];
        let docIds = [];
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let payload = {
                notification: {
                    title: "Reminder",
                    body: data.title,
                    image: "https://shepherd-be6df.firebaseapp.com/images/logo.png",
                },
                webpush: {
                    fcmOptions: {
                        link: "https://shepherd-be6df.firebaseapp.com/notes/" + data.id
                    }
                },
                token: data.messageToken
            };
            docIds.push(doc.id);
            messages.push(payload);
        });
        if(messages.length > 0) {
            sendNotifications(messages, docIds);
        } else {
            console.log("No messages to send");
        }
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });