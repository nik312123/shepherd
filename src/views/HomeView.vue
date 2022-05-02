<template>
    <div>
        <PageHeader/>
        <div class="section">
            <div class="row section-header">
                <h1 class="title is-3">Home</h1>
                <ModalNoteCreate v-if="user" :userTags="user.tags" :starting-tags="[]"/>
            </div>
            <div class="row stretch">
                <HomeSection title="📮 Inbox" viewName="InboxView" :count="inboxNotes.length"/>
                <HomeSection title="☀️ Today" viewName="TodayView" :count="todayNotes.length"/>
            </div>
            <div class="row stretch">
                <HomeSection title="🗄 All Notes" viewName="AllNotesView" :count="allNotes.length"/>
                <HomeSection title="🗓 Upcoming" viewName="UpcomingView" :count="upcomingNotes.length"/>
            </div>
            <div class="row stretch">
                <HomeSection title="🌐 Public" viewName="PublicView" :count="publicNotes.length"/>
                <HomeSection title="🗑 Trash" viewName="TrashView" :count="trashNotes.length"/>
            </div>
        </div>
        
        <div class="section">
            <div class="row section-header">
                <h1 class="title is-3">Views</h1>
                <ModalViewCreate v-if="user" :userTags="user.tags" :views="views"/>
            </div>
            
            <article v-for="view in views" :key="view.id">
                <HomeSection :title="view.name" viewName="ViewView" :id="view.id" :count="1"/>
            </article>
        </div>
    </div>
</template>

<script>
import {auth, db} from '@/firebaseConfig';
import HomeSection from '@/components/HomeSection';
import PageHeader from '@/components/PageHeader';
import ModalViewCreate from '@/components/ModalViewCreate';
import ModalNoteCreate from '@/components/ModalNoteCreate';

export default {
    name: 'HomeView',
    components: {ModalNoteCreate, ModalViewCreate, PageHeader, HomeSection},
    data: function() {
        return {
            views: [],
            user: false,
            inboxNotes: [],
            todayNotes: [],
            upcomingNotes: [],
            allNotes: [],
            trashNotes: [],
            publicNotes: []
        };
    },
    firestore: function() {
        let today = new Date();
        today.setHours(0, 0, 0);
        let tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let endOfWeek = new Date(tomorrow);
        endOfWeek.setDate(endOfWeek.getDate() + 7);
        
        return {
            user: db.collection('users').doc(auth.currentUser.uid),
            views: db.collection('views').where('userId', '==', auth.currentUser.uid),
            
            inboxNotes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('tags', '==', {}),
            
            todayNotes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('reminderDateTime', '>=', today)
                .where('reminderDateTime', '<', tomorrow),
            
            upcomingNotes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('reminderDateTime', '>=', tomorrow)
                .where('reminderDateTime', '<', endOfWeek),
            
            allNotes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false),
            
            trashNotes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', true),
            
            publicNotes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('isPublic', '==', true)
        };
    },
    watch: {
        user: function(newUser) {
            if(newUser === null) {
                this.$firestoreRefs.user.set({tags: []});
            }
        }
    }
};
</script>

<style scoped>
.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
}

.stretch {
    justify-content: stretch;
}

@media only screen and (max-width: 420px) {
    .stretch {
        display: block;
    }
}

hr.solid {
    border-top: 3px solid #2B3749;
    padding-top: 0;
    margin-top: 0;
}

.is-3 {
    margin-bottom: 10px;
    margin-top: 15px;
}

.section-header {
    margin-bottom: 5px;
}
</style>
