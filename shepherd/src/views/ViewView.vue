<template>
  <div>
    <header-bar></header-bar>
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <ul>
        <li @click="$router.push('/home')"><a>Home</a></li>
        <li class="is-active"><a aria-current="page">{{ $route.params.name }}</a></li>
      </ul>
    </nav>
    <div class = row>
      <h1 class="title is-2">{{ $route.params.name }}</h1>
      <button @click="deleteView" class="button is-info is-small">
        <span class="fa-solid fa-trash"></span>
      </button>
    </div>
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
  },
  methods: {
    deleteView: function(){
      db.collection("views").doc(this.view[0].id).delete();
      this.$router.push("/home");
    }
  }
};
</script>

<style scoped>


.is-info{
  background-color: #DC3F58;
  font-weight: 800;
  border-radius: 10px !important;
}

.is-info:hover{
  background-color: #B23247;
  font-weight: 800;
  border-radius: 10px !important;
}

.row{
  display: flex;
  align-items: center;
  gap: 15px;
}

.title.is-2 {
  margin-bottom: 5px;
}

.section{
  padding-top: 10px;
}

</style>
