<template>
    <div class="home">
        <h1 class="title is-1"><strong>Welcome to Shepherd</strong></h1>
        <SignInOut/>
    </div>
</template>

<script>
import SignInOut from '@/components/SignInOut';
import HomeView from '@/views/HomeView';
import {auth} from '@/firebaseConfig';

export default {
    name: 'LoginView',
    components: {SignInOut},
    created: function() {
        if(auth.currentUser) {
            this.$router.replace({name: HomeView.name});
        }
    }
};
</script>

<style scoped>
img {
    width: 100px;
}

.title {
    padding-bottom: 15px;
}

.home {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    padding-top: 70px;
}
</style>
