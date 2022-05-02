<template>
    <div>
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: 'HomeView'})"><a>Home</a></li>
                <li class="is-active">
                    <router-link :to="{name: 'TrashView'}" aria-current="page">Trash</router-link>
                </li>
            </ul>
        </nav>
        <div class="row">
            <h1 class="title is-2">🗑 Trash</h1>
            <modal-confirm
                modal-text="Are you sure you want to empty the trash?"
                button-classes="is-small"
                @confirm="emptyTrash"
                ref="modalConfirm"
            >
                <template v-slot:button-contents>Empty</template>
            </modal-confirm>
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
import ModalConfirm from '@/components/ModalConfirm';

export default {
    name: 'TrashView',
    components: {ModalConfirm, PageHeader, NoteListItem},
    data: function() {
        return {
            notes: []
        };
    },
    firestore: function() {
        return {
            notes: db.collection('notes')
                .where('userId', '==', auth.currentUser.uid)
                .where('isTrash', '==', true)
                .orderBy('lastModifiedDateTime', 'desc')
        };
    },
    methods: {
        emptyTrash: function() {
            this.notes.forEach(function(note) {
                db.collection('notes').doc(note.id).delete();
            });
            this.$refs.modalConfirm.hideModal();
        }
    }
};
</script>

<style scoped>
>>> .is-info {
    background-color: #DC3F58;
    font-weight: 800;
    border-radius: 10px !important;
}

>>> .is-info:hover {
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
