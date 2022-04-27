<template>
    <div class="tag-list">
        <div v-if="tagArray" class="tags">
            <article v-for="tag in tagArray" :key="tag.key">
                <p class="tag">{{ tag }}</p>
            </article>
        </div>
        
        <div v-if="tagMap" class="tags note-tags">
            <article v-for="tag in displayedTagsAndRemainingCount.displayedTags" :key="tag.key">
                <p class="tag">{{ tag }}</p>
            </article>
            <span class="tag is-info is-light is-rounded" v-if="displayedTagsAndRemainingCount.remainingTagCount > 0">
                {{ displayedTagsAndRemainingCount.remainingTagCount }}+
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TagList',
    props: {
        tagArray: Array,
        tagMap: Object
    },
    data: function() {
        return {
            currentWidth: window.innerWidth
        };
    },
    computed: {
        displayedTagsAndRemainingCount: function() {
            return this.computeDisplayedTagsAndRemainingCount(Object.keys(this.tagMap).sort());
        }
    },
    created: function() {
        this.updateScreenWidth();
        window.addEventListener('resize', this.updateScreenWidth);
    },
    methods: {
        computeTotalChars: function(currentWidth) {
            if(currentWidth < 380) {
                return 0;
            }
            else if(currentWidth < 450) {
                return 3;
            }
            else if(currentWidth < 550) {
                return currentWidth / 100;
            }
            return currentWidth / 60;
        },
        computeDisplayedTagsAndRemainingCount: function(tags) {
            let totalChars = this.computeTotalChars(this.currentWidth);
            
            let displayedTags = [];
            for(let i = 0; totalChars > 0 && i < tags.length; ++i) {
                totalChars -= tags[i].length;
                displayedTags.push(tags[i]);
            }
            
            let remainingTagCount = tags.length - displayedTags.length;
            
            return {
                displayedTags,
                remainingTagCount
            };
        },
        updateScreenWidth: function() {
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
    justify-content: flex-end !important;
    flex-wrap: nowrap;
    max-width: 50%;
}
</style>
