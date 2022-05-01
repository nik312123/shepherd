<template>
    <div class="search-container">

        <input
            class="input is-rounded search-input" type="text" placeholder="Search" v-model="searchQuery"
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
    data: function() {
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
    width: 100%;
    padding: 0 !important;
}

.search-input {
    width: 100%;
    font-weight: 700;
    color: #F8FAFC;
    background-color: #2A3444;
    border-color: #344155;
    border-radius: 10px;
    margin: auto 0;
    letter-spacing: 1px;
    caret-color: white;
    font-size: 18px;
    font-family: "Inter", sans-serif;
}

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: #A4B1B6;
    opacity: 1; /* Firefox */
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
    color: #A4B1B6;
}

::-ms-input-placeholder { /* Microsoft Edge */
    color: #A4B1B6;
}
</style>
