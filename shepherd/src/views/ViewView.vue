<template>
  <div>
    <header-bar></header-bar>
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <ul>
        <li @click="$router.push('/home')"><a>Home</a></li>
        <li class="is-active"><a aria-current="page">{{ $route.params.name }}</a></li>
      </ul>
    </nav>
    <h1 class="title is-2">{{ $route.params.name }}</h1>
    <tag-component :tag-array="view[0].tags"></tag-component>
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
import TagComponent from "@/components/TagComponent";
import NoteComponent from "@/components/NoteComponent";

export default {
  name: "ViewView",
  components: {NoteComponent, TagComponent, HeaderBar},
  data() {
    return {
      view: {},
      notes: []
    };
  },
  props: {
    name: String
  },
  watch: {
    view: function() {
      let notesQuery = db.collection("notes").where("userId", "==", auth.currentUser.uid);
      let tags = this.view[0].tags;
      tags.forEach(function(tag) {
        notesQuery = notesQuery.where("tags." + tag, "==", true);
      });
      this.$bind("notes", notesQuery);
    }
  },
  firestore: function() {
    return {
      view: db.collection("views").where("userId", "==", auth.currentUser.uid)
          .where("name", "==", this.$route.params.name)
    };
  }
};
</script>

<style scoped>

.title.is-2 {
  margin-bottom: 5px;
}

.section{
  padding-top: 10px;
}

</style>
