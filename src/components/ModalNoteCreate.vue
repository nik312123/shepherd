<template>
    <base-modal
        id="modal-note-create"
        button-classes="is-add is-medium"
        modal-header="New Note"
        :modal-buttons="[{buttonText: 'Create', actionName: 'create'}]"
        @create="createNote"
        @modal-open="onOpenModal"
        ref="baseModal"
    >
        <template v-slot:button-contents>
            <span class="fa-solid fa-file-circle-plus" title="Create note"></span>
        </template>
        
        <template v-slot:modal-content>
            <input v-model="title" class="input is-medium" type="text" placeholder="Add title" maxlength="30">
            
            <div class="control">
                <InputTagManager
                    :user-tags="userTags" :initial-tags="tags" @update-tags="updateTags" ref="inputTagManager"
                />
            </div>
            
            <div class="control">
                <input
                    @click="reminder = !reminder" v-model="formattedDate" class="input is-medium" type="text"
                    placeholder="Add reminder" readonly
                >
            </div>
            
            <div class="modal is-active" v-if="reminder" @click="reminder = false"></div>
            
            <div class="datepicker-container">
                <DatePicker
                    class="datepicker"
                    :available-dates="{start: new Date(), end: null}"
                    mode="datetime"
                    v-if="reminder"
                    v-model="reminderDateTime"
                    is-dark
                />
            </div>
            
            <div class="control">
                <ToggleButton
                    v-model="isPublic"
                    :sync="true"
                    :color="{checked: '#68778F', unchecked: '#2A3444'}"
                    :labels="{checked: 'Public', unchecked: 'Private'}"
                    :width="98"
                    :height="35"
                    :font-size="15"
                    :margin="5"
                />
            </div>
        </template>
    </base-modal>
</template>

<script>
import {auth, db, fieldValue, messaging} from '@/firebaseConfig';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import BaseModal from '@/components/BaseModal';
import InputTagManager from '@/components/InputTagManager';
import {ToggleButton} from 'vue-js-toggle-button';
import {dateToString} from '@/helpers/dateFormatter';

export default {
    name: 'ModalNoteCreate',
    components: {InputTagManager, BaseModal, DatePicker, ToggleButton},
    props: {
        userTags: Array,
        startingTags: Array,
        startingDate: {
            type: Date,
            default: null
        },
        viewName: String,
        viewId: String
    },
    data: function() {
        return {
            title: '',
            tags: this.startingTags.map((tag) => ({text: tag})),
            reminder: false,
            reminderDateTime: this.startingDate,
            isPublic: false
        };
    },
    computed: {
        formattedDate: function() {
            return this.reminderDateTime === null ? null : dateToString(this.reminderDateTime, false, true);
        }
    },
    methods: {
        onOpenModal: function() {
            this.tags = this.startingTags.map((tag) => ({text: tag}));
            this.title = '';
            this.reminderDateTime = this.startingDate;
            this.reminder = false;
            this.isPublic = false;
            this.$refs.inputTagManager.reset(this.tags);
        },
        updateTags: function(updatedTags) {
            this.tags = updatedTags;
        },
        createNoteQuery: function(tagsMap, name, curTimestamp, messageToken) {
            const createData = {
                userId: auth.currentUser.uid,
                title: name,
                body: '# New note',
                isPublic: this.isPublic,
                isTrash: false,
                tags: tagsMap,
                createdDateTime: curTimestamp,
                lastModifiedDateTime: curTimestamp,
                reminderDateTime: this.reminderDateTime === null ? null : this.reminderDateTime
            };
            
            if(messageToken) {
                createData.messageToken = messageToken;
                createData.notified = false;
            }
            
            db.collection('notes').add(createData).then(docRef => {
                const textTags = this.tags.map(tag => tag.text);
                
                if(this.startingTags.every(tag => textTags.indexOf(tag) !== -1)) {
                    this.$router.push({
                        name: 'NoteView',
                        params:
                            {
                                id: docRef.id,
                                from: this.viewName,
                                viewName: this.viewName,
                                viewId: this.viewId,
                                defaultTab: 'write'
                            }
                    });
                }
                else {
                    this.$router.push({
                        name: 'NoteView',
                        params: {id: docRef.id, defaultTab: 'write'}
                    });
                }
            });
        },
        createNote: function() {
            const name = this.title.trim();
            if(name.length === 0 || name.length > 30) {
                alert('View title has to be between 1 and 30 characters long');
                return;
            }
            
            if(this.tags.length > 0) {
                db.collection('users').doc(auth.currentUser.uid)
                    .update({'tags': fieldValue.arrayUnion(...this.tags.map(tag => tag.text))});
            }
            
            let tagsMap = this.tags.map(tag => ({[tag.text]: true}));
            tagsMap = Object.assign({}, ...tagsMap);
            
            const curTimestamp = new Date();
            
            if(messaging === null) {
                this.createNoteQuery(tagsMap, name, curTimestamp);
            }
            else {
                messaging.getToken({
                    vapidKey: '***REMOVED***'
                }).then(messageToken => {
                    this.createNoteQuery(tagsMap, name, curTimestamp, messageToken);
                }).catch(() => {
                    this.createNoteQuery(tagsMap, name, curTimestamp);
                });
            }
            
            this.$refs.baseModal.hideModal();
        }
    }
};
</script>

<style scoped>
#modal-note-create >>> .datepicker-container {
    position: fixed !important;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 999999999;
}

#modal-note-create >>> .datepicker {
    box-shadow: rgba(0, 0, 0, 0.50) 0 22px 70px 4px;
}

#modal-note-create >>> .is-add {
    background-color: #10A5E9;
    font-weight: 800;
    border-radius: 99999px;
    padding: 5px;
    width: 80px;
    height: 40px;
}

#modal-note-create >>> .fa-solid {
    padding: 10px;
}

#modal-note-create {
    display: flex;
    justify-content: flex-end;
}
</style>
