<template>
  <div class="hello">
      <ul>
        <li v-for="(file) in s3Files" :key="file.id">
          <amplify-s3-image :imagePath='file.path'></amplify-s3-image>
        </li>
      </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Album',
  computed: {
    ...mapState([
      's3Files',
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
