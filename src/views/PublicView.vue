<template>
    <div>
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: homeViewName})"><a>Home</a></li>
                <li class="is-active">
                    <router-link :to="{name: publicViewName}" aria-current="page">Public</router-link>
                </li>
            </ul>
        </nav>
        <div class="row">
            <h1 class="title is-2">🌐 Public</h1>
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
import HomeView from '@/views/HomeView';

const publicViewName = 'PublicView';

export default {
    name: publicViewName,
    components: {PageHeader, NoteListItem},
    data: function() {
        return {
            publicViewName: publicViewName,
            homeViewName: HomeView.name,
            notes: []
        };
    },
    firestore: function() {
        return {
            notes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', false)
                .where('isPublic', '==', true)
                .orderBy('lastModifiedDateTime', 'desc')
        };
    },
};
</script>

<style scoped>
.row {
    display: flex;
    align-items: center;
    gap: 15px;
}

.is-2 {
    margin: 0;
}

.section {
    padding-top: 15px;
}
</style>
