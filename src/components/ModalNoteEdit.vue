<template>
    <div class="modal-note-edit">
        <div class="modal-background"></div>
        <div class="modal-card column is-three-quarters">
            <header class="modal-card-head">
                <p class="modal-card-title">Edit Note</p>
                <button class="delete" aria-label="close" @click="$emit('close')"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Title</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="Enter title of note here">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Reminder Date</label>
                    <div class="control">
                        <input class="input" type="date" placeholder="Enter title of note here">
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success">Save changes</button>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalNoteEdit',
    data() {
        return {};
    }
};
</script>