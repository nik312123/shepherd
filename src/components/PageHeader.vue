<template>
    <div id="page-header">
        <div id="page-header-content">
            <div id="shepherd-content">
                <img id="shepherd-logo" src="../assets/shepherd-icon.png" @click="redirectToHome" alt="logo">
                <h1
                    id="shepherd-header-title"
                    :style="'visibility: ' + (shepherdHeaderTitleVisible ? 'visible' : 'hidden')"
                    @click="redirectToHome"
                    :class="'title is-mobile is-' + shepherdHeaderTitleDenominator"
                >{{ shepherdHeaderTitleVisible ? 'Shepherd' : '.' }}</h1>
            </div>
            <ButtonAuthenticationGoogle class="comp"/>
        </div>
        <hr class="solid">
    </div>
</template>

<script>
import ButtonAuthenticationGoogle from '@/components/ButtonAuthenticationGoogle';

export default {
    name: 'PageHeader',
    components: {ButtonAuthenticationGoogle},
    data: function() {
        return {
            user: null,
            shepherdHeaderTitleDenominator: 3,
            shepherdHeaderTitleVisible: true
        };
    },
    created: function() {
        this.onResize();
        window.addEventListener('resize', this.onResize);
    },
    methods: {
        redirectToHome: function() {
            this.$router.push({name: 'HomeView'});
        },
        onResize: function() {
            const windowWidth = window.screen.width;
            this.shepherdHeaderTitleVisible = windowWidth > 340;
            this.shepherdHeaderTitleDenominator = windowWidth >= 400 ? 3 : 4;
        }
    }
};
</script>

<style scoped>
#page-header {
    overflow: auto;
}

#shepherd-content {
    display: inline-flex;
    align-items: center;
}

#page-header-content {
    height: 40px;
}

#shepherd-logo, #shepherd-header-title {
    cursor: pointer;
    display: inline-block;
    float: left;
}

#shepherd-header-title {
    white-space: nowrap;
}

img#shepherd-logo {
    width: 45px;
    margin-right: 10px;
    padding-top: 0;
}

hr.solid {
    border-top: 3px solid #2B3749;
}

.title {
    top: 4px;
}
</style>
