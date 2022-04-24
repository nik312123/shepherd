<template>
  <div>
    <button class="button is-info is-focused" @click="showModal = true">
        <span class="icon">
            <i class="fas fa-image"></i>
        </span>
        <span>Add Image</span>
    </button>
    <select-image-modal v-if="showModal" @close="showModal = false" v-bind:class="{ 'is-active': showModal }" @picture-taken="imageSrc = $event"/>
    <img :src="imageSrc" />
  </div>
</template>

<script>
import SelectImageModal from './SelectImageModal.vue';
export default {
  components: { SelectImageModal },
  name: "AddImage",
  data() {
    return {
      showModal: false,
      imageSrc : null
    };
  }
};
</script>

<style scoped>

</style>