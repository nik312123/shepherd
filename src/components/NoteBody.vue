<template>
    <div class="note-body">
        <button class="button is-info save" v-if="showSave && owner" @click="saveNote">Save</button>
        <Editor
            class="editor"
            :options="options"
            preview-style="tab"
            ref="bodyEditor"
            height="1000px"
            :initial-value="newBody"
            @change="onEditorChange"
        />
    </div>
</template>

<script>
import '@toast-ui/editor/dist/toastui-editor.css';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';

import {Editor} from '@toast-ui/vue-editor';
import {db} from '@/firebaseConfig';
import codeSyntaxHighlight
    from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all';

export default {
    name: 'NoteBody',
    props: {
        body: String,
        id: String,
        defaultTab: String,
        owner: Boolean
    },
    components: {Editor},
    data: function() {
        return {
            newBody: this.body,
            showSave: false,
            options: {
                hideModeSwitch: true,
                toolbarItems: [
                    ['bold', 'italic', 'strike'],
                    ['ul', 'ol', 'task'],
                    ['link', 'code']
                ],
                plugins: [codeSyntaxHighlight]
            }
        };
    },
    methods: {
        onEditorChange: function() {
            this.newBody = this.$refs.bodyEditor.invoke('getMarkdown');
            this.showSave = this.newBody !== this.body;
        },
        saveNote: function() {
            db.collection('notes').doc(this.id).update({
                body: this.newBody,
                lastModifiedDateTime: new Date()
            });
            this.showSave = false;
        }
    },
    mounted: function() {
        if(this.defaultTab !== 'write') {
            for(const tab of document.querySelectorAll('div.tab-item')) {
                if(tab.textContent.includes('Preview')) {
                    // This timeout is needed, or some styles break
                    setTimeout(() => tab.click(), 10);
                    if(!this.owner) {
                        document.querySelector('.toastui-editor-toolbar').remove();
                        document.querySelector('.toastui-editor-defaultUI').style.borderRadius = '10px';
                        document.querySelector('.toastui-editor-md-container').style.borderRadius = '10px';
                        document.querySelector('.editor').style.borderRadius = '10px';
                    }
                    break;
                }
            }
        }
    }
};
</script>

<style>
.save {
    background-color: #0AA5E9 !important;
    font-weight: 700;
}

.note-body {
    margin-top: 20px;
}

.editor {
    background-color: #232428;
}

.button {
    margin: 10px 10px 10px 0;
}

.toastui-editor-defaultUI .toastui-editor-md-tab-container {
    background-color: rgba(35, 35, 35, 0.25) !important;
}

.toastui-editor-defaultUI {
    border-color: #494C56;
    color: #EEEEEE;
}

.toastui-editor-md-container,
.toastui-editor-ww-container {
    background-color: #121212;
}

.toastui-editor-defaultUI-toolbar {
    background-color: #232428;
    border-bottom-color: #303238;
}

.toastui-editor-defaultUI-toolbar button {
    border: 1px solid #2C2D31;
}

.toastui-editor-toolbar-icons {
    background-position-y: -49px;
    border-color: #232428;
}

.toastui-editor-toolbar-icons:not(:disabled):hover {
    background-color: #36383F !important;
    border-color: #36383F;
}

.toastui-editor-toolbar-divider {
    background-color: #303238;
}

.toastui-editor-tooltip {
    background-color: #535662;
}

.toastui-editor-tooltip .arrow {
    background-color: #535662;
}

.toastui-editor-defaultUI-toolbar .scroll-sync::before {
    color: #8F939F;
}

.toastui-editor-defaultUI-toolbar .scroll-sync.active::before {
    color: #67CCFF;
}

.toastui-editor-defaultUI-toolbar .switch {
    background-color: #2B4455;
}

.toastui-editor-defaultUI-toolbar input:checked + .switch {
    background-color: #2B4455;
}

.toastui-editor-defaultUI-toolbar .switch::before {
    background-color: #8F939F;
}

.toastui-editor-defaultUI-toolbar input:checked + .switch::before {
    background-color: #67CCFF;
}

.toastui-editor-main .toastui-editor-md-splitter {
    background-color: #303238;
}

.toastui-editor-mode-switch {
    border-top-color: #393B42;
    background-color: #121212;
}

.toastui-editor-mode-switch .tab-item {
    border-color: #393B42;
    background-color: #232428;
    color: #757A86;
}

.toastui-editor-mode-switch .tab-item.active {
    border-top-color: #121212;
    background-color: #121212;
    color: #EEEEEE;
}

.toastui-editor-popup,
.toastui-editor-context-menu {
    background-color: #121212;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
    border-color: #494C56;
}

.toastui-editor-popup-add-heading ul li:hover {
    background-color: #36383F;
}

.toastui-editor-popup-body label {
    color: #9A9DA3;
}

.toastui-editor-popup-body input[type="text"] {
    background-color: transparent;
    color: #EEEEEE;
    border-color: #303238;
}

.toastui-editor-popup-body input[type="text"]:focus {
    outline-color: #67CCFF;
}

.toastui-editor-popup-body input[type="text"].disabled {
    color: #969AA5;
    border-color: #303238;
    background-color: rgba(48, 50, 56, 0.4);
}

.toastui-editor-popup-add-image .toastui-editor-tabs .tab-item {
    border-bottom-color: #292E37;
    color: #EEEEEE;
}

.toastui-editor-popup-add-image .toastui-editor-tabs .tab-item:hover {
    border-bottom-color: #3C424D;
}

.toastui-editor-popup-add-image .toastui-editor-tabs .tab-item.active {
    color: #67CCFF;
    border-bottom-color: #67CCFF;
}

.toastui-editor-popup-body .toastui-editor-file-name {
    border-color: #303238;
    color: #EEEEEE;
}

.toastui-editor-popup-body .toastui-editor-file-select-button {
    border-color: #303238;
    background-color: #232428;
    color: #EEEEEE;
}

.toastui-editor-popup-body .toastui-editor-file-select-button:hover {
    border-color: #494C56;
}

.toastui-editor-defaultUI .toastui-editor-close-button {
    color: #EEEEEE;
    border-color: #303238;
    background-color: #232428;
}

.toastui-editor-defaultUI .toastui-editor-close-button:hover {
    border-color: #494C56;
}

.toastui-editor-defaultUI .toastui-editor-ok-button {
    color: #121212;
    background-color: #67CCFF;
}

.toastui-editor-defaultUI .toastui-editor-ok-button:hover {
    color: #121212;
    background-color: #32BAFF;
}

.toastui-editor-popup-add-table .toastui-editor-table-cell {
    border-color: #303238;
    background-color: #121212;
}

.toastui-editor-popup-add-table .toastui-editor-table-cell.header {
    border-color: #303238;
    background-color: #232428;
}

.toastui-editor-popup-add-table .toastui-editor-table-selection-layer {
    border-color: rgba(103, 204, 255, 0.4);
    background-color: rgba(103, 204, 255, 0.1);
}

.toastui-editor-popup-add-table .toastui-editor-table-description {
    color: #EEEEEE
}

.toastui-editor-md-tab-container {
    background-color: #232428;
    border-bottom-color: #303238;
}

.toastui-editor-md-tab-container .tab-item {
    border-color: #393B42;
    background-color: #2D2F34;
    color: #757A86;
}

.toastui-editor-md-tab-container .tab-item.active {
    border-bottom-color: #121212;
    background-color: #121212;
    color: #EEEEEE;
}

.toastui-editor-context-menu .menu-group {
    border-bottom-color: #303238;
    color: #EEEEEE;
}

.toastui-editor-context-menu .menu-item span::before {
    background-position-y: -126px;
}

.toastui-editor-context-menu li:not(.disabled):hover {
    background-color: #36383F;
}

.toastui-editor-context-menu li.disabled {
    color: #969AA5;
}

.toastui-editor-dropdown-toolbar {
    border-color: #494C56;
    background-color: #232428;
}

.ProseMirror,
.toastui-editor-contents p,
.toastui-editor-contents h1,
.toastui-editor-contents h2,
.toastui-editor-contents h3,
.toastui-editor-contents h4,
.toastui-editor-contents h5,
.toastui-editor-contents h6 {
    color: #FFFFFF;
}

.toastui-editor-contents h1,
.toastui-editor-contents h2 {
    border-color: #FFFFFF;
}

.toastui-editor-contents del {
    color: #777980;
}

.toastui-editor-contents blockquote {
    border-color: #303135;
}

.toastui-editor-contents blockquote p,
.toastui-editor-contents blockquote ul,
.toastui-editor-contents blockquote ol {
    color: #777980;
}

.toastui-editor-contents pre {
    background-color: #232428;
}

.toastui-editor-contents pre code {
    background-color: transparent;
    color: #FFFFFF;
}

.toastui-editor-contents code {
    color: #C1798B;
    background-color: #35262A;
}

.toastui-editor-contents div {
    color: #FFFFFF;
}

.toastui-editor-ww-code-block-language {
    border-color: #303238;
    background-color: #121212;
}

.toastui-editor-ww-code-block-language input {
    color: #FFFFFF;
}

.toastui-editor-contents .toastui-editor-ww-code-block:after {
    background-color: #232428;
    border: 1px solid #393B42;
    color: #EEEEEE;
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuugiOydtOyWtF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiCgkgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMzAgMzAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMwIDMwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6I2ZmZjt9Cjwvc3R5bGU+CjxnPgoJPGc+CgkJPGc+CgkJCTxnPgoJCQkJPGc+CgkJCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1LjUsMTIuNWwyLDJMMTIsMjBoLTJ2LTJMMTUuNSwxMi41eiBNMTgsMTBsMiwybC0xLjUsMS41bC0yLTJMMTgsMTB6Ii8+CgkJCQk8L2c+CgkJCTwvZz4KCQk8L2c+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==");
}

.toastui-editor-contents .toastui-editor-custom-block-editor {
    background: #392D31;
    color: #FFFFFF;
    border-color: #327491;
}

.toastui-editor-custom-block.ProseMirror-selectednode .toastui-editor-custom-block-view {
    color: #FFFFFF;
    border-color: #327491;
}

.toastui-editor-custom-block-view button {
    background-color: #232428;
    border-color: #393B42;
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjIuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuugiOydtOyWtF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiCgkgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMzAgMzAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMwIDMwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGwtcnVsZTpldmVub2RkO2NsaXAtcnVsZTpldmVub2RkO2ZpbGw6I2ZmZjt9Cjwvc3R5bGU+CjxnPgoJPGc+CgkJPGc+CgkJCTxnPgoJCQkJPGc+CgkJCQkJPHBhdGggY2xhc3M9InN0MCIgZD0iTTE1LjUsMTIuNWwyLDJMMTIsMjBoLTJ2LTJMMTUuNSwxMi41eiBNMTgsMTBsMiwybC0xLjUsMS41bC0yLTJMMTgsMTB6Ii8+CgkJCQk8L2c+CgkJCTwvZz4KCQk8L2c+Cgk8L2c+CjwvZz4KPC9zdmc+Cg==");
}

.toastui-editor-custom-block-view button:hover {
    background-color: #232428;
    border-color: #595C68;
}

.toastui-editor-custom-block-view .info {
    color: #65ACCA;
}

.toastui-editor-contents table {
    border-color: #303238;
}

.toastui-editor-contents table th,
.toastui-editor-contents table td {
    border-color: #303238;
}

.toastui-editor-contents table th {
    background-color: #3A3C42;
}

.toastui-editor-contents table td,
.toastui-editor-contents table td p {
    color: #FFFFFF;
}

.toastui-editor-contents td.toastui-editor-cell-selected {
    background-color: rgba(103, 204, 255, 0.5);
}

.toastui-editor-contents th.toastui-editor-cell-selected {
    background-color: rgba(103, 204, 255, 0.3);
}

table.ProseMirror-selectednode {
    outline-color: #67CCFF;
}

.html-block.ProseMirror-selectednode {
    outline-color: #67CCFF;
}

.toastui-editor-contents ul,
.toastui-editor-contents menu,
.toastui-editor-contents ol,
.toastui-editor-contents dir {
    color: #55575F;
}

.toastui-editor-contents ul > li::before {
    background-color: #55575F;
}

.toastui-editor-contents hr {
    border-color: #55575F;
}

.toastui-editor-contents a {
    color: #4B96E6;
}

.toastui-editor-contents a:hover {
    color: #1F70DE;
}

.toastui-editor-contents .image-link:hover::before {
    border-color: #393B42;
    background-color: #232428;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj4KICAgICAgICA8ZyBzdHJva2U9IiNFRUUiIHN0cm9rZS13aWR0aD0iMS41Ij4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8Zz4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNy42NjUgMTUuMDdsLTEuODE5LS4wMDJjLTEuNDg2IDAtMi42OTItMS4yMjgtMi42OTItMi43NDR2LS4xOTJjMC0xLjUxNSAxLjIwNi0yLjc0NCAyLjY5Mi0yLjc0NGgzLjg0NmMxLjQ4NyAwIDIuNjkyIDEuMjI5IDIuNjkyIDIuNzQ0di4xOTIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDQ1IC0xNzQzKSB0cmFuc2xhdGUoMTA0MCAxNzM4KSB0cmFuc2xhdGUoNSA1KSBzY2FsZSgxIC0xKSByb3RhdGUoNDUgMzcuMjkzIDApIi8+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyLjMyNiA0LjkzNGwxLjgyMi4wMDJjMS40ODcgMCAyLjY5MyAxLjIyOCAyLjY5MyAyLjc0NHYuMTkyYzAgMS41MTUtMS4yMDYgMi43NDQtMi42OTMgMi43NDRoLTMuODQ1Yy0xLjQ4NyAwLTIuNjkyLTEuMjI5LTIuNjkyLTIuNzQ0VjcuNjgiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xMDQ1IC0xNzQzKSB0cmFuc2xhdGUoMTA0MCAxNzM4KSB0cmFuc2xhdGUoNSA1KSBzY2FsZSgxIC0xKSByb3RhdGUoNDUgMzAuOTk2IDApIi8+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=");
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
}

.toastui-editor-contents .task-list-item::before {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgc3Ryb2tlPSIjNTU1NzVGIj4KICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTAzMCAtMzE2KSB0cmFuc2xhdGUoNzg4IDE5MikgdHJhbnNsYXRlKDI0MiAxMjQpIj4KICAgICAgICAgICAgICAgICAgICA8cmVjdCB3aWR0aD0iMTciIGhlaWdodD0iMTciIHg9Ii41IiB5PSIuNSIgcng9IjIiLz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+Cg==");
    background-color: transparent;
}

.toastui-editor-contents .task-list-item.checked::before {
    background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGcgZmlsbD0iIzRCOTZFNiI+CiAgICAgICAgICAgIDxnPgogICAgICAgICAgICAgICAgPGc+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2IDBjMS4xMDUgMCAyIC44OTUgMiAydjE0YzAgMS4xMDUtLjg5NSAyLTIgMkgyYy0xLjEwNSAwLTItLjg5NS0yLTJWMkMwIC44OTUuODk1IDAgMiAwaDE0em0tMS43OTMgNS4yOTNjLS4zOS0uMzktMS4wMjQtLjM5LTEuNDE0IDBMNy41IDEwLjU4NSA1LjIwNyA4LjI5M2wtLjA5NC0uMDgzYy0uMzkyLS4zMDUtLjk2LS4yNzgtMS4zMi4wODMtLjM5LjM5LS4zOSAxLjAyNCAwIDEuNDE0bDMgMyAuMDk0LjA4M2MuMzkyLjMwNS45Ni4yNzggMS4zMi0uMDgzbDYtNiAuMDgzLS4wOTRjLjMwNS0uMzkyLjI3OC0uOTYtLjA4My0xLjMyeiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEwNTAgLTI5NikgdHJhbnNsYXRlKDc4OCAxOTIpIHRyYW5zbGF0ZSgyNjIgMTA0KSIvPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4K");
}

.toastui-editor-md-delimiter,
.toastui-editor-md-code.toastui-editor-md-delimiter,
.toastui-editor-md-thematic-break,
.toastui-editor-md-link,
.toastui-editor-md-table,
.toastui-editor-md-block-quote {
    color: #55575F;
}

.toastui-editor-md-meta,
.toastui-editor-md-html {
    color: #55575F;
}

.toastui-editor-md-link.toastui-editor-md-link-url.toastui-editor-md-marked-text {
    color: #777980;
}

.toastui-editor-md-block-quote .toastui-editor-md-marked-text,
.toastui-editor-md-list-item .toastui-editor-md-meta {
    color: #B3B5BC;
}

.toastui-editor-md-link.toastui-editor-md-link-desc.toastui-editor-md-marked-text,
.toastui-editor-md-list-item-style.toastui-editor-md-list-item-odd {
    color: #4B96E6;
}

.toastui-editor-md-list-item-style.toastui-editor-md-list-item-even {
    color: #EF6767;
}

.toastui-editor-md-table .toastui-editor-md-table-cell {
    color: #FFFFFF;
}

.toastui-editor-md-code.toastui-editor-md-marked-text {
    color: #C1798B;
}

.toastui-editor-md-code {
    background-color: #35262A;
}

.toastui-editor-md-code-block-line-background {
    background-color: #232428;
}

.toastui-editor-md-code-block .toastui-editor-md-meta {
    color: #AAAAAA;
}

.toastui-editor-md-custom-block {
    color: #FFFFFF;
}

.toastui-editor-md-custom-block-line-background {
    background-color: #392D31;
}

.toastui-editor-md-custom-block .toastui-editor-md-delimiter {
    color: #327491;
}

.toastui-editor-md-custom-block .toastui-editor-md-meta {
    color: #65ACCA;
}

.toastui-editor-contents .toastui-editor-md-preview-highlight::after {
    background-color: rgba(255, 250, 193, 0.5);
}

.toastui-editor-contents th.toastui-editor-md-preview-highlight,
.toastui-editor-contents td.toastui-editor-md-preview-highlight {
    background-color: rgba(255, 250, 193, 0.5);
}

.toastui-editor-contents th.toastui-editor-md-preview-highlight {
    color: #FFFFFF;
}

.toastui-editor-contents th.toastui-editor-md-preview-highlight,
.toastui-editor-contents td.toastui-editor-md-preview-highlight {
    background-color: rgba(255, 250, 193, 0.25);
}

.toastui-editor-contents .toastui-editor-md-preview-highlight::after {
    background-color: rgba(255, 250, 193, 0.25);
}

.toastui-editor-defaultUI .toastui-editor-md-tab-container {
    border-bottom: #232427 !important;
}

.toastui-editor-md-container, .toastui-editor-ww-container {
    background-color: #161B23 !important;
}

strong {
    color: white;
}

/* Taken from the font families used in the write pane for use in the preview pane */
code > span.token {
    font-family: Consolas, Courier, "Lucida Grande", "나눔바른고딕", "Nanum Barun Gothic", "맑은고딕", "Malgun Gothic", sans-serif;
}

/*
 * Toast UI editor font sizes
 */

.toastui-editor .toastui-editor-md-heading1 {
    font-size: 36px;
}

.toastui-editor .toastui-editor-md-heading2 {
    font-size: 33px;
}

.toastui-editor .toastui-editor-md-heading3 {
    font-size: 30px;
}

.toastui-editor .toastui-editor-md-heading4 {
    font-size: 27px;
}

.toastui-editor .toastui-editor-md-heading5 {
    font-size: 24px;
}

.toastui-editor .toastui-editor-md-heading6 {
    font-size: 21px;
}

.toastui-editor div, .toastui-editor span {
    font-size: 19px;
}

.toastui-editor .toastui-editor-md-code,
.toastui-editor .toastui-editor-md-code-block,
.toastui-editor-md-code-block span {
    font-size: 17px;
}

/*
 * Toast UI preview font sizes
 */

.toastui-editor-contents h1 {
    font-size: 36px;
}

.toastui-editor-contents h2 {
    font-size: 33px;
}

.toastui-editor-contents h3 {
    font-size: 30px;
}

.toastui-editor-contents h4 {
    font-size: 27px;
}

.toastui-editor-contents h5 {
    font-size: 24px;
}

.toastui-editor-contents h6 {
    font-size: 21px;
}

.toastui-editor-contents p {
    font-size: 19px;
}

.toastui-editor-contents code {
    font-size: 17px;
}

/* Stop whitish background for various PrismJS tokens b/c dark mode */
.token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string {
    background: inherit;
}

/* Stop inheriting Bulma CSS styles for Prism-styled content */
code .tag, pre .tag, code .number, pre .number {
    display: inline;
    padding: inherit;
    font-size: inherit;
    line-height: inherit;
    text-align: inherit;
    vertical-align: inherit;
    border-radius: inherit;
    font-weight: inherit;
    white-space: inherit;
    background: inherit;
    margin: inherit;
}
</style>
