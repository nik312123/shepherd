<template>
  <div class="search-container">
    <input class="input is-rounded search-input" type="text" placeholder="Search..." v-model="searchQuery" @input="getSearchResults">
    <!-- <button class="button is-info is-rounded search-button" v-on:click="getSearchResults()"> 
        <span class="icon">
            <i class="fas fa-search"></i>
        </span>
        <span>Search</span>
    </button>
    -->
  </div>
</template>

<script>

//import Fuse from 'https://deno.land/x/fuse@v6.5.3/dist/fuse.esm.min.js';

import Fuse from 'fuse.js'

export default{
    name : 'SearchBar',
    props : {
        notes : Array,
        returnResults : Function
    },
    data(){
        return {
            searchQuery : ''
        }
    },
    created: function(){
        
        this.returnResults(this.notes)
    },
    methods:{
        getSearchResults : function(){
            if(this.searchQuery === ""){
                this.returnResults(this.notes)
                return
            }
            

            const options = {
            includeScore: true,
            keys: [
                    {name : 'body', weight: 0.3}, 
                    {name : 'title', weight: 0.7}
                ],
            threshold: 0.3
            }

            const fuse = new Fuse(this.notes, options)
            const result = fuse.search(this.searchQuery)
            const searchResults = result.map((note) => {return note.item})
            
            this.returnResults(searchResults)
        
        }
    }
}
</script>

<style scoped>
.search-container{
    display: flex;
}
.search-input{
    margin: auto 1%;
}
.search-button{
    margin: auto 0.5%;
}
</style>
