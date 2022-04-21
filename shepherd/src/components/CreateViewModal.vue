<template>
  <div>
    <button @click="openModal" class="button is-info">
      <span class="fa-solid fa-circle-plus"></span>
    </button>
    <div :class="`${(showModal?'modal is-active':'modal')}`">
      <div @click="showModal=false" class="modal-background"></div>
      <div class="modal-content">

        <div class="card">

          <header class="card-header">
            <p class="title card-header-title is-centered">
          <span>
          New View
            </span>
            </p>
          </header>

          <div class="card-content">
            <input v-model="title" class="input is-medium" type="text" placeholder="Add Title">
            <div class="control">
              <vue-tags-input
                  v-model="tag"
                  :tags="tags"
                  :autocomplete-items="filteredItems"
                  @tags-changed="newTags => tags = newTags"
              />
            </div>

          </div>
          <footer class="card-footer">
            <p @click="createView" class="card-footer-item create">
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

export default {
  name: "CreateViewModal",
  components: {
    VueTagsInput
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
      title: ""
    };
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
    },
    createView: function() {
      let name = this.title.trim();
      if(name.length === 0) {
        alert("View title has to be at least 1 character long");
        return;
      }
      if(this.tags.length === 0) {
        alert("Add at least one tag");
        return;
      }
      let add = true;
      this.views.forEach(function(view) {
        if(name.toLowerCase() === view.name.toLowerCase()) {
          alert("You already have a view with this name");
          add = false;
        }
      });
      if(add) {
        let tagsArray = [];
        this.tags.forEach(function(tag) {
          tagsArray.push(tag.text);
        });
        db.collection("views").add({
          name: name,
          sortedAsc: false,
          sortedColumn: "title",
          tags: tagsArray,
          userId: auth.currentUser.uid
        });
        db.collection("users").doc(auth.currentUser.uid).get().then((doc) => {
          doc.ref.update({
            "tags": fieldValue.arrayUnion(...tagsArray)
          });
        });
        this.showModal = false;
      }
    }
  }
};

</script>

<style scoped>
.is-info {
  background-color: #10A5E9;
  font-weight: 800;
  border-radius: 10px !important;
  position: relative;
  top: 2px;
  padding: 5px;
  height: auto;
}

.is-info:hover {
  background-color: #1282B6;
  font-weight: 800;
  border-radius: 10px !important;
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

.inputMargin {
  margin-top: 20px;
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
