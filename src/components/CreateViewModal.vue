<template>
    <base-modal
        id="create-view-modal"
        button-classes="is-add"
        modal-header="New View"
        :max-title-length="30"
        @modalAction="createView"
        modal-button-text="Create"
        @modalOpen="onOpenModal"
        ref="baseModal"
    >
        <template v-slot:button-contents>
            <span class="fa-solid fa-circle-plus"></span>
        </template>
        
        <template v-slot:modal-content>
            <input v-model="title" class="input is-medium" type="text" placeholder="Add title" maxlength="30">
            <div class="control">
                <InputTagManager
                    :user-tags="userTags" :initial-tags="[]" @updateTags="updateTags" ref="inputTagManager"
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
    name: 'CreateViewModal',
    components: {InputTagManager, BaseModal},
    props: {
        userTags: Array,
        views: Array
    },
    data: function() {
        return {
            tags: [],
            title: ''
        };
    },
    methods: {
        onOpenModal: function() {
            this.tags = [];
            this.title = '';
            this.$refs.inputTagManager.clear();
        },
        updateTags: function(updatedTags) {
            this.tags = updatedTags;
        },
        createView: function() {
            let name = this.title.trim();
            if(name.length === 0 || name.length > 30) {
                alert('View name has to be between 1 and 30 characters long');
                return;
            }
            
            if(this.tags.length === 0) {
                alert('A view must have at least one tag');
                return;
            }
            
            for(let i = 0; i < this.views.length; ++i) {
                if(name.toLowerCase() === this.views[i].name.toLowerCase()) {
                    alert('You already have a view with this name');
                    return;
                }
            }
            
            const tagsArr = this.tags.map(tag => tag.text);
            
            db.collection('views').add({
                name: name,
                sortedAsc: true,
                sortedColumn: 'lastModifiedDateTime',
                tags: tagsArr,
                userId: auth.currentUser.uid
            });
            db.collection('users').doc(auth.currentUser.uid).update({'tags': fieldValue.arrayUnion(...tagsArr)});
            this.$refs.baseModal.hideModal();
        }
    }
};

</script>

<style scoped>
#create-view-modal >>> .is-add {
    background-color: #10A5E9;
    font-weight: 800;
    border-radius: 10px;
    position: relative;
    top: 2px;
    padding: 5px;
    height: auto;
    font-size: 22px;
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
