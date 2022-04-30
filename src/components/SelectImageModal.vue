<template>
  <div class="modal background">
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
            <camera-image-modal v-if="showCamera" @close="closeImageModal()" v-bind:class="{ 'is-active': showCamera }" @picture-taken="emitImage" />
        </div>
        <div class="image-container" v-show="showImage">
            <div class="image">
                <img :src="imageSrc" />
            </div>
        </div>
      </section>
      <footer v-show="imageSrc !== null" class="modal-card-foot">
        <button class="button light-button"  @click="uploadImage()">
            <span class="icon">
                <i class="fas fa-save"></i>
            </span>
            <span>Save</span>
        </button>
        <button class="button dark-button"  @click="showButtons=true;showImage=false">
            <span class="icon">
                <i class="fas fa-arrow-rotate-right"></i>
            </span>
            <span>Reselect</span>    
        </button>
        <progress v-if="showProgressBar" class="progress is-info" :value="uploadValue" max="100">{{uploadValue}}%</progress>
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
      uploadValue : Number,
      showProgressBar : Boolean
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
      },
      emitImage(event){
          this.imageSrc = event
          this.showImage=true
          console.log("Inside emit Image")
      },
      uploadImage(){
          this.$emit("picture-taken",this.imageSrc)
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
.modal{
    background-color: rgba(10, 10, 10, .5);
}
.modal-header{

}
.modal-footer{

}

.light-button{
    background-color: #0AA5E9 !important;
    font-weight: 700;
    color: white;
}

.dark-button{
    background-color: rgba(10, 10, 10, .5) !important;
    font-weight: 700;
    color: white;
}
.card {
    background-color: #344155;
    border-radius: 10px;
    max-width: 500px;
    margin: auto;
    user-select: none;
}

.background{
    background-color: rgba(10, 10, 10, .5) !important;
}

#modal-image {
    background-color: #10A5E9;
    font-weight: 800;
    border-radius: 99999px;
    padding: 5px;
    margin-bottom: 20px;
    height: auto;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    width: 200px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    z-index: 30;
}

#modal-note-create >>> .fa-solid {
    padding: 10px;
}
</style>