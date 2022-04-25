<template>
    <div>
        <HeaderBar/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push('/home')"><a>Home</a></li>
                <li class="is-active"><a href="/inbox" aria-current="page">Inbox</a></li>
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

export default {
    name: 'InboxView',
    components: {NoteComponent, HeaderBar},
    data() {
        return {
            notes: []
        };
    },
    firestore: function() {
        return {
            notes: db.collection('notes').where('userId', '==', auth.currentUser.uid).where('isTrash', '==', false)
                .where('tags', '==', {}).orderBy('lastModifiedDateTime')
        };
    }
};
</script>

<style scoped>

</style>
