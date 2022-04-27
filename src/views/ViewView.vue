<template>
    <div>
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul>
                <li @click="$router.push({name: homeViewName})"><a>Home</a></li>
                <li v-if="view" class="is-active"><a aria-current="page">{{ view.name }}</a></li>
            </ul>
        </nav>
        <div class="row">
            <h1 v-if="view" class="title is-2">{{ view.name }}</h1>
            <div class="row smaller-gap">
                <button @click="deleteView" class="button is-info is-small">
                    <span class="fa-solid fa-trash view-button"></span>
                </button>
                <ModalViewEdit v-if="user && view" :userTags="user.tags" :views="views" :viewObj="view"/>
            </div>
        </div>
        <TagList v-if="view" :tag-array="view.tags"/>
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
import TagList from '@/components/TagList';
import NoteListItem from '@/components/NoteListItem';
import ModalViewEdit from '@/components/ModalViewEdit';
import HomeView from '@/views/HomeView';

export default {
    name: 'ViewView',
    components: {ModalViewEdit, NoteListItem, TagList, PageHeader},
    data: function() {
        return {
            homeViewName: HomeView.name,
            view: null,
            notes: [],
            user: null,
            views: [],
            test: {}
        };
    },
    props: {
        id: String
    },
    watch: {
        view: function() {
            if(this.view) {
                this.test = this.view.ref;
                let notesQuery = db.collection('notes').where('userId', '==', auth.currentUser.uid);
                let tags = this.view.tags;
                tags.forEach(function(tag) {
                    notesQuery = notesQuery.where('tags.' + tag, '==', true);
                });
                this.$bind('notes', notesQuery);
            }
        }
    },
    firestore: function() {
        return {
            view: db.collection('views').doc(this.$route.params.id),
            views: db.collection('views').where('userId', '==', auth.currentUser.uid),
            user: db.collection('users').doc(auth.currentUser.uid)
        };
    },
    methods: {
        deleteView: function() {
            db.collection('views').doc(this.view.id).delete();
            this.$router.push({name: HomeView.name});
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
