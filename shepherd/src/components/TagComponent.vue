<template>
  <div>
    <div v-if="tagArray" class="tags">
      <article v-for="tag in tagArray" :key="tag.key">
        <p class="tag">{{ tag }}</p>
      </article>
    </div>

    <div v-if="tagMap" class="tags note-tags">
      <article v-for="tag in displayTags(Object.keys(tagMap).sort())[0]" :key="tag.key">
        <p class="tag">{{ tag }}</p>
      </article>
      <span class="tag is-info is-light is-rounded" v-if="displayTags(Object.keys(tagMap).sort())[1] > 0">
        {{displayTags(Object.keys(tagMap).sort())[1]}}+
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "TagComponent",
  props: {
    tagArray: Array,
    tagMap: Object,
  },
  data() {
    return {
      currentWidth: Number
    }
  },
  created() {
    this.checkScreen();
    window.addEventListener("resize", this.checkScreen);
  },
  methods: {
    displayTags: function(tags) {
      let totalChars = 0;
      if (this.currentWidth < 320) {
        totalChars = 0;
      } else if (this.currentWidth < 500) {
        totalChars = this.currentWidth / 100;
      } else {
        totalChars = this.currentWidth / 30;
      }

      let i = 0;
      let displayedTags = [];
      while(totalChars > 0 && i < tags.length) {
        totalChars -= tags[i].length;
        displayedTags.push(tags[i]);
        i += 1;
      }
      let remainingTags = tags.length - displayedTags.length;
      return [displayedTags, remainingTags];
    },
    checkScreen() {
      this.currentWidth = window.innerWidth;
    }
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

.note-tags {
  float: right;
}
</style>
