import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
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
        component: LoginView,
        meta: {
            title: 'Shepherd'
        }
    },
    {
        path: '/home',
        name: 'home',
        component: HomeView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Home'
        }
    },
    {
        path: '/inbox',
        name: 'inbox',
        component: InboxView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Inbox'
        }
    },
    {
        path: '/today',
        name: 'today',
        component: TodayView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Today'
        }
    },
    {
        path: '/upcoming',
        name: 'upcoming',
        component: UpcomingView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Upcoming'
        }
    },
    {
        path: '/all-notes',
        name: 'all-notes',
        component: AllNotesView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd All Notes'
        }
    },
    {
        path: '/trash',
        name: 'trash',
        component: TrashView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Trash'
        }
    },
    {
        path: '/view/:id',
        name: 'view',
        component: ViewView,
        props: true,
        meta: {
            requiresAuth: true,
            title: 'Shepherd View'
        }
    },
    {
        path: '/note/:id',
        name: 'note',
        component: NoteView,
        props: true,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Note'
        }
    }
];

document.title = routes[0].meta.title;

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, from, next) => {
    // noinspection JSUnresolvedVariable
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    
    if(requiresAuth && !auth.currentUser) {
        next('/');
    }
    else {
        next();
    }
});

router.afterEach((to) => {
    // noinspection JSUnresolvedVariable
    document.title = to.meta.title;
});

export default router;
