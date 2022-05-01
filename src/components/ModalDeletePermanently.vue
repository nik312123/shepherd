<template>
    <base-modal
        id="modal-delete-permanently"
        button-classes="is-small delete-button"
        modal-header="Are you sure you want to permanently delete this note?"
        :modal-buttons="[
            {buttonText: 'Yes', actionName: 'confirm'},
            {buttonText: 'No', actionName: 'cancel'}
        ]"
        :additional-padding="12"
        @confirm="deletePermanently"
        @cancel="() => $refs.baseModal.hideModal()"
        ref="baseModal"
    >
        <template v-slot:button-contents>
            <span class="fa-solid fa-file-circle-xmark view-button"></span>
        </template>
        
        <template v-slot:modal-content></template>
    </base-modal>
</template>

<script>
import BaseModal from '@/components/BaseModal';
import {db} from '@/firebaseConfig';

export default {
    name: 'ModalDeletePermanently',
    components: {BaseModal},
    props: {
        noteId: String
    },
    methods: {
        deletePermanently: function() {
            db.collection('notes').doc(this.noteId).delete();
            this.$router.push({name: 'trash'});
            this.$refs.baseModal.hideModal();
        }
    }
};
</script>
