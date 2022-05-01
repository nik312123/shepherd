<template>
    <div>
        <PageHeader/>
      <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
        <ul v-if="$route.params.from !== undefined">
          <li @click="$router.push({name: 'home'})"><a> Home </a></li>
          <li @click="$router.push({name: $route.params.from})" v-if="$route.params.viewName === undefined"><a>
            {{ getPathName }} </a></li>
          <li @click="goToView"
              v-if="$route.params.viewName !== undefined"><a> {{$route.params.viewName}} </a></li>
          <li class="is-active" @click="$router.push($route.fullPath)"><a aria-current="page">Note </a></li>
        </ul>
        <ul v-else>
          <li @click="$router.push({name: 'home'})"><a> Home </a></li>
          <li @click="$router.push({name: 'all-notes'})"><a> All Notes </a></li>
          <li class="is-active" @click="$router.push($route.fullPath)"><a aria-current="page">Note </a></li>
        </ul>
      </nav>
        <div v-if="note.userId === userId">
            <span @click="copyURL" v-if="note.isPublic && !note.isTrash" class="tag is-medium public">
                Copy link
                <span class="fa-solid fa-paste"></span>
            </span>
            <div class="row">
                <p id="note-view-title" class="title is-3">{{ note.title }}</p>
                <div v-if="!note.isTrash" class="row smaller-gap">
                    <button @click="moveToTrash" class="button is-info is-small delete-button">
                        <span class="fa-solid fa-trash view-button"></span>
                    </button>
                    <ModalNoteEdit v-if="user" :userTags="user.tags" :noteObj="this.note"/>
                </div>
                <div v-if="note.isTrash" class="row smaller-gap">
                    <button @click="recover" class="button is-info is-small recover-button">
                        <span class="fa-solid fa-rotate-left view-button"></span>
                    </button>
                    <ModalDeletePermanently :note-id="note.id"/>
                </div>
            </div>
            <TagList :tag-array="Object.keys(note.tags)" class="tags"/>
            
            <div>
                <p v-if="note.reminderDateTime" class="note-info">
                    Reminder: {{ dateToString(note.reminderDateTime.toDate(), false, true) }}
                </p>
                <p class="note-info">Created: {{ dateToString(note.createdDateTime.toDate(), false, false) }}</p>
                <p class="note-info">Last Modified: {{ timeSince(note.lastModifiedDateTime.toDate()) }}</p>
            </div>
            <NoteBody :default-tab="defaultTab" :body="note.body" :id="note.id"/>
        </div>
    </div>
</template>

<script>
import {auth, db} from '@/firebaseConfig';
import NoteBody from '@/components/NoteBody';
import ModalNoteEdit from '@/components/ModalNoteEdit';
import PageHeader from '@/components/PageHeader';
import TagList from '@/components/TagList';
import {dateToString} from '@/helpers/dateFormatter';
import ModalDeletePermanently from '@/components/ModalDeletePermanently';


export default {
    name: 'NoteView',
    components: {ModalDeletePermanently, TagList, PageHeader, ModalNoteEdit, NoteBody},
    props: {
        id: String,
        defaultTab: String
    },
    data: function() {
        return {
            note: false,
            showModal: false,
            user: false,
            userId: auth.currentUser.uid,
            pathMapping: {
              "home": "Home",
              "inbox": "Inbox",
              "trash": "Trash",
              "today": "Today",
              "upcoming": "Upcoming",
            }
        };
    },
    firestore: function() {
        return {
            user: db.collection('users').doc(auth.currentUser.uid),
            note: db.collection('notes').doc(this.$route.params.id)
        };
    },
    methods: {
        moveToTrash: function() {
            db.collection('notes').doc(this.note.id).update({isTrash: true});
            this.$router.push({name: 'trash'});
        },
        recover: function() {
            db.collection('notes').doc(this.note.id).update({isTrash: false});
        },
        copyURL: async function() {
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('Copied');
            }
            catch(ignored) {
                alert('Cannot copy');
            }
        },
        timeSince: function(date) {
            if(typeof date !== 'object') {
                date = new Date(date);
            }
            
            const seconds = Math.floor((new Date() - date) / 1000);
            
            let interval;
            let intervalType;
            
            const secondsInMinute = 60;
            const secondsInHour = 60 * secondsInMinute;
            const secondsInDay = 24 * secondsInHour;
            
            if(seconds >= secondsInDay) {
                return dateToString(date, false, false);
            }
            else if(seconds >= secondsInHour) {
                intervalType = 'hour';
                interval = Math.floor(seconds / secondsInHour);
            }
            else if(seconds >= secondsInMinute) {
                intervalType = 'minute';
                interval = Math.floor(seconds / secondsInMinute);
            }
            else {
                intervalType = 'second';
                interval = seconds;
            }
            
            if(interval !== 1) {
                intervalType += 's';
            }
            
            return interval + ' ' + intervalType + ' ago';
        },
        dateToString: dateToString,
        goToView: function() {
            this.$router.push({name: "view", params: {id : this.$route.params.viewId}});
        },

    },
    computed: {
      getPathName: function() {
        // eslint-disable-next-line no-prototype-builtins
        return this.pathMapping.hasOwnProperty(this.$route.params.from) ? this.pathMapping[this.$route.params.from] : "All Notes";
      },
    }
};

</script>

<style>
.delete-button, .delete-button.modal-open-button {
    background-color: #DC3F58 !important;
    font-weight: 800 !important;;
    border-radius: 10px !important;
}

.delete-button:hover, .delete-button.modal-open-button:hover {
    background-color: #B23247 !important;;
    font-weight: 800 !important;;
    border-radius: 10px !important;
}
</style>

<style scoped>
#note-view-title {
    margin-bottom: 5px;
}

* {
    color: white;
}

.tags {
    margin-bottom: 20px;
}

.note-info {
    margin-bottom: 7px;
    font-weight: 700;
    color: #AABBD5;
}

.title {
    margin-bottom: 0;
}

#content {
    margin-top: 2em;
    padding: 10px;
    border-style: solid;
    border-color: gray;
    border-width: 1px;
}

.fa {
    padding: 10px;
    position: relative;
    top: -20px;
    left: -10px;
    color: gray;
}

.edit-menu {
    position: relative;
    float: right;
    top: 60px;
}

.recover-button {
    background-color: #09BB92;
    font-weight: 800;
    border-radius: 10px !important;
}

.recover-button:hover {
    background-color: #089D7B;
    font-weight: 800;
    border-radius: 10px !important;
}

.row {
    display: flex;
    align-items: center;
    gap: 15px;
}

.smaller-gap {
    gap: 0;
}

.public {
    background-color: #323F54;
    color: #91A9D7;
    font-weight: 700;
    border-radius: 10px;
    margin-bottom: 5px;
}

.public:hover {
    cursor: pointer;
}

.fa-paste {
    color: #91A9D7;
    margin-left: 6px;
}
</style>
