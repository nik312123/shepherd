<template>
    <div class="base-modal">
        <button @click="openModal" :class="'modal-open-button button is-info ' + buttonClasses">
            <slot name="button-contents"></slot>
        </button>
        
        <div :class="'modal' + (showModal ? ' is-active' : '')">
            <div @click="showModal = false" class="modal-background"></div>
            <div class="modal-content">
                <div class="card" :style="additionalPadding ? `padding: ${additionalPadding}px;` : ''">
                    <header class="card-header">
                        <p class="title card-header-title is-centered">
                            <span>{{ modalHeader }}</span>
                        </p>
                    </header>
                    
                    <div class="card-content">
                        <slot name="modal-content"></slot>
                    </div>
                    <footer class="card-footer">
                        <!--suppress JSUnresolvedVariable -->
                        <p
                            v-for="modalButton in modalButtons"
                            :key="modalButton.buttonText"
                            @click="$emit(modalButton.actionName)"
                            :class="'card-footer-item create ' + (('classes' in modalButton) ? modalButton.classes : '')"
                        >
                            <!--suppress JSUnresolvedVariable -->
                            <span class="title is-5">{{ modalButton.buttonText }}</span>
                        </p>
                    </footer>
                </div>
            </div>
            <button @click="showModal = false" class="modal-close is-large" aria-label="close"></button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BaseModal',
    props: {
        buttonClasses: String,
        modalHeader: String,
        //Array of objects in the form {buttonText: <string>, actionName: <string>}
        modalButtons: Array,
        additionalPadding: Number
    },
    data: function() {
        return {
            showModal: false
        };
    },
    methods: {
        openModal: function() {
            this.showModal = true;
            this.$emit('modalOpen');
        },
        hideModal: function() {
            this.showModal = false;
        }
    }
};
</script>

<style>
.modal-open-button {
    background-color: #10A5E9;
    font-weight: 800;
    margin: 0 0 0 0;
}

.modal-open-button:hover {
    background-color: #1282B6;
    font-weight: 800;
}
</style>

<style scoped>
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

.card-header {
    box-shadow: 0 0 0 0;
    padding: 0;
    margin: 0;
}

.card-footer {
    border-top-width: 0;
}

.is-centered {
    text-align: center;
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

/* noinspection CssUnusedSymbol */
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

.card-content {
    padding-top: 5px;
}

/* noinspection CssUnusedSymbol */
.control {
    padding-top: 20px;
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
