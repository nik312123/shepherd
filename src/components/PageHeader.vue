<template>
    <div class="page-header">
        <ButtonAuthenticationGoogle class="comp"/>
        <img id="shepherd-logo" src="../assets/temp.png" @click="redirectToHome" alt="logo">
        <h1
            id="shepherd-header-title"
            :style="'visibility: ' + (shepherdHeaderVisible ? 'visible' : 'hidden')"
            @click="redirectToHome"
            class="title is-3"
        >Shepherd</h1>
        <hr class="solid">
    </div>
</template>

<script>
import ButtonAuthenticationGoogle from '@/components/ButtonAuthenticationGoogle';
import HomeView from '@/views/HomeView';

export default {
    name: 'PageHeader',
    components: {ButtonAuthenticationGoogle},
    data: function() {
        return {
            user: null,
            shepherdHeaderVisible: true
        };
    },
    created: function() {
        this.checkScreen();
        window.addEventListener('resize', this.checkScreen);
    },
    methods: {
        redirectToHome: function() {
            this.$router.push({name: HomeView.name});
        },
        checkScreen: function() {
            const windowWidth = window.innerWidth;
            this.shepherdHeaderVisible = windowWidth > 448;
        }
    }
};
</script>

<style scoped>
#shepherd-logo, #shepherd-header-title {
    cursor: pointer;
}

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
