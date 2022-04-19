<template>
  <div>
    <header-bar></header-bar>
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <ul>
        <li><a href="/home">Home</a></li>
        <li class="is-active"><a href="/today" aria-current="page">Today</a></li>
      </ul>
    </nav>
    <h1 class="title is-2">☀️ {{ todayString }}</h1>
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
  name: "TodayView",
  components: {NoteComponent, HeaderBar},
  data() {
    return {
      notes: [],
      todayString: new Date().toLocaleDateString()
    };
  },
  firestore: function() {
    let yesterday = new Date(new Date().setHours(0, 0, 0, 0) - 1);
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return {
      notes: db.collection("notes").where("userId", "==", auth.currentUser.uid).where("isTrash", "==", false)
          .where("reminderDateTime", ">", yesterday).where("reminderDateTime", "<", tomorrow)
    };
  }
};
</script>

<style scoped>

</style>
