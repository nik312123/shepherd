<template>
  <div>
    <div @click="goToNote" class="card">
      <div>
        <header class="card-header">
          <p class="card-header-title">
            {{ note.title }}
          </p>
          <button class="card-header-icon" aria-label="more options">
            <TagComponent :tag-map="note.tags"/>
          </button>
        </header>
        <div class="card-content">
          <div class="content">
            {{ note.body }}
            <br>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import TagComponent from "@/components/TagComponent";

export default {
  name: "NoteComponent",
  components: {TagComponent},
  props: {
    note: Object
  },
  methods: {
    goToNote: function() {
      this.$router.push({name: "note", params: {id: this.note.id}});
    }
  }
};
</script>

<style scoped>
.card-header-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #F8FAFC;
  font-size: 20px;
  font-weight: 800;
  padding-top: 5px;
  padding-bottom: 0;
}

.card {
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  background-color: #344155;
  border-radius: 10px;
  user-select: none;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.content {
  color: #F8FAFC;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
}

.card-header {
  box-shadow: 0 0 0 0;
  padding: 0;
  margin: 0;
}

.card-content {
  padding-top: 0;
  padding-bottom: 10px;
}

.card-header-icon {
  padding: 0 10px 0 0;
}
</style>
