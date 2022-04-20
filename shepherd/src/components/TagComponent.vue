<template>
  <div>
    <div v-if="tagArray" class="tags">
      <article v-for="tag in tagArray" :key="tag">
        <p class="tag">{{ tag }}</p>
      </article>
    </div>

    <div v-if="tagMap" class="tags">
      <article v-for="(key, value) in tagMap" v-bind:key="value">
        <p class="tag">{{ value }}</p>
      </article>
    </div>
  </div>
</template>

<script>
export default {
  name: "TagComponent",
  props: {
    tagArray: Array,
    tagMap: Object
  }
};
</script>

<style scoped>
.tag {
  background-color: #0E96D3;
  border-radius: 99999px;
  color: #F8FAFC;
  font-weight: 700;
  cursor: auto;
  margin: 6px 6px 6px 0;
}
</style>
