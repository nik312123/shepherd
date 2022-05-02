const admin = require('firebase-admin');
const serviceAccount = require('./shepherd-be6df-firebase-adminsdk-g53dz-efd58d9b21.json');

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const messaging = app.messaging();
const db = app.firestore();

const sendNotifications = (messages, docIds) => {
    messaging.sendAll(messages)
        .then((response) => {
            console.log('Message status', JSON.stringify(response));
            response.responses.forEach((response, index) => {
                if(response.success) {
                    db.collection('notes').doc(docIds[index]).update({
                        'notified': true
                    }).then(() => {
                        console.log('Notified for docId: ', docIds[index]);
                    }).catch((err) => {
                        console.log('Error updating docId: ', docIds[index], err);
                    });
                }
                else {
                    console.log('Error sending message: ', docIds[index], JSON.stringify(response.error));
                }
            });
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
};

db.collection('notes')
    .where('notified', '==', false)
    .where('reminderDateTime', '<=', new Date(Date.now()))
    .where('isTrash', '==', false)
    .get()
    .then((querySnapshot) => {
        const messages = [];
        const docIds = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const payload = {
                notification: {
                    title: data.title,
                    body: data.body.length > 50 ? data.body.substring(0, 50) + '...' : data.body
                },
                webpush: {
                    fcmOptions: {
                        link: 'https://shepherd-be6df.firebaseapp.com/note/' + data.id
                    }
                },
                data: {
                    noteId: doc.id
                },
                token: data.messageToken
            };
            docIds.push(doc.id);
            messages.push(payload);
        });
        if(messages.length > 0) {
            sendNotifications(messages, docIds);
        }
        else {
            console.log('No messages to send');
        }
    })
    .catch((error) => {
        console.log('Error getting documents: ', error);
    });
