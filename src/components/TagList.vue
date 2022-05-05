<template>
    <div class="tag-list">
        <div v-if="tagArray" class="tags">
            <div v-for="tag in tagArray" :key="tag.key">
                <p class="tag">{{ tag }}</p>
            </div>
        </div>
        
        <div v-if="tagMap" class="row">
            <div class="note-tags-list">
                <p style="width: 10px;" class="note-tag">.</p>
                <p v-for="tag in Object.keys(tagMap)" :key="tag.key" class="tag note-tag">{{ tag }}</p>
            </div>
            <span class="tag is-info is-light is-rounded remaining-tag-counter" v-if="overflowCount > 0">
                {{ overflowCount }}+
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
            currentWidth: window.screen.width,
            overflowCount: 0
        };
    },
    mounted() {
        if(this.tagMap) {
            this.numOverflown();
            window.addEventListener('resize', this.numOverflown);
        }
    },
    methods: {
        numOverflown: function() {
            const parentBounds = this.$el.getElementsByClassName('note-tags-list')[0].getBoundingClientRect();
            const tags = this.$el.getElementsByClassName('note-tag');
            let counter = 0;
            for(const tag of tags) {
                const bounds = tag.getBoundingClientRect();
                if(parentBounds.bottom <= bounds.top) {
                    counter++;
                }
            }
            this.overflowCount = counter;
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

.note-tags-list {
    display: flex;
    flex-flow: row wrap;
    overflow: hidden;
    flex-wrap: wrap;
    height: 30px;
    justify-content: flex-end;
    width: auto;
}

.row {
    display: flex;
    align-items: center;
}

.tag-list {
    overflow: hidden;
    min-width: 0;
}

.remaining-tag-counter {
    margin-top: 0;
    position: relative;
    top: 6px;
}
</style>
