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
        <i class="fa-solid fa-paste"></i>
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
            <i class="fa-solid fa-rotate-left view-button"></i>
          </button>
          <button @click="deletePermanent" class="button is-info is-small delete-button">
            <i class="fa-solid fa-file-circle-xmark view-button"></i>
          </button>
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
import HomeView from '@/views/HomeView';
import {dateToString} from '@/helpers/dateFormatter';
import AllNotesView from "@/views/AllNotesView";
import TrashView from "@/views/TrashView";

export default {
  name: 'NoteView',
  components: {TagList, PageHeader, ModalNoteEdit, NoteBody},
  props: {
    id: String,
    defaultTab: String
  },
  data: function () {
    return {
      homeViewName: HomeView.name,
      note: false,
      showModal: false,
      user: false,
      userId: auth.currentUser.uid,
    };
  },
  firestore: function () {
    return {
      user: db.collection('users').doc(auth.currentUser.uid),
      note: db.collection('notes').doc(this.$route.params.id)
    };
  },
  methods: {
    moveToTrash: function () {
      db.collection('notes').doc(this.note.id).update({isTrash: true})
      this.$router.push({name: TrashView.name});
    },
    recover: function () {
      db.collection('notes').doc(this.note.id).update({isTrash: false})
    },
    deletePermanent: function () {
      db.collection('notes').doc(this.note.id).delete();
      this.$router.push({name: AllNotesView.name});
    },
    copyURL: async function () {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Copied');
      } catch ($e) {
        alert('Cannot copy');
      }
    },
    timeSince: function (date) {
      if (typeof date !== 'object') {
        date = new Date(date);
      }

      const seconds = Math.floor((new Date() - date) / 1000);

      let interval;
      let intervalType;

      const secondsInMinute = 60;
      const secondsInHour = 60 * secondsInMinute;
      const secondsInDay = 24 * secondsInHour;

      if (seconds >= secondsInDay) {
        return dateToString(date, false, false)
      } else if (seconds >= secondsInHour) {
        intervalType = 'hour';
        interval = Math.floor(seconds / secondsInHour);
      } else if (seconds >= secondsInMinute) {
        intervalType = 'minute';
        interval = Math.floor(seconds / secondsInMinute);
      } else {
        intervalType = 'second';
        interval = seconds;
      }

      if (interval !== 1) {
        intervalType += 's';
      }

      return interval + ' ' + intervalType + ' ago';
    },
    dateToString: dateToString
  }
};

</script>

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

.delete-button {
  background-color: #DC3F58;
  font-weight: 800;
  border-radius: 10px !important;
}

.delete-button:hover {
  background-color: #B23247;
  font-weight: 800;
  border-radius: 10px !important;
}

.recover-button {
  background-color: #09BB92;
  font-weight: 800;
  border-radius: 10px !important;
}

.recover-button:hover {
  background-color: #089d7b;
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
  background-color: #323f54;
  color: #91a9d7;
  font-weight: 700;
  border-radius: 10px;
  margin-bottom: 5px;
}

.public:hover {
  cursor: pointer;
}

.fa-paste {
  color: #91a9d7;
  margin-left: 6px;
}
</style>
