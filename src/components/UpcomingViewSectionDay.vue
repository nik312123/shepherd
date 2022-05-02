<template>
    <div class="upcoming-view-section-day column">
        <div class="row">
            <p class="title is-3">
                {{ startDate.getDate() }}
            </p>
            <p class="title is-5">
                {{ tomorrow ? 'Tomorrow' : getDayOfTheWeek }}
            </p>
        </div>
        <hr class="solid">
        <article v-for="noteObj in notes" :key="noteObj.id">
            <NoteListItem :note="noteObj"/>
        </article>
    </div>
</template>

<script>
import {auth, db} from '@/firebaseConfig';
import NoteListItem from '@/components/NoteListItem';

export default {
    name: 'UpcomingViewSectionDay',
    components: {NoteListItem},
    props: {
        startDate: Date,
        tomorrow: Boolean
    },
    data: function() {
        return {
            notes: []
        };
    },
    computed: {
        getDayOfTheWeek: function() {
            return this.startDate.toLocaleDateString('en-US', {'weekday': 'short'});
        }
    },
    firestore: function() {
        const end = new Date(this.startDate);
        end.setDate(end.getDate() + 1);
        
        return {
            notes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('reminderDateTime', '>=', this.startDate)
                .where('reminderDateTime', '<', end)
                .orderBy('reminderDateTime')
        };
    }
};
</script>

<style scoped>
hr.solid {
    border-top: 3px solid #2B3749;
    margin: 0 0 10px;
}

p.title.is-3 {
    margin: 0;
}

p.title.is-5 {
    margin: 10px;
    color: #8CA0BE !important;
}

.row {
    display: flex;
    flex-direction: row;
}

>>> .card {
    margin-top: 5px;
    margin-bottom: 5px;
}
</style>
