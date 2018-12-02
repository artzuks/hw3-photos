import Vue from 'vue'
import Vuex from 'vuex'

import { Storage, API } from 'aws-amplify';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    files :[],
    s3Files: [
    ],
    searchQuery: ""
  },
  mutations: {
    updateFiles(state, files) {
      state.files = files
    },
    updateS3Files(state, files) {
      state.s3Files = files;
    },
    setQuery(state,query){
      state.searchQuery = query;
    }
  },
  actions: {
    setQuery({commit},query) {
      commit('setQuery',query);
    },
    search({commit},queryString) {
      API.get('search', '/search',{
        'queryStringParameters': {
          'q': queryString
        }}).then(response => {
          console.log(response);
          let newResults = [];
          let hits = JSON.parse(response).hits.hits;
          for (let i = 0;i<hits.length;++i){
            newResults.push({
              id:hits[i]._id,
              path: hits[i]._source.objectKey.replace(/^public\//,'')
            })
          }
          commit ('updateS3Files',newResults)
      }).catch(error => {
          console.log(error);
      });
    },
    uploadFile(state,file,component) {
      console.log(file);
      Storage.put('uploads/' + file.name, file.file,
      {
        level: 'public',
        contentType: file.type
       })
      .then (result => console.log(result))
      .catch(err => console.log(err));
    }
  }
})
