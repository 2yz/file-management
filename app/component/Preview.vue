<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <image-preview v-bind:file_info.sync="file_info" v-if="file_info.type === 'image'">

  </image-preview>

  <text-preview v-bind:file_info.sync="file_info" v-if="file_info.type === 'text'">

  </text-preview>

  <audio-preview v-bind:file_info.sync="file_info" v-if="file_info.type === 'audio'">

  </audio-preview>

  <regular-preview v-bind:file_info.sync="file_info" v-if="file_info.type === 'application'">

  </regular-preview>
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
  import RegularPreview from './RegularPreview'

  export default {
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
      AudioPreview,
      RegularPreview
    }
  }

</script>
