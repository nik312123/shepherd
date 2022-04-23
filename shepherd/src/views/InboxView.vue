<template>
  <div>
    <header-bar></header-bar>
    <nav class="breadcrumb is-medium" aria-label="breadcrumbs">
      <ul>
        <li @click="$router.push('/home')"><a>Home</a></li>
        <li class="is-active"><a href="/inbox" aria-current="page">Inbox</a></li>
      </ul>
    </nav>
    <h1 class="title is-2">📮 Inbox</h1>
    <search-bar :notes="notes" :returnResults="setResults" />
    <div class="section">
      <article v-for="noteObj in searchNotes" :key="noteObj.id">
        
        <note-component :note="noteObj"></note-component>
      </article>
    </div>
  </div>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
import {auth, db} from "@/firebaseConfig";
import NoteComponent from "@/components/NoteComponent";
import SearchBar from '../components/SearchBar.vue';

export default {
  name: "InboxView",
  components: {NoteComponent, HeaderBar,SearchBar},
  data() {
    return {
      notes: [],
      searchNotes : []
    }
  },
  methods: {
    setResults : function(value){
      this.searchNotes = value
    }
  },
  firestore: function() {
    return {
      notes: db.collection("notes").where("userId", "==", auth.currentUser.uid).where("isTrash", "==", false)
          .where("tags", "==", {}).orderBy("lastModifiedDateTime")
    };
  }
};
</script>

<style scoped>

</style>
