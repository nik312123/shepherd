<template>
    <div class="home">
        <h1 class="title is-1"><strong>Welcome to Shepherd</strong></h1>
        <ButtonAuthenticationGoogle/>
    </div>
</template>

<script>
import ButtonAuthenticationGoogle from '@/components/ButtonAuthenticationGoogle';
import {auth} from '@/firebaseConfig';

export default {
    name: 'LoginView',
    components: {ButtonAuthenticationGoogle},
    created: function() {
        if(auth.currentUser) {
            this.$router.replace({name: 'HomeView'});
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

.button-authentication-google {
    float: none;
}
</style>
