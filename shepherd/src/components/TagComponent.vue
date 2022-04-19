<template>
    <div class="tags are-medium">
      <article v-for="tag in tags" :key="tag">
      <p class="tag">{{tag}}</p>
      </article>
    </div>
</template>

<script>
export default {
  name: "TagComponent",
  props: {
    tags: Array
  }
};
</script>

<style scoped>
.tag {
  background-color: #10A5E9;
  border-radius: 10px;
  color: #F8FAFC;
  font-weight: 700;
  cursor: auto;
  margin: auto auto auto 6px;
  width: auto;
}
</style>
