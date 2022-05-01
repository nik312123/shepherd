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
    watch: {
        notes: function() {
            this.getSearchResults();
        }
    },
    mounted: function() {
        this.getSearchResults();
    },
    methods: {
        getSearchResults: function() {

            if(this.searchQuery === '') {
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
    margin: 5px 0;
}

.search-input {
    margin: auto 1%;
    font-weight: 700;
    letter-spacing: 2px;
    caret-color: grey;
    color: #00004D;
}

</style>
