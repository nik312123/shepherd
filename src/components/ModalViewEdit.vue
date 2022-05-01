<template>
    <base-modal
        id="modal-view-edit"
        button-classes="is-small is-gray"
        modal-header="Edit View"
        :modal-buttons="[{buttonText: 'Update', actionName: 'update'}]"
        @update="updateView"
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
                    :user-tags="userTags" :initial-tags="tags"
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
    name: 'ModalViewEdit',
    components: {InputTagManager, BaseModal},
    props: {
        userTags: Array,
        views: Array,
        viewObj: Object
    },
    data: function() {
        return {
            title: this.viewObj.name,
            tags: this.viewObj.tags.map(tag => ({text: tag}))
        };
    },
    methods: {
        onOpenModal: function() {
            this.tags = this.viewObj.tags.map(tag => ({text: tag}));
            this.title = this.viewObj.name;
            this.$refs.inputTagManager.reset();
        },
        updateTags: function(updatedTags) {
            this.tags = updatedTags;
        },
        isViewNameValid: function(newName, oldName, views) {
            if(newName.length < 1 || newName.length > 30) {
                alert('View name has to be between 1 and 30 characters long');
                return false;
            }
            
            if(newName !== oldName) {
                for(let i = 0; i < views.length; ++i) {
                    if(newName.toLowerCase() === views[i].name.toLowerCase()) {
                        alert('You already have a view with this name');
                        return false;
                    }
                }
            }
            return true;
        },
        updateView: function() {
            const curName = this.title.trim();
            
            if(!this.isViewNameValid(curName, this.viewObj.name, this.views)) {
                return;
            }
            
            if(this.tags.length === 0) {
                alert('A view must have at least one tag');
                return;
            }
            
            const tagArr = this.tags.map(tag => tag.text);
            
            db.collection('views').doc(this.viewObj.id).update({name: curName, tags: tagArr});
            db.collection('users').doc(auth.currentUser.uid).update({'tags': fieldValue.arrayUnion(...tagArr)});
            
            this.$refs.baseModal.hideModal();
        }
    }
};
</script>

<style scoped>
#modal-view-edit >>> .is-gray {
    background-color: #68778F;
    font-weight: 800;
    border-radius: 10px;
}

#modal-view-edit >>> .is-gray:hover {
    background-color: #5A667A;
    font-weight: 800;
    border-radius: 10px;
}
</style>
