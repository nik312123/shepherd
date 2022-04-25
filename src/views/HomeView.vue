<template>
    <div>
        <HeaderBar/>
        <div class="section">
            <HomeItem title="📮 Inbox" route="inbox" :count="1"/>
            <HomeItem title="☀️ Today" route="today" :count="2"/>
            <HomeItem title="🗓 Upcoming" route="upcoming" :count="0"/>
            <HomeItem title="🗄 All Notes" route="all-notes" :count="3"/>
            <HomeItem title="🗑 Trash" route="trash" :count="0"/>
        </div>
        
        <CreateNoteModal v-if="user" :userTags="user.tags" :views="views"/>
        
        <div class="section">
            <div class="row">
                <h1 class="title is-3">Views</h1>
                <CreateViewModal v-if="user" :userTags="user.tags" :views="views"/>
            </div>
            <hr class="solid">
            
            <article v-for="view in views" :key="view.id">
                <HomeItem :title="view.name" route="view" :id="view.id" :count="1"/>
            </article>
        </div>
    </div>
</template>

<script>
import {auth, db} from '@/firebaseConfig';
import HomeItem from '@/components/HomeItem';
import HeaderBar from '@/components/HeaderBar';
import CreateViewModal from '@/components/CreateViewModal';
import CreateNoteModal from '@/components/CreateNoteModal';

export default {
    name: 'HomeView',
    components: {CreateNoteModal, CreateViewModal, HeaderBar, HomeItem},
    data() {
        return {
            views: [],
            user: false
        };
    },
    firestore: function() {
        let userQuery = db.collection('users').doc(auth.currentUser.uid);
        userQuery.get().then((doc) => {
            if(doc.exists) {
                this.$bind('user', userQuery);
            }
            else {
                userQuery.set({tags: []});
            }
        });
        
        return {
            views: db.collection('views').where('userId', '==', auth.currentUser.uid)
        };
    }
};
</script>

<style scoped>

.row {
    display: flex;
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