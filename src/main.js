import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import {auth, messaging} from '@/firebaseConfig';
import {firestorePlugin} from 'vuefire';
import 'no-darkreader';
import '@/registerServiceWorker';

Vue.config.productionTip = false;

Vue.use(firestorePlugin);

if(messaging !== null) {
    messaging.getToken({
            vapidKey: '***REMOVED***'
        })
        .then(() => {})
        .catch((error) => {
            console.log(error);
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
