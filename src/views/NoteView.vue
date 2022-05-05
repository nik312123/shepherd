<template>
    <div>
        <PageHeader/>
        <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
            <ul v-if="$route.params.from !== undefined">
                <li @click="$router.push({name: 'HomeView'})"><a> Home </a></li>
                <li @click="$router.push({name: $route.params.from})" v-if="$route.params.viewName === undefined"><a>
                    {{ getPathName }} </a></li>
                <li
                    @click="goToView"
                    v-if="$route.params.viewName !== undefined"
                ><a> {{ $route.params.viewName }} </a></li>
                <li class="is-active" @click="$router.push($route.fullPath)"><a aria-current="page">Note </a></li>
            </ul>
            <ul v-else>
                <li @click="$router.push({name: 'HomeView'})"><a> Home </a></li>
                <li @click="$router.push({name: 'AllNotesView'})"><a> All Notes </a></li>
                <li class="is-active" @click="$router.push($route.fullPath)"><a aria-current="page">Note </a></li>
            </ul>
        </nav>
        <div>
            <span @click="copyURL" v-if="note.isPublic && !note.isTrash && owner" class="tag is-medium public">
                Copy link
                <span class="fa-solid fa-paste"></span>
            </span>
            <div class="row">
                <p id="note-view-title" class="title is-3">{{ note.title }}</p>
                <div v-if="!note.isTrash && owner" class="row smaller-gap">
                    <button @click="remove" class="button is-info is-small delete-button">
                        <span class="fa-solid fa-trash view-button"></span>
                    </button>
                    <ModalNoteEdit v-if="user" :user-tags="user.tags" :note-obj="this.note"/>
                </div>
                <div v-if="note.isTrash && owner" class="row smaller-gap">
                    <button @click="recover" class="button is-info is-small recover-button">
                        <span class="fa-solid fa-rotate-left view-button"></span>
                    </button>
                    <modal-confirm
                        modal-text="Are you sure you want to permanently remove this note?"
                        button-classes="is-small delete-button"
                        @confirm="removePermanently"
                        ref="modalConfirm"
                    >
                        <template v-slot:button-contents>
                            <span class="fa-solid fa-file-circle-xmark view-button"></span>
                        </template>
                    </modal-confirm>
                </div>
            </div>
            <TagList v-if="owner" :tag-array="Object.keys(note.tags)" class="tags"/>
            
            <div v-if="note && owner">
                <p v-if="note.reminderDateTime" class="note-info">
                    Reminder: {{ dateToString(note.reminderDateTime.toDate(), false, true) }}
                </p>
                <p class="note-info">
                    Created: {{ dateToString(note.createdDateTime.toDate(), false, false) }}
                </p>
                <p class="note-info">Last Modified: {{ timeSince(note.lastModifiedDateTime.toDate()) }}</p>
                <div class="toggle-image-container">
                    <ButtonNoteImageAdd/>
                    <div class="control" v-if="note.imageUrl !== undefined && note.imageUrl !== '' ">
                        <ToggleButton
                            v-model="showImage"
                            :color="{checked: '#089D7B', unchecked: '#2A3444'}"
                            :labels="{checked: 'Hide', unchecked: 'Show'}"
                            :width="98"
                            :height="35"
                            :font-size="15"
                            :margin="5"
                        />
                    </div>
                    <button
                        v-show="note.imageUrl !== undefined && note.imageUrl !== '' && showImage"
                        class="button is-focused delete-image-button" @click="deleteImage"
                    >
                        <span class="icon">
                            <span class="fas fa-trash"></span>
                        </span>
                        <span>Image</span>
                    </button>
                </div>
            </div>
            <div class="image-container">
                <img :src="note.imageUrl" v-if="showImage" class="image" alt="Note Image"/>
            </div>
            
            <NoteBody v-if="note" :default-tab="defaultTab" :body="note.body" :id="note.id" :owner="owner"/>
        </div>
    </div>
</template>

<script>
import {auth, db, storage} from '@/firebaseConfig';
import NoteBody from '@/components/NoteBody';
import ModalNoteEdit from '@/components/ModalNoteEdit';
import PageHeader from '@/components/PageHeader';
import TagList from '@/components/TagList';
import {dateToString} from '@/helpers/dateFormatter';
import ButtonNoteImageAdd from '@/components/ButtonNoteImageAdd';
import ModalConfirm from '@/components/ModalConfirm';
import {ToggleButton} from 'vue-js-toggle-button';

export default {
    name: 'NoteView',
    components: {
        TagList,
        PageHeader,
        ModalNoteEdit,
        NoteBody,
        ButtonNoteImageAdd,
        ModalConfirm,
        ToggleButton
    },
    props: {
        id: String,
        defaultTab: String
    },
    data: function() {
        return {
            note: false,
            showModal: false,
            image: null,
            uploadValue: 0,
            user: false,
            pathMapping: {
                'HomeView': 'Home',
                'InboxView': 'Inbox',
                'TrashView': 'Trash',
                'TodayView': 'Today',
                'UpcomingView': 'Upcoming',
                'PublicView': 'Public'
            },
            userId: auth.currentUser ? auth.currentUser.uid : null,
            owner: false,
            showImage: false
        };
    },
    created: function() {
        this.$firestoreRefs.note.onSnapshot({
            error: () => {
                this.$router.push({name: 'HomeView'});
            }
        });
    },
    firestore: function() {
        if(!auth.currentUser) {
            return {
                note: db.collection('notes').doc(this.$route.params.id)
            };
        }
        return {
            user: db.collection('users').doc(auth.currentUser.uid),
            note: db.collection('notes').doc(this.id)
        };
    },
    watch: {
        note: function() {
            if(!this.note) {
                this.$router.push({name: 'HomeView'});
                return;
            }
            this.owner = this.userId === this.note.userId;
            if(!this.owner && (!this.note.isPublic || this.note.isTrash)) {
                this.$router.push({name: 'HomeView'});
            }
        }
    },
    methods: {
        remove: function() {
            db.collection('notes').doc(this.id).update({isTrash: true, isPublic: false});
            this.$router.push({name: this.from ? this.from : 'AllNotesView'});
        },
        removePermanently: function() {
            db.collection('notes').doc(this.id).delete();
            this.$router.push({name: 'TrashView'});
            this.$refs.modalConfirm.hideModal();
        },
        recover: function() {
            db.collection('notes').doc(this.id).update({isTrash: false});
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
        dateToString,
        goToView: function() {
            this.$router.push({name: 'ViewView', params: {id: this.$route.params.viewId}});
        },
        deleteImage: function() {
            storage.ref('notes/' + this.id).delete().then(() => {
                //Delete from db
                db.collection('notes').doc(this.id)
                    .update({
                        'imageUrl': '',
                        lastModifiedDateTime: new Date()
                    })
                    .then(() => {})
                    .catch(error => {
                        alert('Something went wrong');
                        console.log(error);
                    });
                this.showImage = false;
            });
        }
    },
    computed: {
        getPathName: function() {
            if(Object.prototype.hasOwnProperty.call(this.pathMapping, this.$route.params.from)) {
                return this.pathMapping[this.$route.params.from];
            }
            return 'All Notes';
        }
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

.toggle-image-container {
    display: flex;
}

.control {
    margin: auto 0;
}

.image-container {
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.image {
    max-width: 70%;
    max-height: 400px;
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

.delete-image-button {
    background-color: #DC3F58 !important;
    font-weight: 400;
    color: white;
    margin: auto 10px;
}

.delete-image-button:hover {
    background-color: #B23247 !important;
    font-weight: 400;
    color: white;
    margin: auto 10px;
}
</style>
