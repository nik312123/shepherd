<template>
    <base-modal
        id="modal-confirm"
        :button-classes="buttonClasses"
        :modal-header="modalText"
        :modal-buttons="[
            {buttonText: 'Yes', actionName: 'confirm', classes: 'red-color'},
            {buttonText: 'No', actionName: 'cancel'}
        ]"
        :additional-padding="12"
        @confirm="$emit('confirm')"
        @cancel="() => $refs.baseModal.hideModal()"
        ref="baseModal"
    >
        <template v-slot:button-contents>
            <slot name="button-contents"></slot>
        </template>
        
        <template v-slot:modal-content></template>
    </base-modal>
</template>

<script>
import BaseModal from '@/components/BaseModal';

export default {
    name: 'ModalConfirm',
    components: {BaseModal},
    props: {
        modalText: String,
        from: String,
        buttonClasses: String
    },
    methods: {
        hideModal: function() {
            this.$refs.baseModal.hideModal()
        }
    }
};
</script>

<style scoped>
>>> .red-color {
    background-color: #DC3F58;
}
</style>
