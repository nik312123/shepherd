<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card column is-three-quarters">
      <header class="modal-card-head">
        <p class="modal-card-title">Select Image</p>
        <button class="delete" aria-label="close" @click="$emit('close')"></button>
      </header>
      <section class="modal-card-body">
        <div class="body-container">
            <div class="field" v-show="showButtons">
                <button @click="showCamera=true; showButtons=false" class="button is-light">
                    <span class="icon">
                        <i class="fas fa-camera"></i>
                    </span>
                    <span>Camera</span>
                </button>
            </div>
            <div class="field" v-show="showButtons">
                <button class="button is-light" @click="triggerChooseFile">
                   <span class="icon">
                        <i class="fas fa-file"></i>
                    </span>
                    <span>Browse</span>
                </button>
                <input type="file" style="display:none" ref="fileInput" accept="image/" @change="onFilePicked">
            </div>
            <camera-image-modal v-if="showCamera" @close="closeImageModal()" v-bind:class="{ 'is-active': showCamera }" @picture-taken="imageSrc = $event; showImage=true" />
        </div>
        <div class="image-container" v-show="showImage">
            <div class="image">
                <img :src="imageSrc" />
            </div>
        </div>
      </section>
      <footer v-show="imageSrc !== null" class="modal-card-foot">
        <button class="button is-success"  @click="uploadImage()">
            <span class="icon">
                <i class="fas fa-save"></i>
            </span>
            <span>Save</span>
        </button>
        <button class="button is-danger"  @click="showButtons=true;showImage=false">
            <span class="icon">
                <i class="fas fa-arrow-rotate-right"></i>
            </span>
            <span>Reselect</span>    
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import CameraImageModal from './CameraImageModal.vue';
export default {
  components: { CameraImageModal },
  name: "SelectImageModal",
  props: {

  },
  data() {
    return {
        showCamera : false,
        imageSrc : null,
        showButtons : true
    };
  },
  methods: {
      closeImageModal(){
          this.showCamera = false;
          if(this.imageSrc === null)
            this.showButtons = true;
      },
      triggerChooseFile(){
          this.$refs.fileInput.click();
      },
      onFilePicked(event){
            const files = event.target.files

            const fileReader = new FileReader()
            fileReader.addEventListener('load', () => {
                this.imageSrc = fileReader.result
                console.log("READ image")
            })
            this.showImage=true
            fileReader.readAsDataURL(files[0])
      }
  }
};
</script>

<style scoped>
.body-container{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}
.image-container{
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}
.image{
    display: flex;
    justify-content: space-around;
    max-width: 50%;
    max-height: 50%;
}
</style>