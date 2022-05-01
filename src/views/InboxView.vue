<template>
    <div>
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: homeViewName})"><a>Home</a></li>
                <li class="is-active">
                    <router-link :to="{name: inboxViewName}" aria-current="page">Inbox</router-link>
                </li>
            </ul>
        </nav>
        <div class="row">
            <h1 class="title is-2">📮 Inbox</h1>
            <ModalNoteCreate v-if="user" :userTags="user.tags" :starting-tags="[]"/>
        </div>
        <search-bar :notes="notes" :returnResults="setResults"/>
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
import ModalNoteCreate from '@/components/ModalNoteCreate';
import SearchBar from '@/components/SearchBar.vue';

const inboxViewName = 'InboxView';

export default {
    name: inboxViewName,
    components: {NoteListItem, PageHeader, ModalNoteCreate, SearchBar},
    data: function() {
        return {
            user: false,
            inboxViewName: inboxViewName,
            homeViewName: HomeView.name,
            notes: [],
            searchNotes : []
        };
    },
    methods: {
        setResults : function(value){
            this.searchNotes = value
        }
    },
    firestore: function() {
        return {
            user: db.collection('users').doc(auth.currentUser.uid),
            notes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('tags', '==', {})
                .orderBy('lastModifiedDateTime', 'desc')
        };
    }
};
</script>

<style scoped>
.row {
    display: flex;
    justify-content: space-between;
}
</style>
