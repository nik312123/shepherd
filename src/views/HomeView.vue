<template>
    <div>
        <PageHeader/>
        <div class="section">
            <HomeSection title="📮 Inbox" viewName="InboxView" :count="1"/>
            <HomeSection title="☀️ Today" viewName="TodayView" :count="2"/>
            <HomeSection title="🗓 Upcoming" viewName="UpcomingView" :count="0"/>
            <HomeSection title="🗄 All Notes" viewName="AllNotesView" :count="3"/>
            <HomeSection title="🗑 Trash" viewName="TrashView" :count="0"/>
        </div>
        
        <ModalNoteCreate v-if="user" :userTags="user.tags" :views="views"/>
        
        <div class="section">
            <div class="row">
                <h1 class="title is-3">Views</h1>
                <ModalViewCreate v-if="user" :userTags="user.tags" :views="views"/>
            </div>
            <hr class="solid">
            
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
            user: false
        };
    },
    firestore: function() {
        return {
            user: db.collection('users').doc(auth.currentUser.uid),
            views: db.collection('views').where('userId', '==', auth.currentUser.uid)
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
    gap: 10px;
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
</style>
