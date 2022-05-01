<template>
    <div>
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: 'home'})"><a>Home</a></li>
                <li class="is-active">
                    <router-link :to="{name: $route.name}" aria-current="page">All Notes</router-link>
                </li>
            </ul>
        </nav>
        <div class="row">
            <h1 class="title is-2">🗄 All Notes</h1>
            <ModalNoteCreate v-if="user" :userTags="user.tags" :starting-tags="[]"/>
        </div>
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
import ModalNoteCreate from '@/components/ModalNoteCreate';


export default {
    name: "AllNotesView",
    components: {NoteListItem, PageHeader, ModalNoteCreate},
    data: function() {
        return {
            user: false,
            notes: []
        };
    },
    firestore: function() {
        return {
            user: db.collection('users').doc(auth.currentUser.uid),
            notes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
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
