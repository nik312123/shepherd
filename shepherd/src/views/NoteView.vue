<template>
  <div>
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
      <span class="tag is-info" v-for="tag in displayTags(note.tags)[0]" :key="tag">{{ tag }}</span>
      <span class="tag is-info is-light is-rounded" v-if="displayTags(note.tags)[1] > 0">{{
          displayTags(note.tags)[1]
                                                                                         }}+</span>
    </div>
    <div>
      <p class="note-info">Reminder: April 1</p>
      <p class="note-info">Created on : 11/11/11</p>
      <p class="note-info">Last Modified: 11/11/11</p>
    </div>
    <NoteBody :body="note.body"></NoteBody>
    <EditNote v-if="showModal" @close="showModal = false" v-bind:class="{ 'is-active': showModal }"></EditNote>
  </div>
</template>

<script>
import {db} from "@/firebaseConfig";
import NoteBody from "@/components/NoteBody";
import EditNote from "@/components/EditNote";

export default {
  name: "NoteView",
  components: {EditNote, NoteBody},
  props: ["id"],
  data() {
    return {
      note: false,
      showModal: false
    };
  },
  firestore: function() {
    return {
      note: db.collection("notes").doc("HHtlkn8ojRIo7TUVyRO4")
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
    }
  }
};
</script>

<style scoped>
* {
  color: white;
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