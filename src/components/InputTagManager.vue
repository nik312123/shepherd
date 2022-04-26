<template>
    <VueTagsInput
        v-model="tag"
        :placeholder="tags.length === 0 ? 'Add tag' : ''"
        :tags="tags"
        :autocomplete-items="relevantUserTags"
        @tags-changed="updateTags"
        ref="vueTagsInput"
    />
</template>

<script>
import {VueTagsInput} from '@johmun/vue-tags-input/vue-tags-input/publish';

export default {
    name: 'InputTagManager',
    components: {VueTagsInput},
    props: {
        userTags: Array,
        initialTags: Array
    },
    data: function() {
        return {
            tag: '',
            tags: this.initialTags.slice()
        };
    },
    computed: {
        relevantUserTags: function() {
            let filteredUserTagsAsObjects = this.userTags
                .map(userTag => ({text: userTag, tagIdx: userTag.indexOf(this.tag.toLowerCase())}))
                .filter(userTagObj => userTagObj.tagIdx !== -1);
            filteredUserTagsAsObjects.sort((userTagObj1, userTagObj2) => userTagObj1.tagIdx - userTagObj2.tagIdx);
            return filteredUserTagsAsObjects;
        }
    },
    methods: {
        clear: function() {
            this.tag = '';
            this.tags.length = 0;
            while(this.$refs.vueTagsInput.tagsCopy.length !== 0) {
                this.$refs.vueTagsInput.invokeDelete();
            }
        },
        updateTags: function(updatedTags) {
            this.tags = updatedTags;
            this.$emit('updateTags', this.tags.slice());
        }
    },
    watch: {
        tag: function() {
            this.tag = this.tag.toLowerCase();
        }
    }
};
</script>

<style scoped>
>>> .vue-tags-input {
    background-color: #2A3444;
    border-radius: 10px;
}

>>> .ti-input {
    border: 0;
    color: #2A3444;
}

>>> .vue-tags-input .ti-new-tag-input {
    background: transparent;
    color: #F8FAFC;
    font-size: large;
    font-weight: 700;
}

>>> .vue-tags-input .ti-input {
    padding: 10px 10px;
    font-size: large;
    font-weight: 700;
}

>>> .vue-tags-input .ti-autocomplete {
    margin-top: 5px;
    padding: 10px;
    background: #2E3848;
    border: 0;
    border-radius: 10px;
    border-top: none;
    font-size: large;
    font-weight: 700;
    color: #F8FAFC;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4), 0 6px 20px 0 rgba(0, 0, 0, 0.2);
    position: relative;
}

>>> .vue-tags-input .ti-item.ti-selected-item {
    border-radius: 10px;
}

>>> .vue-tags-input ::-webkit-input-placeholder {
    color: #A4B1B6;
}

>>> .vue-tags-input ::-moz-placeholder {
    color: #A4B1B6;
}

>>> .vue-tags-input :-ms-input-placeholder {
    color: #A4B1B6;
}

>>> .vue-tags-input :-moz-placeholder {
    color: #A4B1B6;
}

>>> .vue-tags-input .ti-tag {
    height: 30px;
    border-radius: 10px;
}
</style>