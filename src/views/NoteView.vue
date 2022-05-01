<template>
    <div>
        <PageHeader/>
        <div v-if="note.userId === userId">
            <div>
                <router-link :to="{name: homeViewName}">
                    <span class="fa fa-angle-left fa-2x" aria-hidden="true"></span>
                </router-link>
            </div>
            <span @click="copyURL" v-if="note.isPublic && !note.isTrash" class="tag is-medium public">
                Copy link
                <span class="fa-solid fa-paste"></span>
            </span>
            <div class="row">
                <p id="note-view-title" class="title is-3">{{ note.title }}</p>
                <div v-if="!note.isTrash" class="row smaller-gap">
                    <button @click="moveToTrash" class="button is-info is-small delete-image-button">
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
                <div class="toggle-image-container">
                    <add-image/>
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
                    <button v-show="note.imageUrl !== undefined && note.imageUrl !== '' && showImage" class="button is-focused delete-image-button" @click="deleteImage">
                        <span class="icon">
                            <i class="fas fa-trash"></i>
                        </span>
                        <span>Image</span>
                    </button>
                    
                </div>
            </div>
            <div class="image-container">
                <img :src="note.imageUrl" v-if="showImage" class="image"/>
            </div>
            <NoteBody :default-tab="defaultTab" :body="note.body" :id="note.id"/>
        </div>
    </div>
</template>

<script>
import {auth, db, storage} from '@/firebaseConfig';
import NoteBody from '@/components/NoteBody';
import ModalNoteEdit from '@/components/ModalNoteEdit';
import PageHeader from '@/components/PageHeader';
import TagList from '@/components/TagList';
import HomeView from '@/views/HomeView';
import {dateToString} from '@/helpers/dateFormatter';
import AddImage from '@/components/AddImage';
import ModalDeletePermanently from '@/components/ModalDeletePermanently';
import {ToggleButton} from 'vue-js-toggle-button';
export default {
    name: 'NoteView',
    components: {TagList, PageHeader, ModalNoteEdit, NoteBody, AddImage, ModalDeletePermanently, ToggleButton},
    props: {
        id: String,
        defaultTab: String
    },
    data: function() {
        return {
            homeViewName: HomeView.name,
            note: false,
            showModal: false,
            userId: auth.currentUser.uid,
            image : null,
            uploadValue : 0,
            user: false,
            showImage: false
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
            this.$router.push({name: 'TrashView'});
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

        deleteImage(){
            storage.ref('notes/'+this.$route.params.id).delete().then(() => {
                
                //Delete from db
                db.collection('notes').doc(this.$route.params.id).update({
                  'imageUrl' : '',
                   lastModifiedDateTime: new Date()
                }).then(() => {
                    
                }).catch(err => {
                    alert("Something went wrong")
                    console.log(err)
                })
                this.showImage = false;
            })

        }
    },
    
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

.toggle-image-container{
    display: flex;
}

.control{
    margin: auto 0%;
    padding: auto 0%;
}

.image-container{
    display: flex;
    justify-content: space-around;
    width: 100%;
}

.image{
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

.delete-image-button{
    background-color: red !important;
    padding: auto 1%;
    font-weight: 400;
    color: white;
    margin: auto 10px;
}
</style>
