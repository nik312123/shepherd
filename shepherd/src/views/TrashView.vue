<template>
  <div>
    <header-bar></header-bar>
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <ul>
        <li><a href="/home">Home</a></li>
        <li class="is-active"><a href="/trash" aria-current="page">Trash</a></li>
      </ul>
    </nav>
    <h1 class="title is-2">🗑 Trash</h1>
    <div class="section">
      <article v-for="noteObj in notes" :key="noteObj">
        <note-component :note="noteObj"></note-component>
      </article>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
import {auth, db} from "@/firebaseConfig";
import NoteComponent from "@/components/NoteComponent";

export default {
  name: "TrashView",
  components: {HeaderBar, NoteComponent},
  data() {
    return {
      notes: []
    }
  },
  firestore: function() {
    return {
      notes: db.collection("notes").where("userId", "==", auth.currentUser.uid).where("isTrash", "==", true)
          .orderBy("lastModifiedDateTime")
    };
  }
};
</script>

<style scoped>

</style>
