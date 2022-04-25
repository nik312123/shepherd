<template>
  <div>
    <button @click="openModal" class="button is-info is-add is-large">
      <span class="fa-solid fa-file-circle-plus"></span>
    </button>

    <div :class="`${(showModal?'modal is-active':'modal')}`">
      <div @click="showModal=false" class="modal-background"></div>

      <div class="modal-content">

        <div class="card">
          <header class="card-header">
            <p class="title card-header-title is-centered">
          <span>
          New Note
            </span>
            </p>
          </header>
          <div class="card-content">
            <input v-model="title" class="input is-medium" type="text" placeholder="Add Title" maxlength="30">
            <div class="control">
              <vue-tags-input
                  v-model="tag"
                  :tags="tags"
                  :autocomplete-items="filteredItems"
                  @tags-changed="newTags => tags = newTags"
              />
            </div>
            <div class="control">
              <input @click="reminder=!reminder" v-model="reminderDate" class="input is-medium" type="text"
                     placeholder="Add reminder" readonly>
            </div>

            <div class="modal is-active" v-if="reminder" @click="reminder=false">
            </div>
            <div class="datepicker-container">
              <DatePicker class="datepicker" :available-dates="{ start: new Date(), end: null }" mode="datetime" v-if="reminder"
                          v-model="reminderDate"
                          is-dark/>
              </div>


          </div>
          <footer class="card-footer">
            <p @click="createNote" class="card-footer-item create">
      <span class="title is-5">
        Create
      </span>
            </p>
          </footer>
        </div>

      </div>
      <button @click="showModal=false" class="modal-close is-large" aria-label="close"></button>
    </div>
  </div>
</template>

<script>
import VueTagsInput from "@johmun/vue-tags-input";
import {auth, db, fieldValue} from "@/firebaseConfig";
import DatePicker from "v-calendar/lib/components/date-picker.umd";

export default {
  name: "CreateNoteModal",
  components: {
    VueTagsInput, DatePicker
  },
  props: {
    userTags: Array,
    views: Array

  },
  data() {
    return {
      showModal: false,
      tag: "",
      tags: [],
      title: "",
      reminder: false,
      reminderDate: null
    };
  }, watch: {
    tag: function() {
      this.tag = this.tag.toLowerCase();
    },
  },
  computed: {
    filteredItems() {
      let ac = [];
      this.userTags.forEach(function(tag) {
        ac.push({text: tag});
      });
      return ac.filter(i => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    }
  },
  methods: {
    openModal: function() {
      this.tag = "";
      this.tags = [];
      this.showModal = true;
      this.title = "";
      this.reminderDate = null;
      this.reminder = false;
    },
    createNote: function() {
      let name = this.title.trim();
      if(name.length === 0 || name.length > 30) {
        alert("View title has to be between 1 and 30 characters long");
        return;
      }

      let tagsArray = [];
      this.tags.forEach(function(tag) {
        tagsArray.push(tag.text);
      });

      let tagsMap = {};
      this.tags.forEach(function(tag) {
        tagsMap[tag.text] = true;
      });

      db.collection("users").doc(auth.currentUser.uid).get().then((doc) => {
        doc.ref.update({
          "tags": fieldValue.arrayUnion(...tagsArray)
        });
      });

      db.collection("notes").add({
        userId: auth.currentUser.uid,
        title: name,
        body: "# New note",
        isPublic: false,
        isTrash: false,
        tags: tagsMap,
        createdDateTime: new Date(),
        lastModifiedDateTime: new Date(),
        reminderDateTime: this.reminderDate
      }).then((docRef) => {
        this.$router.push("/note/"+docRef.id);
      });
      this.showModal = false;
    }
  }
};

</script>

<style scoped>

.datepicker-container {
  position: fixed !important;
  left:50%;
  top:50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  z-index: 999999999;
}

.datepicker {
  box-shadow: rgba(0, 0, 0, 0.50) 0px 22px 70px 4px;
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

.is-info {
  background-color: #10A5E9;
  font-weight: 800;
}

.is-info:hover {
  background-color: #1282B6;
  font-weight: 800;
}

.is-add {
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

.fa-solid {
  padding: 10px;
}

.modal-background {
  backdrop-filter: blur(10px);
  background-color: rgba(10, 10, 10, .5);
}

.card {
  background-color: #344155;
  border-radius: 10px;
  max-width: 500px;
  margin: auto;
  user-select: none;
}

.card-footer-item {
  background-color: #10A5E9;
  border-width: 0;
  user-select: none;
  cursor: pointer;
  border-radius: 10px;
  margin: 0 25px 25px;
}

.create {
  background-color: #0DBB92;
}

.card-footer {
  border-top-width: 0;
}

.input {
  font-weight: 700;
  color: #F8FAFC;
  background-color: #2A3444;
  border-color: #344155;
  border-radius: 10px;
}

.title {
  font-weight: 700;
  user-select: none;
  cursor: pointer;
  font-size: x-large;
}

.is-5 {
  font-size: large;
}

.card-header {
  box-shadow: 0 0 0 0;
  padding: 0;
  margin: 0;
}

.card-content {
  padding-top: 5px;
}

.control {
  padding-top: 20px;
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
  /*padding: 5px;*/
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
  /*position: relative;*/
  /*top: 3px;*/
  height: 30px;
  border-radius: 10px;
}

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #A4B1B6;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: #A4B1B6;
}

::-ms-input-placeholder { /* Microsoft Edge */
  color: #A4B1B6;
}

</style>
