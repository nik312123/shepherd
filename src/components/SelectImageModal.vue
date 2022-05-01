<template>
  <div class="modal base-modal">
        <div class="modal-background" @click="$emit('close')"></div>
        <div class="modal-content">
        <div class="card"> 
            <header class="card-header">
                <p class="title card-header-title is-centered">Select Image</p>
                <button class="delete" aria-label="close" @click="$emit('close')"></button>
            </header>
            <div class="card-content">
                <div class="body-container">
                    <div class="field" v-show="showButtons">
                        <button @click="showCamera=true; showButtons=false" class="card-footer-item create">
                            
                            <span class="title is-5">Camera</span>
                        </button>
                    </div>
                    <div class="field" v-show="showButtons">
                        <button class="card-footer-item create" @click="triggerChooseFile">
                        
                            <span class="title is-5">Browse</span>
                        </button>
                        <input type="file" style="display:none" ref="fileInput" accept="image/png, image/gif, image/jpeg" @change="onFilePicked">
                    </div>
                    <camera-image-modal v-if="showCamera" @close="closeImageModal()" v-bind:class="{ 'is-active': showCamera }" @picture-taken="emitImage" />
                </div>
                <div class="image-container" v-show="showImage">
                    <img :src="imageSrc" class="image"/>
                </div>
                <div v-if="showProgressBar" class="progress-bar-container">
                    <p class="title is-5"> Uploading </p>
                    <progress v-if="showProgressBar" class="progress is-info" :value="uploadValue" max="100">{{uploadValue}}%</progress>
                </div>
            </div>
            <footer v-show="imageSrc !== null" class="card-footer">
                <button class="card-footer-item create"  @click="uploadImage()">

                    <span class="title is-5">Save</span>
                </button>
                <button class="card-footer-item create"  @click="showButtons=true;showImage=false; imageSrc=null">
                   
                    <span class="title is-5">Reselect</span>    
                </button>
            </footer>
        </div>
    </div>
  </div>
</template>

<script>
import CameraImageModal from '@/components/CameraImageModal.vue';

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
        showButtons : true,
        showImage : false
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
            var fileTypes = ['jpg', 'jpeg', 'png'];

            if(files && files[0]) {
                var extension = files[0].name.split('.').pop().toLowerCase(), 
                    isSuccess = fileTypes.indexOf(extension) > -1;  

                if (isSuccess) { 
                    this.showImage=true
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        
                        this.imageSrc = reader.result
                        this.showButtons=false
                        this.showImage=true
                    })

                    reader.readAsDataURL(files[0]);
                }
                else { 

                    alert("invalid file type")
                }
            }
      },
      emitImage(event){
          this.imageSrc = event
          this.showImage=true
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
    height: 70%;
    display: flex;
    justify-content: space-evenly;
}
.image-container{
    display: flex;
    justify-content: space-evenly;
    overflow: hidden;
}
.image{
    display: flex;
    justify-content: space-around;
    width: auto; 
    max-height: 350px;
}
</style>
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

.progress-bar-container{

    margin: 4% 0% 1% 0%;
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