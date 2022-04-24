<template>
  <div class="column">
    <div class="row">
      <p class="title is-3">
        {{ getDate() }}
      </p>
      <p class="title is-5">
        {{ offset === 1 ? "Tomorrow" : getDayOfTheWeek() }}
      </p>
    </div>
    <hr class="solid">
    <article v-for="noteObj in notes" :key="noteObj.id">
      <note-component :note="noteObj"></note-component>
    </article>
  </div>
</template>

<script>
import {auth, db} from "@/firebaseConfig";
import NoteComponent from "@/components/NoteComponent";

export default {
  name: "UpcomingViewDaySection",
  components: {NoteComponent},
  data() {
    return {
      notes: []
    };
  },
  props: {
    offset: Number
  },
  methods: {
    getDate: function() {
      let d = new Date();
      d.setDate(d.getDate() + this.offset);
      return d.getDate();
    },
    getDayOfTheWeek: function() {
      let d = new Date();
      d.setDate(d.getDate() + this.offset);
      let day = d.getDay();
      let dayOfTheWeek = "";
      switch(day) {
        case 0:
          return "Sunday";
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Wednesday";
        case 4:
          return "Thursday";
        case 5:
          return "Friday";
        case 6:
          return "Saturday";
      }
      return dayOfTheWeek;
    }
  },
  firestore: function() {
    let start = new Date();
    start.setDate(start.getDate() + (this.offset - 1));
    start.setHours(23, 59, 59, 0);

    let end = new Date();
    end.setDate(end.getDate() + this.offset + 1);
    end.setHours(0, 0, 0, 0);
    return {
      notes: db.collection("notes").where("userId", "==", auth.currentUser.uid).where("isTrash", "==", false)
          .where("reminderDateTime", ">", start).where("reminderDateTime", "<", end)
    };
  }
};
</script>

<style scoped>
hr.solid {
  border-top: 3px solid #2B3749;
  margin: 0 0 10px;
}

p.title.is-3 {
  margin: 0;
}

p.title.is-5 {
  margin: 10px;
  color: #8CA0BE !important;
}

.row {
  display: flex;
  flex-direction: row;
}
</style>
