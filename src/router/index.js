import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import {auth} from '@/firebaseConfig';
import InboxView from '@/views/InboxView';
import TodayView from '@/views/TodayView';
import UpcomingView from '@/views/UpcomingView';
import AllNotesView from '@/views/AllNotesView';
import TrashView from '@/views/TrashView';
import ViewView from '@/views/ViewView';
import NoteView from '@/views/NoteView';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginView
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            requiresAuth: true
        },
        component: HomeView
    },
    {
        path: '/inbox',
        name: 'inbox',
        meta: {
            requiresAuth: true
        },
        component: InboxView
    },
    {
        path: '/today',
        name: 'today',
        meta: {
            requiresAuth: true
        },
        component: TodayView
    },
    {
        path: '/upcoming',
        name: 'upcoming',
        meta: {
            requiresAuth: true
        },
        component: UpcomingView
    },
    {
        path: '/all-notes',
        name: 'all-notes',
        meta: {
            requiresAuth: true
        },
        component: AllNotesView
    },
    {
        path: '/trash',
        name: 'trash',
        meta: {
            requiresAuth: true
        },
        component: TrashView
    },
    {
        path: '/view/:id',
        name: 'view',
        meta: {
            requiresAuth: true
        },
        component: ViewView
    },
    {
        path: '/note/:id',
        name: 'note',
        meta: {
            requiresAuth: true
        },
        component: NoteView
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    let currentUser = auth.currentUser;
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if(requiresAuth && !currentUser) {
        next('/');
    }
    else if(!requiresAuth && currentUser) {
        next('home');
    }
    else {
        next();
    }
});

export default router;
