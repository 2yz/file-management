<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <image-preview v-bind:file_info="file_info" v-if="file_info.type === 'image'">

  </image-preview>

  <text-preview v-bind:file_info="file_info" v-if="file_info.type === 'text'">

  </text-preview>

  <audio-preview v-bind:file_info="file_info" v-if="file_info.type === 'audio'">

  </audio-preview>

  <regular-preview v-bind:file_info="file_info" v-if="file_info.type === 'application'">

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
    data () {
      return {
        file_info: {
          path: '',
          type: '',
          name: ''
        },
        isOpen: false
      }
    },
    methods: {},
    events: {
      openPreview (msg) {
        this.file_info.path = msg.file
        this.file_info.type = mime.lookup(path.basename(msg.file)).split('/')[0]
        this.file_info.name = path.basename(msg.file)
        if (this.isOpen) {
          this.$broadcast('refresh')
        } else {
          this.isOpen = true
        }
      },
      closePreview (msg) {
        this.file_info.path = ''
        this.file_info.type = ''
        this.file_info.name = ''
        this.isOpen = false
      }
    },
    components: {
      TextPreview,
      ImagePreview,
      AudioPreview,
      RegularPreview
    }
  }

</script>
