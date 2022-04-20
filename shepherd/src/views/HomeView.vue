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

    <div class="section">
      <div class="row">
      <h1 class="title is-3">Views</h1>
        <create-view-modal :userTags="user[0].tags" :views="views"></create-view-modal>
      </div>
      <hr class="solid">

      <article v-for="view in views" :key="view.id">
        <home-item :title="view.name" route="view" :count="1"></home-item>
      </article>
    </div>
  </div>
</template>

<script>
import {auth, db} from "@/firebaseConfig";
import HomeItem from "@/components/HomeItem";
import HeaderBar from "@/components/HeaderBar";
import CreateViewModal from "@/components/CreateViewModal";

export default {
  name: "HomeView",
  components: {CreateViewModal, HeaderBar, HomeItem},
  data() {
    return {
      display: auth.currentUser.displayName,
      views: [],
      user: {}
    };
  },
  firestore: function() {
    return {
      views: db.collection("views").where("userId", "==", auth.currentUser.uid),
      user: db.collection("users").where("userId", "==", auth.currentUser.uid)
    };
  }
};
</script>

<style scoped>

.row{
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
