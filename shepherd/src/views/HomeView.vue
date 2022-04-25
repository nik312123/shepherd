<template>
  <div>
    <header-bar></header-bar>
    <div class="section">
      <home-item title="📮 Inbox" route="inbox" :count="1"></home-item>
      <home-item title="☀️ Today" route="today" :count="2"></home-item>
      <home-item title="🗓 Upcoming" route="upcoming" :count="0"></home-item>
      <home-item title="🗄 All Notes" route="all-notes" :count="3"></home-item>
      <home-item title="🗑 Trash" route="trash" :count="0"></home-item>
    </div>

    <CreateNoteModal v-if="user" :userTags="user.tags" :views="views"/>

    <div class="section">
      <div class="row">
        <h1 class="title is-3">Views</h1>
        <CreateViewModal v-if="user" :userTags="user.tags" :views="views"/>
      </div>
      <hr class="solid">

      <article v-for="view in views" :key="view.id">
        <home-item :title="view.name" route="view" :id="view.id" :count="1"></home-item>
      </article>
    </div>
  </div>
</template>

<script>
import {auth, db} from "@/firebaseConfig";
import HomeItem from "@/components/HomeItem";
import HeaderBar from "@/components/HeaderBar";
import CreateViewModal from "@/components/CreateViewModal";
import CreateNoteModal from "@/components/CreateNoteModal";

export default {
  name: "HomeView",
  components: {CreateNoteModal, CreateViewModal, HeaderBar, HomeItem},
  data() {
    return {
      views: [],
      user: false
    };
  },
  firestore: function() {
    let userQuery = db.collection("users").doc(auth.currentUser.uid);
    userQuery.get().then((doc) => {
      if(doc.exists) {
        this.$bind("user", userQuery);
      }
      else {
        userQuery.set({tags: []});
      }
    });

    return {
      views: db.collection("views").where("userId", "==", auth.currentUser.uid)
    };
  },
};
</script>

<style scoped>

.row {
  display: flex;
  align-items: center;
  gap: 10px;
}

hr.solid {
  border-top: 3px solid #2B3749;
  padding-top: 0;
  margin-top: 0;
}

.is-3 {
  margin-bottom: 10px;
  margin-top: 15px;
}

</style>
