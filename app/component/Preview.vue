<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <image-preview v-bind:file_info.sync="file_info" v-bind:style="{ display: file_info.type === 'image' ? 'block' : 'none' }" >

  </image-preview>

  <text-preview v-bind:file_info.sync="file_info" v-bind:style="{ display: file_info.type === 'text' ? 'block' : 'none' }" >

  </text-preview>

  <!--<audio-preview v-bind:file_info.sync="file_info" v-bind:style="{ display: file_info.type === 'audio' ? 'block' : 'none' }" >-->

  <!--</audio-preview>-->
</template>


<style>

</style>


<script>
  import fs from 'fs'
  import path from 'path'
  import mime from 'mime'
  import VFS from '../core/vfs_old'
  import FILE_TYPE from '../core/const/file_type'
  import ImagePreview from './ImagePreview'
  import TextPreview from './TextPreview'
  import AudioPreview from './AudioPreview'



  module.exports = {
    props: ['file_info'],
    ready: function () {
    },
    data: function () {
      return {
      }
    },
    computed: {
      mime_type: function () {
        return mime.lookup(path.basename(this.file_info.path)).split('/')[0]
      }
    },
    methods: {},
    components: {
      TextPreview,
      ImagePreview,
      AudioPreview
    }
  }


</script>
