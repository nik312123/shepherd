<template>
  <div>
    <header-bar></header-bar>
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <ul>
        <li @click="$router.push('/home')"><a>Home</a></li>
        <li class="is-active"><a href="/all-notes" aria-current="page">All Notes</a></li>
      </ul>
    </nav>
    <h1 class="title is-2">🗄 All Notes</h1>
    <div class="section">
      <article v-for="noteObj in notes" :key="noteObj.id">
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
  name: "AllNotesView",
  components: {NoteComponent, HeaderBar},
  data() {
    return {
      notes: []
    }
  },
  firestore: function() {
    return {
      notes: db.collection("notes").where("userId", "==", auth.currentUser.uid).where("isTrash", "==", false)
          .orderBy("lastModifiedDateTime")
    };
  }
};
</script>

<style scoped>

</style>
