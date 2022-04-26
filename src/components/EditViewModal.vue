<template>
    <base-modal
        id="edit-view-modal"
        button-classes="is-small is-gray"
        modal-header="Edit View"
        :max-title-length="30"
        @modalAction="updateView"
        modal-button-text="Update"
        @modalOpen="onOpenModal"
        ref="baseModal"
    >
        <template v-slot:button-contents>
            <span class="fa-solid fa-edit"></span>
        </template>
        
        <template v-slot:modal-content>
            <input v-model="title" class="input is-medium" type="text" placeholder="Add title" maxlength="30">
            
            <div class="control">
                <InputTagManager
                    :user-tags="userTags" :initial-tags="viewObj.tags.map(tag => ({text: tag}))"
                    @updateTags="updateTags"
                    ref="inputTagManager"
                />
            </div>
        </template>
    </base-modal>
</template>

<script>
import {auth, db, fieldValue} from '@/firebaseConfig';
import BaseModal from '@/components/BaseModal';
import InputTagManager from '@/components/InputTagManager';

export default {
    name: 'EditViewModal',
    components: {InputTagManager, BaseModal},
    props: {
        userTags: Array,
        views: Array,
        viewObj: Object
    },
    data: function() {
        return {
            title: this.viewObj.name,
            tags: this.viewObj.tags.map(tag => ({text: tag})),
        };
    },
    methods: {
        onOpenModal: function() {
            this.tags = this.viewObj.tags.map(tag => ({text: tag}));
            this.title = this.viewObj.name;
            this.$refs.inputTagManager.clear();
        },
        updateTags: function(updatedTags) {
            this.tags = updatedTags;
        },
        updateName(oldName, newName, views) {
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
        },
        updateView: function() {
            let name = this.title.trim();
            
            if(this.updateName(this.viewObj.name, name, this.views)) {
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
            this.$refs.baseModal.hideModal();
        }
    }
};
</script>

<style scoped>
#edit-view-modal >>> .is-gray {
    background-color: #68778F;
    font-weight: 800;
    border-radius: 10px;
}

#edit-view-modal >>> .is-gray:hover {
    background-color: #5A667A;
    font-weight: 800;
    border-radius: 10px;
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
