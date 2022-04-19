<template>
  <div>
    <header-bar></header-bar>
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <ul>
        <li><a href="/home">Home</a></li>
        <li class="is-active"><a href="/upcoming" aria-current="page">Upcoming</a></li>
      </ul>
    </nav>
    <h1 class="title is-2">🗓 Upcoming</h1>
    <div>
      <article v-for="idx in 7" :key="idx">
      <upcoming-view-day-section :offset="idx"></upcoming-view-day-section>
      </article>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
import {auth, db} from "@/firebaseConfig";
import UpcomingViewDaySection from "@/components/UpcomingViewDaySection";

export default {
  name: "UpcomingView",
  components: {HeaderBar, UpcomingViewDaySection},
  data() {
    return {
      notes: []
    };
  },
  firestore: function() {
    let start = new Date(new Date().setHours(0, 0, 0, 0));
    let end = new Date();
    end.setDate(end.getDate() + 7);
    end.setHours(0, 0, 0, 0);
    return {
      notes: db.collection("notes").where("userId", "==", auth.currentUser.uid).where("isTrash", "==", false)
          .where("reminderDateTime", ">", start).where("reminderDateTime", "<", end)
    };
  }
};
</script>

<style scoped>
.title.is-2{
  padding-bottom: 30px;
}
</style>
