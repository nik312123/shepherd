import Vue from 'vue';
import App from './App.vue';
import router from './router';
import {auth} from '@/firebaseConfig';
import Notifications from 'vue-notification'
import {firestorePlugin} from 'vuefire';

Vue.config.productionTip = false;

Vue.use(firestorePlugin);
Vue.use(Notifications);


let app;
auth.onAuthStateChanged(() => {
    if (!app) {
        new Vue({
            router, render: h => h(App)
        }).$mount('#app');
    }
});
