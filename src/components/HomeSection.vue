<template>
    <div class="home-section card">
        <header @click="goToView" class="card-header">
            <p class="card-header-title">
                {{ title }}
            </p>
            <span v-if="count > 0 && !id" class="tag is-small">{{ count }}</span>
            <span v-if="id && viewNotes.length > 0" class="tag is-small">{{ viewNotes.length }}</span>
        </header>
    </div>
</template>

<script>
import router from '@/router';
import {auth, db} from '@/firebaseConfig';

export default {
    name: 'HomeSection',
    props: {
        title: String,
        viewName: String,
        count: Number,
        id: String
    },
    data: function() {
        return {
            view: null,
            viewNotes: []
        };
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
                this.$bind('viewNotes', notesQuery);
            }
        }
    },
    methods: {
        goToView: function() {
            if(this.viewName === 'ViewView') {
                router.push({name: 'ViewView', params: {id: this.id}});
            }
            else {
                router.push({name: this.viewName});
            }
        }
    },
    firestore: function() {
        if(!this.id) {
            return {};
        }
        return {
            view: db.collection('views').doc(this.id)
        };
    }
};
</script>

<style scoped>
.card {
    background-color: #344155;
    border-radius: 10px;
    margin-bottom: 15px;
    cursor: pointer;
    width: 100%;
}

.card:hover {
    background-color: #5B6A81;
}

.card-header-title {
    color: #F8FAFC;
    font-size: 1.2em;
    user-select: none;
    text-align: center;
}

.tag {
    margin: auto 15px auto auto;
    border-radius: 99999px;
    background-color: #5B6A81;
    color: #F8FAFC;
    font-weight: 800;
}
</style>
