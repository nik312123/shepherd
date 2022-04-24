<template>
  <div>
    <header-bar></header-bar>
    <div>
      <router-link to="/home">
        <i class="fa fa-angle-left fa-2x" aria-hidden="true"></i>
      </router-link>
      <a class="edit-menu" @click="showModal = true">
        <i class="fa fa-ellipsis-v fa-2x" aria-hidden="true"></i>
      </a>
    </div>

    <p class="title is-3">{{ note.title }}</p>
    <div class="tags">
      <tag-component :tag-array="Object.keys(note.tags)"></tag-component>
    </div>
    <div>
      <p class="note-info">Reminder: {{note.reminderDateTime.toDate().toDateString()}}</p>
      <p class="note-info">Created: {{note.createdDateTime.toDate().toDateString()}}</p>
      <p class="note-info">Last Modified: {{note.lastModifiedDateTime.toDate().toDateString()}}</p>
    </div>
    <NoteBody :body="note.body"></NoteBody>
    <EditNote v-if="showModal" @close="showModal = false" v-bind:class="{ 'is-active': showModal }"></EditNote>
  </div>
</template>

<script>
import {db} from "@/firebaseConfig";
import NoteBody from "@/components/NoteBody";
import EditNote from "@/components/EditNote";
import HeaderBar from "@/components/HeaderBar";
import TagComponent from "@/components/TagComponent";

export default {
  name: "NoteView",
  components: {TagComponent, HeaderBar, EditNote, NoteBody},
  props: ["id"],
  data() {
    return {
      note: false,
      showModal: false
    };
  },
  firestore: function() {
    return {
      note: db.collection("notes").doc(this.$route.params.id)
    };
  }
};
</script>

<style scoped>
* {
  color: white;
}

.note-info {
  font-weight: 600;
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
