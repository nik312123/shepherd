import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {auth, messaging} from '@/firebaseConfig';
import {firestorePlugin} from 'vuefire';

Vue.config.productionTip = false;

Vue.use(firestorePlugin);

messaging.getToken({
    vapidKey: "***REMOVED***"
}).then(() => {
    console.log("Token generated");
}).catch((err) => {
    console.log(err);
});

let app;
auth.onAuthStateChanged(() => {
    if(!app) {
        new Vue({
            router, render: h => h(App)
        }).$mount('#app');
    }
});
