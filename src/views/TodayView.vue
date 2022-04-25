<template>
    <div>
        <HeaderBar/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: homeViewName})"><a>Home</a></li>
                <li class="is-active">
                    <router-link :to="{name: todayViewName}" aria-current="page">Today</router-link>
                </li>
            </ul>
        </nav>
        <h1 class="title is-2">☀️ {{ todayString }}</h1>
        <div class="section">
            <article v-for="noteObj in notes" :key="noteObj.id">
                <NoteComponent :note="noteObj"/>
            </article>
        </div>
    </div>
</template>

<script>
import HeaderBar from '@/components/HeaderBar';
import {auth, db} from '@/firebaseConfig';
import NoteComponent from '@/components/NoteComponent';
import HomeView from '@/views/HomeView';

const todayViewName = 'TodayView';

export default {
    name: todayViewName,
    components: {NoteComponent, HeaderBar},
    data() {
        return {
            todayViewName: todayViewName,
            homeViewName: HomeView.name,
            notes: [],
            todayString: new Date().toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'})
        };
    },
    firestore: function() {
        let yesterday = new Date(new Date().setHours(0, 0, 0, 0) - 1);
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return {
            notes: db.collection('notes').where('userId', '==', auth.currentUser.uid).where('isTrash', '==', false)
                .where('reminderDateTime', '>', yesterday).where('reminderDateTime', '<', tomorrow)
        };
    }
};
</script>

<style scoped>

</style>
