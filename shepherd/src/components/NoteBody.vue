<template>
  <div>
<!--    <button class="button is-link" v-if="showSave">Save</button>-->
    <editor class="editor" :options="options" previewStyle="tab" ref="bodyEditor" height="1000px" :initialValue="newBody" @change="onEditorChange"></editor>

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
      showSave: false,
      options: {
        hideModeSwitch: true
      }
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
  border-radius: 10px;
  margin: 20px 0;
}

.toastui-editor-defaultUI{
  border-radius: 10px;
}

.toastui-editor-defaultUI-toolbar{
  border-top-right-radius: 10px;
}

.toastui-editor-defaultUI .toastui-editor-md-tab-container{
  border-top-left-radius: 10px;
}

.button {
  margin: 10px 10px 10px 0;
}
</style>
