<template>
    <div>
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: 'HomeView'})"><a>Home</a></li>
                <li v-if="view" class="is-active"><a aria-current="page">{{ view.name }}</a></li>
            </ul>
        </nav>
        <div class="row">
            <h1 v-if="view" class="title is-2">{{ view.name }}</h1>
            <div class="row smaller-gap">
                <button @click="deleteView" class="button is-info is-small">
                    <span class="fa-solid fa-trash view-button" title="Delete view"></span>
                </button>
                <ModalViewEdit v-if="user && view" :user-tags="user.tags" :views="views" :view-obj="view"/>
            </div>
            <ModalNoteCreate v-if="user" :user-tags="user.tags" :starting-tags="view.tags"/>
        </div>
        <TagList v-if="view" :tag-array="view.tags"/>
        <div class="section">
            <search-bar :notes="notes" v-bind="notes" :returnResults="setResults"/>
            <article v-for="noteObj in searchNotes" :key="noteObj.id">
                <NoteListItem :note="noteObj" :view-name="view.name" :view-id="id"/>
            </article>
        </div>
    </div>
</template>

<script>
import PageHeader from '@/components/PageHeader';
import {auth, db} from '@/firebaseConfig';
import TagList from '@/components/TagList';
import NoteListItem from '@/components/NoteListItem';
import ModalViewEdit from '@/components/ModalViewEdit';
import ModalNoteCreate from '@/components/ModalNoteCreate';
import SearchBar from '@/components/SearchBar.vue';

export default {
    name: 'ViewView',
    components: {ModalViewEdit, NoteListItem, TagList, PageHeader, ModalNoteCreate, SearchBar},
    data: function() {
        return {
            view: null,
            notes: [],
            user: null,
            views: [],
            searchNotes: []
        };
    },
    props: {
        id: String
    },
    watch: {
        view: function() {
            if(this.view) {
                let notesQuery = db.collection('notes')
                    .where('userId', '==', auth.currentUser.uid)
                    .where('isTrash', '==', false);
                const tags = this.view.tags;
                tags.forEach(function(tag) {
                    notesQuery = notesQuery.where('tags.' + tag, '==', true);
                });
                this.$bind('notes', notesQuery);
            }
        }
    },
    firestore: function() {
        return {
            view: db.collection('views').doc(this.id),
            views: db.collection('views')
                .where('userId', '==', auth.currentUser.uid)
                .orderBy('lastModifiedDate', 'desc'),
            user: db.collection('users').doc(auth.currentUser.uid)
        };
    },
    methods: {
        deleteView: function() {
            db.collection('views').doc(this.id).delete();
            this.$router.push({name: 'HomeView'});
        },
        setResults: function(value) {
            this.searchNotes = value;
        }
    }
};
</script>

<style>
.view-button {
    font-size: 17px;
}
</style>

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

.title.is-2 {
    margin-bottom: 5px;
}

.section {
    padding-top: 10px;
}

.smaller-gap {
    gap: 0;
}
</style>
