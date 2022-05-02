import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import {auth, messaging} from '@/firebaseConfig';
import Notifications from 'vue-notification';
import {firestorePlugin} from 'vuefire';
import 'no-darkreader';
import '@/registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(firestorePlugin);
Vue.use(Notifications);

if(messaging !== null) {
    messaging.getToken({
            vapidKey: '***REMOVED***'
        })
        .then(() => {})
        .catch((err) => {
            console.log(err);
        });
}

let app;
auth.onAuthStateChanged(() => {
    if(!app) {
        new Vue({
            router,
            render: h => h(App)
        }).$mount('#app');
    }
});
