<template>
    <div>
        <HeaderBar/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: homeViewName})"><a>Home</a></li>
                <li class="is-active">
                    <router-link :to="{name: inboxViewName}" aria-current="page">Inbox</router-link>
                </li>
            </ul>
        </nav>
        <h1 class="title is-2">📮 Inbox</h1>
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

const inboxViewName = 'InboxView';

export default {
    name: inboxViewName,
    components: {NoteComponent, HeaderBar},
    data: function() {
        return {
            inboxViewName: inboxViewName,
            homeViewName: HomeView.name,
            notes: []
        };
    },
    firestore: function() {
        return {
            notes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('tags', '==', {})
                .orderBy('lastModifiedDateTime')
        };
    }
};
</script>

<style scoped>

</style>
