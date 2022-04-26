<template>
    <base-modal
        id="create-note-modal"
        button-classes="is-add is-large"
        modal-header="New Note"
        :max-title-length="30"
        @modalAction="createNote"
        modal-button-text="Create"
        @modalOpen="onOpenModal"
        ref="baseModal"
    >
        <template v-slot:button-contents>
            <span class="fa-solid fa-file-circle-plus"></span>
        </template>
        
        <template v-slot:modal-content>
            <input v-model="title" class="input is-medium" type="text" placeholder="Add title" maxlength="30">
            
            <div class="control">
                <InputTagManager
                    :user-tags="userTags" :initial-tags="[]" @updateTags="updateTags" ref="inputTagManager"
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
        </template>
    </base-modal>
</template>

<script>
import {auth, db, fieldValue} from '@/firebaseConfig';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import NoteView from '@/views/NoteView';
import BaseModal from '@/components/BaseModal';
import InputTagManager from '@/components/InputTagManager';
import firebase from 'firebase/app';
import {dateToString} from '@/helpers/dateFormatter';

export default {
    name: 'CreateNoteModal',
    components: {InputTagManager, BaseModal, DatePicker},
    props: {
        userTags: Array,
        views: Array
    },
    data: function() {
        return {
            title: '',
            tags: [],
            reminder: false,
            reminderDate: null
        };
    },
    computed: {
        formattedDate: function() {
            return this.reminderDate === null ? null : dateToString(this.reminderDate);
        }
    },
    methods: {
        onOpenModal: function() {
            this.title = '';
            this.reminderDate = null;
            this.reminder = false;
            this.$refs.inputTagManager.clear();
        },
        updateTags: function(updatedTags) {
            this.tags = updatedTags;
        },
        createNote: function() {
            let name = this.title.trim();
            if(name.length === 0 || name.length > 30) {
                alert('View title has to be between 1 and 30 characters long');
                return;
            }
            
            if(this.tags.length === 0) {
                alert('A note must have at least one tag');
                return;
            }
            
            db.collection('users').doc(auth.currentUser.uid)
                .update({'tags': fieldValue.arrayUnion(...this.tags.map(tag => tag.text))});
            
            const curTimestamp = firebase.firestore.FieldValue.serverTimestamp();
            db.collection('notes').add({
                userId: auth.currentUser.uid,
                title: name,
                body: '# New note',
                isPublic: false,
                isTrash: false,
                tags: this.tags.map(tag => ({[tag.text]: true})),
                createdDateTime: curTimestamp,
                lastModifiedDateTime: curTimestamp,
                reminderDateTime:
                    this.reminderDate === null ? this.reminderDate :
                        firebase.firestore.Timestamp.fromDate(this.reminderDate)
            }).then((docRef) => {
                this.$router.push({name: NoteView.name, params: {id: docRef.id}});
            });
            this.$refs.baseModal.hideModal();
        }
    }
};

</script>

<style scoped>
.datepicker-container {
    position: fixed !important;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    z-index: 999999999;
}

.datepicker {
    box-shadow: rgba(0, 0, 0, 0.50) 0 22px 70px 4px;
}

label {
    color: white;
    font-weight: 700;
    font-size: 19px;
}

label:hover {
    color: white;
}

.checkboxes label {
    display: inline-block;
    padding-right: 10px;
    white-space: nowrap;
}

.checkboxes input {
    vertical-align: middle;
}

.checkboxes label span {
    vertical-align: middle;
}

#create-note-modal >>> .is-add {
    background-color: #10A5E9;
    font-weight: 800;
    border-radius: 99999px;
    padding: 5px;
    margin-bottom: 20px;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    width: 200px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    z-index: 30;
}

#create-note-modal >>> .fa-solid {
    padding: 10px;
}

>>> .vue-tags-input {
    background-color: #2A3444;
    border-radius: 10px;
}

>>> .ti-input {
    border: 0;
    color: #2A3444;
}

>>> .vue-tags-input .ti-new-tag-input {
    background: transparent;
    color: #F8FAFC;
    font-size: large;
    font-weight: 700;
}

>>> .vue-tags-input .ti-input {
    padding: 10px 10px;
    font-size: large;
    font-weight: 700;
}

>>> .vue-tags-input .ti-autocomplete {
    margin-top: 5px;
    padding: 10px;
    background: #2E3848;
    border: 0;
    border-radius: 10px;
    border-top: none;
    font-size: large;
    font-weight: 700;
    color: #F8FAFC;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
    position: relative;
}

>>> .vue-tags-input .ti-item.ti-selected-item {
    border-radius: 10px;
}

>>> .vue-tags-input ::-webkit-input-placeholder {
    color: #A4B1B6;
}

>>> .vue-tags-input ::-moz-placeholder {
    color: #A4B1B6;
}

>>> .vue-tags-input :-ms-input-placeholder {
    color: #A4B1B6;
}

>>> .vue-tags-input :-moz-placeholder {
    color: #A4B1B6;
}

>>> .vue-tags-input .ti-tag {
    height: 30px;
    border-radius: 10px;
}
</style>
