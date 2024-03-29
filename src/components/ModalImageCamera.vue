<template>
    <div class="modal base-modal">
        <div class="modal-background" @click="emitClose"></div>
        <div class="modal-content card">
            <header class="card-header">
                <p class="title card-header-title is-centered">Camera</p>
                <button class="delete" aria-label="close" @click="emitClose"></button>
            </header>
            
            <div class="card-content body-container">
                <div v-show="showVideo">
                    <video ref="video" @canplay="initCanvas()" playsinline>Stream unavailable</video>
                </div>
                <div v-show="!showVideo" class="canvas-container">
                    <canvas ref="canvas" class="canvas"/>
                </div>
            </div>
            
            <footer class="card-footer">
                <button v-show="showVideo && videoAvailable" class="card-footer-item create" @click="takePicture()">
                    <span class="title is-5">Take Picture</span>
                </button>
                <button v-show="!showVideo" class="card-footer-item create" @click="emitClose">
                    <span class="title is-5">Looks good!</span>
                </button>
                <button v-show="!showVideo" class="card-footer-item create" @click="retakePicture()">
                    <span class="title is-5">Retake</span>
                </button>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalImageCamera',
    data: function() {
        return {
            video: null,
            canvas: null,
            showVideo: true,
            videoAvailable: false,
            showCanvas: true,
            imageSrc: ''
        };
    },
    methods: {
        startCapture: function() {
            navigator.mediaDevices.getUserMedia({video: true, audio: false})
                .then(
                    stream => {
                        this.video.srcObject = stream;
                        this.video.play();
                        return new Promise(resolve => {
                            this.video.onplaying = resolve;
                        });
                    },
                    error => {
                        if(error.name === 'NotAllowedError' ||
                            error.name === 'PermissionDismissedError') {
                            alert('You need to allow camera access');
                            this.$emit('close');
                        }
                    }
                )
                .then(() => {
                    this.videoAvailable = true;
                })
                .catch(error => {
                    console.log(error);
                    alert('You need to allow camera access');
                    this.$emit('close');
                });
        },
        initCanvas: function() {
            this.canvas.setAttribute('width', this.video.videoWidth);
            this.canvas.setAttribute('height', this.video.videoHeight);
            this.showCanvas = false;
        },
        takePicture: function() {
            const context = this.canvas.getContext('2d');
            context.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight);
            this.showVideo = false;
            
            this.imageSrc = this.canvas.toDataURL('image/png');
            this.$emit('picture-taken', this.imageSrc);
        },
        retakePicture: function() {
            this.showVideo = true;
        },
        emitClose: function() {
            const tracks = this.$refs.video.srcObject.getTracks();
            tracks.forEach(track => {
                track.stop();
            });
            this.$emit('close');
        }
    },
    mounted: function() {
        this.video = this.$refs.video;
        this.canvas = this.$refs.canvas;
        this.startCapture();
    }
};
</script>

<style scoped>
.body-container {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}

.canvas-container {
    max-width: 95%;
    max-height: 100%;
    overflow: hidden;
}

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

.canvas {
    width: 100%;
    height: 100%;
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
