<template>
  <div class="home">
     <label for="search">Search: </label><input type='text' v-model='searchQuery' id='search'/>
    <Album/>
  </div>
</template>

<script>
// @ is an alias to /src
import Album from '@/components/Album.vue'
import { mapState } from 'vuex'
var _ = require('lodash');

export default {
  name: 'home',
  mounted: function(){
    this.$store.dispatch('search', '');
  },
  components: {
    Album
  },
  computed: {
    'searchQuery': {
      get () {
        return this.$store.state.searchQuery;
      },
      set: _.debounce( function (value) {
        this.$store.dispatch('search', value);
        this.$store.dispatch('setQuery', value);
        
      },500) }
    }
  
}
</script>
