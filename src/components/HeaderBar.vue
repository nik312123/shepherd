<template>
    <div>
        <SignInOut class="comp"/>
        <img style="cursor: pointer;" @click="redirectToHome" alt="logo" src="../assets/temp.png">
        <h1 v-if="!isMobile" style="cursor: pointer;" @click="redirectToHome" class="title is-3">Shepherd</h1>
        <h1 v-if="isMobile" style="visibility: hidden;" @click="redirectToHome" class="title is-3">.</h1>
        <hr class="solid">
    </div>
</template>

<script>
import SignInOut from '@/components/SignInOut';

export default {
    name: 'HeaderBar',
    components: {SignInOut},
    data() {
        return {
            user: null,
            isMobile: false
        };
    },
    created() {
        this.checkScreen();
        window.addEventListener('resize', this.checkScreen);
    },
    methods: {
        redirectToHome() {
            this.$router.push('/home');
        },
        checkScreen() {
            const windowWidth = window.innerWidth;
            if(windowWidth <= 448) {
                this.isMobile = true;
                return;
            }
            this.isMobile = false;
        }
    }
};
</script>

<style scoped>
.comp {
    float: right;
}

img {
    width: 40px;
    margin-right: 10px;
    float: left;
    padding-top: 2px;
}

hr.solid {
    border-top: 3px solid #2B3749;
}

.title {
    position: relative;
    top: 4px;
    width: 210px;
}
</style>
