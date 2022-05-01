<template>
    <div class="search-container">
        <input
            class="input is-rounded search-input" type="text" placeholder="Search..." v-model="searchQuery"
            @input="getSearchResults"
        >
    </div>
</template>

<script>

import Fuse from 'fuse.js';

export default {
    name: 'SearchBar',
    props: {
        notes: Array,
        returnResults: Function
    },
    data() {
        return {
            searchQuery: ''
        };
    },
    mounted: function() {
        console.log("Inside created search query0")
        this.returnResults(this.notes);
    },
    methods: {
        getSearchResults: function() {
            console.log("Inside created search query1 ")
            if(this.searchQuery === '') {
                console.log("Inside created search query")
                this.returnResults(this.notes);
                return;
            }

            const options = {
                includeScore: true,
                keys: [
                    {name: 'body', weight: 0.3},
                    {name: 'title', weight: 0.7}
                ],
                threshold: 0.3
            };

            const fuse = new Fuse(this.notes, options);
            const result = fuse.search(this.searchQuery);
            const searchResults = result.map((note) => {return note.item;});

            this.returnResults(searchResults);

        }
    }
};
</script>

<style scoped>
.search-container {
    display: flex;
}

.search-input {
    margin: auto 1%;
}

.search-button {
    margin: auto 0.5%;
}
</style>
