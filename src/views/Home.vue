<template>
  <div class="home">

    <Main/>
    <Upload/>
  </div>
</template>

<script>
// @ is an alias to /src
import Main from '@/components/Main.vue'
import Upload from '@/components/Upload.vue'
export default {
  name: 'home',
  components: {
    Main,
    Upload
  }
}
</script>
