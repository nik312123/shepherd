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
import PublicView from '@/views/PublicView';

Vue.use(VueRouter);

const {isNavigationFailure, NavigationFailureType} = VueRouter;

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function(location) {
    return originalPush.call(this, location).catch(error => {
        if(!isNavigationFailure(error, NavigationFailureType.duplicated)) {
            throw Error(error);
        }
    });
};

const routes = [
    {
        path: '/',
        component: LoginView,
        meta: {
            title: 'Shepherd'
        }
    },
    {
        path: '/home',
        component: HomeView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Home'
        }
    },
    {
        path: '/inbox',
        component: InboxView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Inbox'
        }
    },
    {
        path: '/today',
        component: TodayView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Today'
        }
    },
    {
        path: '/upcoming',
        component: UpcomingView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Upcoming'
        }
    },
    {
        path: '/all-notes',
        component: AllNotesView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd All Notes'
        }
    },
    {
        path: '/public-notes',
        component: PublicView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Public'
        }
    },
    {
        path: '/trash',
        component: TrashView,
        meta: {
            requiresAuth: true,
            title: 'Shepherd Trash'
        }
    },
    {
        path: '/view/:id',
        component: ViewView,
        props: true,
        meta: {
            requiresAuth: true,
            title: 'Shepherd View'
        }
    },
    {
        path: '/note/:id',
        component: NoteView,
        props: true,
        meta: {
            requiresAuth: false,
            title: 'Shepherd Note'
        }
    }
];

for(let i = 0; i < routes.length; ++i) {
    if(routes[i].component !== undefined) {
        routes[i].name = routes[i].component.name;
    }
}

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
