<template>
  <div>
    <sign-in-out></sign-in-out>
    <h1 class="title is-5"><strong>Let's begin, {{display}}</strong></h1>
  </div>
</template>

<script>
import SignInOut from "@/components/SignInOut";
import {auth} from "@/firebaseConfig";
export default {
  name: "HomeView",
  components: {SignInOut},
  data() {
    return {
      display: auth.currentUser.displayName
    };
  }
};
</script>

<style scoped>

</style>
