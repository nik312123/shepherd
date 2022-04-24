<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card column is-three-quarters">
      <header class="modal-card-head">
        <p class="modal-card-title">Camera</p>
        <button class="delete" aria-label="close" @click="$emit('close')"></button>
      </header>
      <section class="modal-card-body">
        <div class="body-container">
            <div v-show="showVideo">
                <video ref="video" @canplay="initCanvas()">Stream unavailable </video>
            </div>
            <div v-show="!showVideo" class="canvas-container">
                <canvas ref="canvas"/>
            </div>
            
        </div>
      </section>
      <footer class="modal-card-foot">
        <button v-show="showVideo" class="button is-info" @click="clickPicture()">
            <span class="icon">
                <i class="fas fa-camera-retro"></i>
            </span>
            <span>Click</span>
        </button>
        <button v-show="!showVideo" class="button is-success" @click="$emit('close')">
            <span class="icon">
                <i class="fas fa-thumbs-up"></i>
            </span>
            <span>Looks good!</span>
        </button>
        <button v-show="!showVideo" class="button is-danger" @click="retakePicture()">
            <span class="icon">
                <i class="fas fa-thumbs-down"></i>
            </span>
            <span>Retake</span>
        </button>
        
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "CameraImageModal",
  data() {
    return {
        video : null,
        canvas : null,
        showVideo : true,
        showCanvas : true,
        imageSrc : ""
    };
  },
  mounted(){
      this.video = this.$refs.video
      this.canvas = this.$refs.canvas
      this.startCapture()
  },
  methods : {
      startCapture(){
          navigator.mediaDevices.getUserMedia({video:true,audio: false}).then(stream => {
              this.video.srcObject = stream
              this.video.play()
          }).catch(err => {
              console.log(err)
          })
      },
      initCanvas(){
          this.canvas.setAttribute('width',this.video.videoWidth)
          this.canvas.setAttribute('height',this.video.videoHeight)
          this.showCanvas = false;
      },
      clickPicture(){
          let context = this.canvas.getContext('2d')
          context.drawImage(this.video,0,0, this.video.videoWidth, this.video.videoHeight)
          this.showVideo = false;
        
          this.imageSrc = this.canvas.toDataURL('image/png');
          this.$emit('picture-taken', this.imageSrc)
          
      },
      retakePicture(){
          this.showVideo = true;
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
.canvas-container{

}
</style>