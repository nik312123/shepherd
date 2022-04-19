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
        <button class="button is-info is-small">New</button>
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

export default {
  name: "HomeView",
  components: {HeaderBar, HomeItem},
  data() {
    return {
      display: auth.currentUser.displayName,
      views: []
    };
  },
  firestore: function() {
    return {
      views: db.collection("views").where("userId", "==", auth.currentUser.uid)
    };
  }
};
</script>

<style scoped>

.is-info{
  background-color: #10A5E9;
  font-weight: 800;
  border-radius: 10px !important;
  position: relative;
  top: 2px
}

.is-info:hover{
  background-color: #1282B6;
  font-weight: 800;
  border-radius: 10px !important;
}

.row{
  display: flex;
  align-items: center;
  gap: 10px;
}

.is-2{
  margin: 0;
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
