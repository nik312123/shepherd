import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import {auth, getMessagingToken} from '@/firebaseConfig';
import Notifications from 'vue-notification'
import {firestorePlugin} from 'vuefire';
import 'no-darkreader';
import '@/registerServiceWorker'

Vue.config.productionTip = false;

Vue.use(firestorePlugin);
Vue.use(Notifications);

// messaging.getToken({
//     vapidKey: "***REMOVED***"
// }).then(() => {
//     console.log("Token generated");
// }).catch((err) => {
//     console.log(err);
// });
console.log("Token: ", getMessagingToken());
let app;
auth.onAuthStateChanged(() => {
    if(!app) {
        new Vue({
            router,
            render: h => h(App)
        }).$mount('#app');
    }
});
