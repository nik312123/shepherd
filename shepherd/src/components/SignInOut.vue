<template>
  <div class>
    <template v-if="!user">
      <button @click="signIn" class="button is-info"><strong>Sign in with Google</strong>
      </button>
    </template>

    <template v-if="user">
      <img class="avatar" :src="user.photoURL" alt="avatar" referrerpolicy="no-referrer">
      <button @click="signOut" class="button is-info"><strong>Log out</strong>
      </button>
    </template>
  </div>
</template>

<script>
import {auth, provider} from "@/firebaseConfig";
import router from "@/router";
export default {
  name: "SignInOut",
  components: {},
  data() {
    return {
      user: null,
    };
  },
  beforeCreate: function() {
    auth.onAuthStateChanged(user => {
      if(user) {
        this.user = user;
      }
      else {
        this.user = null;
      }
    });
  },
  methods: {
    signIn: function() {
      auth.signInWithRedirect(provider)
          .then(result => {
            this.user = result.user;
          })
          .catch(err => console.log(err));
    },
    signOut: function() {
      auth.signOut()
          .then(() => {
            this.user = null;
            router.push("/");
          })
          .catch(err => console.log(err));
    }
  }
};
</script>

<style scoped>
.avatar {
  width: 2.6em;
  height: 2.6em;
  border-radius: 50%;
  margin-right: 10px;
}
.is-info {
  background-color: #10A5E9 !important;
  color: #FFFFFF;
}
</style>
