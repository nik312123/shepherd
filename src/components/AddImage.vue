<template>
  <div>
    <button class="button is-focused add-image-button" @click="showModal = true">
        <span class="icon">
            <i class="fas fa-image"></i>
        </span>
        <span>Add Image</span>
    </button>
    <select-image-modal 
      v-if="showModal" 
      @close="showModal = false" 
      v-bind:class="{ 'is-active': showModal }" 
      @picture-taken="emitImage"
      :showProgressBar="showProgressBar"
      :uploadValue="progressValue"
      />
  </div>
</template>

<script>
import SelectImageModal from './SelectImageModal.vue';
import { db, storage} from '@/firebaseConfig';
export default {
  components: { SelectImageModal },
  name: "AddImage",
  data() {
    return {
      showModal: false,
      imageSrc : null,
      showProgressBar : false,
      progressValue : 0
    };
  },
  methods : {
    emitImage : async function(event){
      console.log("Inside function emitImage")
      this.imageSrc = event
      console.log("ROUTEEE : ",this.$route.params.id)
      //this.$emit("picture-taken",this.imageSrc)
      //console.log("Done emitting")

      const blob = await (await fetch(event)).blob(); 
      const noteId = this.$route.params.id
      this.showProgressBar = true
      const imageRef = storage.ref('notes/'+noteId).put(blob)
      imageRef.on('state_changed', snapshot => {
          console.log("Snapshot : ",snapshot)
          this.progressValue = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      },error => {
          console.log(error.message)
      },
      ()=>{
          imageRef.snapshot.ref.getDownloadURL().then((url) => {
              console.log("URL : ",url)
              this.image = url
              //Update note
              db.collection('notes').doc(this.$route.params.id).update({
                  'imageUrl' : url
              }).then(() => {
                this.showModal = false
                this.showProgressBar = false
                this.progressValue = 0
              })
          })
      })
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