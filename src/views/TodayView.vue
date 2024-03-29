<template>
    <div id="today-view">
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: 'HomeView'})"><a>Home</a></li>
                <li class="is-active">
                    <router-link :to="{name: 'TodayView'}" aria-current="page">Today</router-link>
                </li>
            </ul>
        </nav>
        <div class="row">
            <h1 id="today-date" :class="'title is-mobile is-' + todayTextSizeDenominator">☀️ {{ todayString }}</h1>
            <ModalNoteCreate
                v-if="user" :user-tags="user.tags" :starting-tags="[]" :starting-date="getOneHourFromNowUpToMidnight()"
            />
        </div>
        
        <div class="section">
            <SearchBar :notes="notes" :return-results="setResults"/>
            <article v-for="noteObj in searchNotes" :key="noteObj.id">
                <NoteListItem :note="noteObj"/>
            </article>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import {auth, db} from '@/firebaseConfig';
import NoteListItem from '@/components/NoteListItem';
import ModalNoteCreate from '@/components/ModalNoteCreate';
import {roundToNearestMultiple} from '@/helpers/mathUtility';
import SearchBar from '@/components/SearchBar';

export default {
    name: 'TodayView',
    components: {NoteListItem, PageHeader, ModalNoteCreate, SearchBar},
    data: function() {
        return {
            user: false,
            notes: [],
            todayString: new Date().toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric'}),
            todayTextSizeDenominator: 2,
            currentlyResizing: false,
            searchNotes: []
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
        },
        getOneHourFromNowUpToMidnight: function() {
            const oneHourFromNow = new Date();
            oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
            oneHourFromNow.setMinutes(roundToNearestMultiple(oneHourFromNow.getMinutes(), 15));
            return oneHourFromNow;
        },
        setResults: function(value) {
            this.searchNotes = value;
        }
    },
    firestore: function() {
        const today = new Date();
        today.setHours(0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return {
            user: db.collection('users').doc(auth.currentUser.uid),
            notes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('reminderDateTime', '>=', today)
                .where('reminderDateTime', '<', tomorrow)
                .orderBy('reminderDateTime')
        };
    }
};
</script>

<style scoped>
#today-date {
    white-space: nowrap;
}

.row {
    display: flex;
    justify-content: space-between;
}
</style>
