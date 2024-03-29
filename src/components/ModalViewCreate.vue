<template>
    <base-modal
        id="modal-view-create"
        button-classes="is-add is-medium"
        modal-header="New View"
        :modal-buttons="[{buttonText: 'Create', actionName: 'create'}]"
        @create="createView"
        @modal-open="onOpenModal"
        ref="baseModal"
    >
        <template v-slot:button-contents>
            <span class="fa-solid fa-folder-plus" title="Create view"></span>
        </template>
        
        <template v-slot:modal-content>
            <input v-model="title" class="input is-medium" type="text" placeholder="Add title" maxlength="30">
            <div class="control">
                <InputTagManager
                    :user-tags="userTags" :initial-tags="[]" @update-tags="updateTags" ref="inputTagManager"
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
    name: 'ModalViewCreate',
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
            this.$refs.inputTagManager.reset(this.tags);
        },
        updateTags: function(updatedTags) {
            this.tags = updatedTags;
        },
        createView: function() {
            const name = this.title.trim();
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
#modal-view-create >>> .is-add {
    background-color: #10A5E9;
    font-weight: 800;
    border-radius: 99999px;
    padding: 5px;
    width: 80px;
    height: 40px;
}
</style>
