<template>
    <div>
        <HeaderBar/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: homeViewName})"><a>Home</a></li>
                <li class="is-active">
                    <router-link :to="{name: trashViewName}" aria-current="page">Trash</router-link>
                </li>
            </ul>
        </nav>
        <div class="row">
            <h1 class="title is-2">🗑 Trash</h1>
            <button @click="emptyTrash" class="button is-info is-small">Empty</button>
        </div>
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

const trashViewName = 'TrashView';

export default {
    name: trashViewName,
    components: {HeaderBar, NoteComponent},
    data: function() {
        return {
            trashViewName: trashViewName,
            homeViewName: HomeView.name,
            notes: []
        };
    },
    firestore: function() {
        return {
            notes: db.collection('notes').where('userId', '==', auth.currentUser.uid).where('isTrash', '==', true)
                .orderBy('lastModifiedDateTime')
        };
    },
    methods: {
        emptyTrash: function() {
            this.notes.forEach(function(note) {
                db.collection('notes').doc(note.id).delete();
            });
        }
    }
};
</script>

<style scoped>

.is-info {
    background-color: #DC3F58;
    font-weight: 800;
    border-radius: 10px !important;
}

.is-info:hover {
    background-color: #B23247;
    font-weight: 800;
    border-radius: 10px !important;
}

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
