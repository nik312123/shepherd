<template>
    <div id="today-view">
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: homeViewName})"><a>Home</a></li>
                <li class="is-active">
                    <router-link :to="{name: todayViewName}" aria-current="page">Today</router-link>
                </li>
            </ul>
        </nav>
        <h1 id="today-date" :class="'title is-mobile is-' + todayTextSizeDenominator">☀️ {{ todayString }}</h1>
        <div class="section">
            <article v-for="noteObj in notes" :key="noteObj.id">
                <NoteListItem :note="noteObj"/>
            </article>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import {auth, db} from '@/firebaseConfig';
import NoteListItem from '@/components/NoteListItem';
import HomeView from '@/views/HomeView';

const todayViewName = 'TodayView';

export default {
    name: todayViewName,
    components: {NoteListItem, PageHeader},
    data: function() {
        return {
            todayViewName: todayViewName,
            homeViewName: HomeView.name,
            notes: [],
            todayString: new Date().toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'}),
            todayTextSizeDenominator: 2,
            currentlyResizing: false
        };
    },
    created: function() {
        this.onResize();
        window.addEventListener('resize', this.onResize);
    },
    methods: {
        onResize: function() {
            const windowWidth = window.screen.width;
            if(windowWidth >= 500) {
                this.todayTextSizeDenominator = 2;
            }
            else if(windowWidth >= 400) {
                this.todayTextSizeDenominator = 3;
            }
            else {
                this.todayTextSizeDenominator = 4;
            }
        }
    },
    firestore: function() {
        const today = new Date();
        today.setHours(0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return {
            notes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('reminderDateTime', '>=', today)
                .where('reminderDateTime', '<', tomorrow)
        };
    }
};
</script>

<style scoped>
#today-date {
    white-space: nowrap;
}
</style>
