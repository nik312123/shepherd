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
                    Reminder: {{ note.reminderDateTime.toDate().toLocaleDateString('en-US') }}
                </p>
                <p class="note-info">Created on: {{ note.createdDateTime.toDate().toLocaleDateString('en-US') }}</p>
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

export default {
    name: 'NoteView',
    components: {TagComponent, HeaderBar, EditNote, NoteBody},
    props: {
        id: String
    },
    data() {
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
        displayTags: function(tags) {
            let totalChars = 20;
            let i = 0;
            let displayedTags = [];
            while(totalChars > 0 && i < tags.length) {
                totalChars -= tags[i].length;
                displayedTags.push(tags[i]);
                i += 1;
            }
            let remainingTags = tags.length - displayedTags.length;
            return [displayedTags, remainingTags];
        },
        timeSince: function(date) {
            if(typeof date !== 'object') {
                date = new Date(date);
            }
            
            const seconds = Math.floor((new Date() - date) / 1000);
            let intervalType;
            
            let interval = Math.floor(seconds / 31536000);
            if(interval >= 1) {
                intervalType = 'year';
            }
            else {
                interval = Math.floor(seconds / 2592000);
                if(interval >= 1) {
                    intervalType = 'month';
                }
                else {
                    interval = Math.floor(seconds / 86400);
                    if(interval >= 1) {
                        intervalType = 'day';
                    }
                    else {
                        interval = Math.floor(seconds / 3600);
                        if(interval >= 1) {
                            intervalType = 'hour';
                        }
                        else {
                            interval = Math.floor(seconds / 60);
                            if(interval >= 1) {
                                intervalType = 'minute';
                            }
                            else {
                                interval = seconds;
                                intervalType = 'second';
                            }
                        }
                    }
                }
            }
            
            if(interval > 1 || interval === 0) {
                intervalType += 's';
            }
            
            return interval + ' ' + intervalType;
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
