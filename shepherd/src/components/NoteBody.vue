<template>
  <div>
    <editor class="editor" ref="bodyEditor" :initialValue="newBody" @change="onEditorChange"></editor>
    <button class="button is-link" v-if="showSave">Save</button>

  </div>
</template>

<script>
import "@toast-ui/editor/dist/toastui-editor.css";
import {Editor} from "@toast-ui/vue-editor";

export default {
  name: "NoteBody",
  props: ["body"],
  components: {
    editor: Editor
  },
  data() {
    return {
      newBody: this.body,
      showSave: false
    };
  },
  methods: {
    onEditorChange: function() {
      this.showSave = true;
    }
  }
};
</script>

<style>

.editor {
  background-color: white;
  border-radius: 15px;
  margin: 20px 0;
}

.button {
  margin: 10px 10px 10px 0;
}
</style>