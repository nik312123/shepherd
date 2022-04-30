<template>
  <base-modal
      id="modal-note-create"
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
import {dateToString} from '@/helpers/dateFormatter';

export default {
  name: 'ModalNoteCreate',
  components: {InputTagManager, BaseModal, DatePicker},
  props: {
    userTags: Array,
    views: Array
  },
  data: function () {
    return {
      title: '',
      tags: [],
      reminder: false,
      reminderDate: null
    };
  },
  computed: {
    formattedDate: function () {
      return this.reminderDate === null ? null : dateToString(this.reminderDate, false, true);
    }
  },
  methods: {
    onOpenModal: function () {
      this.title = '';
      this.reminderDate = null;
      this.reminder = false;
      this.$refs.inputTagManager.reset();
    },
    updateTags: function (updatedTags) {
      this.tags = updatedTags;
    },
    createNote: function () {
      let name = this.title.trim();
      if (name.length === 0 || name.length > 30) {
        alert('View title has to be between 1 and 30 characters long');
        return;
      }

      if (this.tags.length > 0)
        db.collection('users').doc(auth.currentUser.uid)
            .update({'tags': fieldValue.arrayUnion(...this.tags.map(tag => tag.text))});

      let tagsMap = this.tags.map(tag => ({[tag.text]: true}));
      tagsMap = Object.assign({}, ...tagsMap);

      const curTimestamp = new Date();
      db.collection('notes').add({
        userId: auth.currentUser.uid,
        title: name,
        body: '# New note',
        isPublic: false,
        isTrash: false,
        tags: tagsMap,
        createdDateTime: curTimestamp,
        lastModifiedDateTime: curTimestamp,
        reminderDateTime: this.reminderDate === null ? null : this.reminderDate
      }).then(docRef => {
        this.$router.push({name: NoteView.name, params: {id: docRef.id, defaultTab: 'write'}});
      });

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

#modal-note-create >>> .fa-solid {
  padding: 10px;
}
</style>
