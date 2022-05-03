<template>
    <div class="button-authentication-google">
        <template v-if="!user">
            <button @click="signIn" class="button is-info"><strong>Sign in with Google</strong>
            </button>
        </template>
        
        <template v-if="user">
            <!-- https://stackoverflow.com/a/63502512 seems to work far more consistently than referrerpolicy="no-referrer" -->
            <img class="avatar" :src="user.photoURL" alt="avatar" rel="noreferrer" referrerpolicy="origin">
            <button @click="signOut" class="button is-info"><strong>Log out</strong>
            </button>
        </template>
    </div>
</template>

<script>
import {auth, provider} from '@/firebaseConfig';
import router from '@/router';
import {isMobile} from '@/helpers/mobileDetector';

export default {
    name: 'ButtonAuthenticationGoogle',
    components: {},
    data: function() {
        return {
            user: null
        };
    },
    beforeCreate: function() {
        auth.onAuthStateChanged(user => {
            this.user = user ? user : null;
        });
    },
    methods: {
        signInWithRedirect: function() {
            auth.signInWithRedirect(provider)
                .then(result => {
                    // noinspection JSUnresolvedVariable
                    this.user = result.user;
                })
                .catch(error => console.log(error));
        },
        signIn: function() {
            if(isMobile()) {
                this.signInWithRedirect();
            }
            else {
                auth.signInWithPopup(provider)
                    .then(result => {
                        // noinspection JSUnresolvedVariable
                        this.user = result.user;
                    })
                    .catch(() => this.signInWithRedirect());
            }
        },
        signOut: function() {
            auth.signOut()
                .then(() => {
                    this.user = null;
                    router.push({name: 'LoginView'});
                })
                .catch(error => console.log(error));
        }
    }
};
</script>

<style scoped>
.button-authentication-google {
    display: inline-block;
    float: right;
}

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

button {
    top: -10px;
    margin-right: 0;
}
</style>
