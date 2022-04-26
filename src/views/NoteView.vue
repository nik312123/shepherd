<template>
    <div>
        <HeaderBar/>
        <div v-if="note.userId === userId">
            <div>
                <router-link :to="{name: homeViewName}">
                    <span class="fa fa-angle-left fa-2x" aria-hidden="true"></span>
                </router-link>
                <a class="edit-menu" @click="showModal = true">
                    <span class="fa fa-ellipsis-v fa-2x" aria-hidden="true"></span>
                </a>
            </div>
            <p class="title is-3">{{ note.title }}</p>
            <TagComponent :tag-array="Object.keys(note.tags)" class="tags"/>
            
            <div>
                <p v-if="note.reminderDateTime" class="note-info">
                    Reminder: {{ formatToDate(note.reminderDateTime.toDate()) }}
                </p>
                <p class="note-info">Created: {{ formatToDate(note.createdDateTime.toDate()) }}</p>
                <p class="note-info">Last Modified: {{ timeSince(note.lastModifiedDateTime.toDate()) }} ago</p>
            </div>
            <NoteBody :body="note.body" :id="note.id"/>
            <EditNote v-if="showModal" @close="showModal = false" :class="{ 'is-active': showModal }"/>
        </div>
    </div>
</template>

<script>
import {auth, db} from '@/firebaseConfig';
import NoteBody from '@/components/NoteBody';
import EditNote from '@/components/EditNote';
import HeaderBar from '@/components/HeaderBar';
import TagComponent from '@/components/TagComponent';
import HomeView from '@/views/HomeView';
import {dateToString} from '@/helpers/dateFormatter';

export default {
    name: 'NoteView',
    components: {TagComponent, HeaderBar, EditNote, NoteBody},
    props: {
        id: String
    },
    data: function() {
        return {
            homeViewName: HomeView.name,
            note: false,
            showModal: false,
            userId: auth.currentUser.uid
        };
    },
    firestore: function() {
        return {
            note: db.collection('notes').doc(this.$route.params.id)
        };
    },
    methods: {
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
                return this.formatToDate(date);
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
            
            return interval + ' ' + intervalType;
        },
        formatToDate(date) {
            if(typeof date !== 'object') {
                date = new Date(date);
            }
    
            return dateToString(date);
        }
    }
};

</script>

<style scoped>
* {
    color: white;
}

.tags {
    margin-bottom: 20px;
}

.note-info {
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

</style>
