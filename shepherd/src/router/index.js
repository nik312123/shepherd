import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import {auth} from "@/firebaseConfig";
import NoteView from "@/views/NoteView";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "login",
        component: LoginView
    },
    {
        path: "/home",
        name: "home",
        meta: {
            requiresAuth: true
        },
        component: HomeView
    },
    {
        path: "/note/:id",
        name: "note",
        meta: {
            requiresAuth: true
        },
        component: NoteView
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    let currentUser = auth.currentUser;
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if(requiresAuth && !currentUser) {
        next("/");
    }
    else if(!requiresAuth && currentUser) {
        next("home");
    }
    else {
        next();
    }
});

export default router;
