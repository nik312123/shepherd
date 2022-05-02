<template>
    <div class="home">
        <img id="shepherd-logo" src="../assets/shepherd-icon.png" alt="logo">
        <h1 class="title is-1"><strong>Welcome to Shepherd</strong></h1>
        <hr class="solid">
        <h2 class="title is-3"><strong>Are you ready to <span class="blue">organize</span> your life?</strong></h2>
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
    width: 180px;
    margin-bottom: 20px;
}

.home {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    padding-top: 60px;
}

.is-3 {
    max-width: 300px;
    margin: auto;
}

.button-authentication-google {
    margin-top: 40px;
    float: none;
}

.blue {
    background: #419AE8;
    background: linear-gradient(to top, #419AE8 0%, #25C1E8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

hr.solid {
    border-top: 3px solid #2B3749;
    width: 200px;
    margin: auto auto 30px;
}
</style>
