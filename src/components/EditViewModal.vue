<template>
    <div>
        
        <button @click="openModal" class="button is-info is-small is-gray">
            <span class="fa-solid fa-edit"></span>
        </button>
        
        <div :class="`${(showModal?'modal is-active':'modal')}`">
            <div @click="showModal=false" class="modal-background"></div>
            <div class="modal-content">
                
                <div class="card">
                    
                    <header class="card-header">
                        <p class="title card-header-title is-centered">
                          <span>
                          Edit View
                            </span>
                        </p>
                    </header>
                    
                    <div class="card-content">
                        <input
                            v-model="title" class="input is-medium" type="text" placeholder="Add Title" maxlength="30"
                        >
                        <div class="control">
                            <VueTagsInput
                                v-model="tag"
                                :tags="tags"
                                :autocomplete-items="filteredItems"
                                @tags-changed="newTags => {this.tags = newTags;}"
                            />
                        </div>
                    
                    </div>
                    <footer class="card-footer">
                        <p @click="updateView" class="card-footer-item create">
                          <span class="title is-5">
                            Update
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
import VueTagsInput from '@johmun/vue-tags-input';
import {auth, db, fieldValue} from '@/firebaseConfig';

export default {
    name: 'EditViewModal',
    components: {
        VueTagsInput
    },
    props: {
        userTags: Array,
        views: Array,
        viewObj: Object
    },
    data() {
        return {
            showModal: false,
            tag: '',
            tags: getTagsMap(this.viewObj.tags),
            title: this.viewObj.name
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
    watch: {
        tag: function() {
            this.tag = this.tag.toLowerCase();
        }
    },
    methods: {
        openModal: function() {
            this.tag = '';
            this.tags = getTagsMap(this.viewObj.tags);
            this.title = this.viewObj.name;
            this.showModal = true;
        },
        updateView: function() {
            let name = this.title.trim();
            
            if(updateName(this.viewObj.name, name, this.views)) {
                db.collection('views').doc(this.viewObj.id).update({
                    name: name
                });
            }
            
            if(this.tags.length === 0) {
                alert('Add at least one tag');
                this.showModal = true;
                return;
            }
            let tagsArray = [];
            this.tags.forEach(function(tag) {
                tagsArray.push(tag.text);
            });
            db.collection('views').doc(this.viewObj.id).update({
                tags: tagsArray
            });
            db.collection('users').doc(auth.currentUser.uid).get().then((doc) => {
                doc.ref.update({
                    'tags': fieldValue.arrayUnion(...tagsArray)
                });
            });
            this.showModal = false;
        }
    }
};

function getTagsMap(tags) {
    let array = [];
    tags.forEach((tag) => {
        array.push({text: tag});
    });
    return array;
}

function updateName(oldName, newName, views) {
    if(newName.length === 0 || newName.length > 30) {
        alert('View title has to be between 1 and 30 characters long');
        return false;
    }
    if(oldName.toLowerCase() === newName.toLowerCase()) {
        return false;
    }
    let add = true;
    views.forEach(function(view) {
        if(newName.toLowerCase() === view.name.toLowerCase()) {
            alert('You already have a view with this name');
            add = false;
        }
    });
    return add;
}

</script>

<style scoped>
.is-info {
    background-color: #10A5E9;
    font-weight: 800;
    border-radius: 10px !important;
}

.is-info:hover {
    background-color: #1282B6;
    font-weight: 800;
    border-radius: 10px !important;
}

.is-add {
    background-color: #10A5E9;
    font-weight: 800;
    border-radius: 10px !important;
    position: relative;
    top: 2px;
    padding: 5px;
    height: auto;
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

.is-gray {
    background-color: #68778F;
    font-weight: 800;
    border-radius: 10px !important;
}

.is-gray:hover {
    background-color: #5A667A;
    font-weight: 800;
    border-radius: 10px !important;
}
</style>
