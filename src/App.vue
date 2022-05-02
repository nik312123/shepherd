<template>
    <div id="app" class="container is-max-desktop">
        <notifications v-bind:closeOnClick=false>
            <template slot="body" slot-scope="props">
                <div class="vue-notification" @click="handleNotificationOnClick(props)">
                    <a class="close" @click.stop="props.close">
                        <span class="fa fa-fw fa-close"></span>
                    </a>
                    <a class="title">
                        {{ props.item.title }}
                    </a>
                    <div>
                        {{ props.item.data.noteBody }}
                    </div>
                </div>
            </template>
        </Notifications>
        <RouterView/>
    </div>
</template>

<script>
import {messaging} from '@/firebaseConfig';
import Notifications from 'vue-notification';

export default {
    components: {Notifications},
    mounted() {
        messaging.onMessage(payload => {
            console.log('Message received. ', payload);
            new Audio(require('@/assets/pristine-609.mp3')).play();
            this.$notify({
                title: payload.notification.title,
                duration: -1,
                data: {
                    noteId: payload.data.noteId,
                    noteBody: payload.notification.body
                }
            });
        });
    },
    methods: {
        handleNotificationOnClick(passedProp) {
            console.log('Got passed prop: ', JSON.stringify(passedProp));
            this.$router.push({name: 'note', params: {id: passedProp.item.data.noteId}}).then(() => {
                passedProp.close();
            });
        }
    }
};
</script>

<style>
/* Imports the Inter font from Google */
/* noinspection CssUnknownTarget */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap");

html {
    background-color: #1A2434;
}

* {
    font-family: "Inter", sans-serif;
}

.title {
    color: #F8FAFC;
    font-weight: 900;
}

.button {
    border-radius: 10px;
}

.breadcrumb li.is-active a {
    color: #F8FAFC;
}

.breadcrumb li + li::before {
    color: #F8FAFC;
}

.breadcrumb a {
    color: #0AA5E9;
    font-weight: 700;
}

.breadcrumb a:hover {
    color: #0AA5E9;
}

.section {
    padding: 0 5px 5px;
}

.container {
    padding: 40px 5px 5px;
}

.vue-notification {
    padding: 10px;
    margin: 0 5px 5px;
    
    font-size: 12px;
    color: #FFFFFF;
    background: #44A4FC;
    border: 2px solid #187FE7;
    border-radius: 5px;
}

.close {
    top: 0;
    right: 0;
    position: relative;
    float: right;
}
</style>
