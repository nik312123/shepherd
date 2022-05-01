<template>
    <div>
        <HeaderBar/>
      <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
        <ul v-if="$route.params.from !== undefined">
          <li @click="$router.push({'name': 'home'})"><a> Home </a></li>
          <li @click="$router.push({'name': $route.params.from})" v-if="$route.params.viewName === undefined"><a> {{getPathName}} </a></li>
          <li @click="$router.push({'name': $route.params.from, params: {'id': $route.params.viewId}})"
              v-if="$route.params.viewName !== undefined"><a> {{$route.params.viewName}} </a></li>
          <li class="is-active" @click="$router.push($route.fullPath)"><a aria-current="page">Note </a></li>
        </ul>
        <ul v-else>
          <li @click="$router.push({'name': 'home'})"><a> Home </a></li>
          <li @click="$router.push({'name': 'all-notes'})"><a> All Notes </a></li>
          <li class="is-active" @click="$router.push($route.fullPath)"><a aria-current="page">Note </a></li>
        </ul>
      </nav>
        <div v-if="note.userId===userId">
            <div>
                <a class="edit-menu" @click="showModal = true">
                    <i class="fa fa-ellipsis-v fa-2x" aria-hidden="true"></i>
                </a>
            </div>
            <p class="title is-3">{{ note.title }}</p>
            <TagComponent :tag-array="Object.keys(note.tags)" class="tags"/>

            <div>
                <p v-if="note.reminderDateTime" class="note-info">Reminder: {{
                        note.reminderDateTime.toDate().toLocaleDateString('en-US')
                                                                  }}</p>
                <p class="note-info">Created on: {{ note.createdDateTime.toDate().toLocaleDateString('en-US') }}</p>
                <p class="note-info">Last Modified: {{ timeSince(note.lastModifiedDateTime.toDate()) }} ago</p>
            </div>
            <NoteBody :body="note.body" :id="note.id"></NoteBody>
            <EditNote v-if="showModal" @close="showModal = false" v-bind:class="{ 'is-active': showModal }"></EditNote>
        </div>
    </div>
</template>

<script>
import {auth, db} from '@/firebaseConfig';
import NoteBody from '@/components/NoteBody';
import EditNote from '@/components/EditNote';
import HeaderBar from '@/components/HeaderBar';
import TagComponent from '@/components/TagComponent';

export default {
    name: 'NoteView',
    components: {TagComponent, HeaderBar, EditNote, NoteBody},
    props: ['id'],
    data() {
        return {
            note: false,
            showModal: false,
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
        },
    },
    computed:{
      getPathName() {
        // eslint-disable-next-line no-prototype-builtins
        return this.pathMapping.hasOwnProperty(this.$route.params.from) ? this.pathMapping[this.$route.params.from] : "All Notes";
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
