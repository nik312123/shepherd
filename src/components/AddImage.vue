<template>
    <div>
        <button class="button is-focused add-image-button" @click="showModal = true">
        <span class="icon">
            <span class="fas fa-image" style="font-style: italic;"></span>
        </span>
            <span>Add Image</span>
        </button>
        <select-image-modal
            v-if="showModal"
            @close="showModal = false"
            :class="{ 'is-active': showModal }"
            @picture-taken="emitImage"
            :showProgressBar="showProgressBar"
            :uploadValue="progressValue"
        />
    </div>
</template>

<script>
import SelectImageModal from './SelectImageModal.vue';
import {db, storage} from '@/firebaseConfig';

export default {
    components: {SelectImageModal},
    name: 'AddImage',
    data: function() {
        return {
            showModal: false,
            imageSrc: null,
            showProgressBar: false,
            progressValue: 0
        };
    },
    methods: {
        emitImage: async function(event) {

            const blob = await (await fetch(event)).blob();
            const noteId = this.$route.params.id;
            this.showProgressBar = true;
            const imageRef = storage.ref('notes/' + noteId).put(blob);

            imageRef.on('state_changed', snapshot => {

                    this.progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                }, error => {

                    console.log(error.message);
                    alert('Could not upload image');

                },
                () => {
                    imageRef.snapshot.ref.getDownloadURL().then((url) => {

                        this.image = url;
                        //Update note
                        db.collection('notes').doc(this.$route.params.id).update({
                            'imageUrl': url,
                            lastModifiedDateTime: new Date()
                        }).then(() => {
                            this.showModal = false;
                            this.showProgressBar = false;
                            this.progressValue = 0;
                        }).catch(err => {
                            alert('Something went wrong refresh the page');
                            console.log(err);
                        });
                    });
                }
            );
        }
    }
};
</script>

<style scoped>
.add-image-button {
    background-color: #0AA5E9 !important;
    font-weight: 700;
    color: white;
}
</style>