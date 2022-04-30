<template>
    <base-modal
        id="modal-note-edit"
        button-classes="is-small is-gray"
        modal-header="Edit Note"
        :max-title-length="30"
        @modalAction="updateNote"
        modal-button-text="Update"
        @modalOpen="onOpenModal"
        ref="baseModal"
    >
        <template v-slot:button-contents>
            <span class="fa-solid fa-edit view-button"></span>
        </template>

        <template v-slot:modal-content>
            <input v-model="title" class="input is-medium" type="text" placeholder="Add title" maxlength="30">

            <div class="control">
                <InputTagManager
                    :user-tags="userTags" :initial-tags="tags" @updateTags="updateTags" ref="inputTagManager"
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
                    v-model="reminderDate"
                    is-dark
                />
            </div>

            <div class="control is-centered">
                <ToggleButton
                    @click="isPublic = !isPublic" v-model="isPublic"
                    :color="{checked: '#68778F', unchecked: '#2A3444'}"
                    :sync="true"
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
import {auth, db, fieldValue} from '@/firebaseConfig';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import BaseModal from '@/components/BaseModal';
import InputTagManager from '@/components/InputTagManager';
import {ToggleButton} from 'vue-js-toggle-button';
import {dateToString} from '@/helpers/dateFormatter';

export default {
    name: 'ModalNoteEdit',
    components: {InputTagManager, BaseModal, DatePicker, ToggleButton},
    props: {
        userTags: Array,
        noteObj: Object
    },
    data: function() {
        return {
            title: this.noteObj.title,
            tags: Object.keys(this.noteObj.tags).map((tag) => ({text: tag})),
            reminder: false,
            reminderDate: this.noteObj.reminderDateTime ? this.noteObj.reminderDateTime.toDate() : null,
            isPublic: this.noteObj.isPublic
        };
    }
    ,
    computed: {
        formattedDate: function() {
            return this.reminderDate === null ? null : dateToString(this.reminderDate, false, true);
        }
    },
    methods: {
        onOpenModal: function() {
            this.tags = Object.keys(this.noteObj.tags).map((tag) => ({text: tag}));
            this.title = this.noteObj.title;
            this.reminderDate = this.noteObj.reminderDateTime ? this.noteObj.reminderDateTime.toDate() : null;
            this.reminder = false;
            this.isPublic = this.noteObj.isPublic;
            this.$refs.inputTagManager.reset();
        },
        updateTags: function(updatedTags) {
            this.tags = updatedTags;
        },
        updateNote: function() {
            let name = this.title.trim();
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
            db.collection('notes').doc(this.noteObj.id).update({
                title: name,
                isPublic: this.isPublic,
                tags: tagsMap,
                lastModifiedDateTime: curTimestamp,
                reminderDateTime: this.reminderDate === null ? null : this.reminderDate
            });
            this.$refs.baseModal.hideModal();
        }
    }
};

</script>

<style scoped>
#modal-note-edit >>> .datepicker-container {
    position: fixed !important;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 999999999;
}

#modal-note-edit >>> .datepicker {
    box-shadow: rgba(0, 0, 0, 0.50) 0 22px 70px 4px;
}

#modal-note-edit >>> .is-gray {
    background-color: #68778F;
    font-weight: 800;
    border-radius: 10px;
}

#modal-note-edit >>> .is-gray:hover {
    background-color: #5A667A;
    font-weight: 800;
    border-radius: 10px;
}

>>> .v-switch-label {
    font-weight: 700 !important;
}
</style>
