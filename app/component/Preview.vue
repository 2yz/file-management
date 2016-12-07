<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <div>
    <image-preview v-bind:file_path.sync="file_path" v-bind:style="{ display: mime_type === 'image' ? 'block' : 'none' }" >

    </image-preview>

  </div>

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

  //  class FilePreview {
  //    preview() {
  //    }
  //  }
  //
  //  class TextPre extends FilePreview {
  // //    text = new String()
  //    preview() {
  //    }
  //  }
  //
  //  class ImagePre extends FilePreview {
  // //    image_src = ''
  //
  //    preview() {
  //
  //    }
  //  }
  //
  //  class AudioPre extends FilePreview {
  // //    audio_src = ''
  //    preview() {
  //    }
  //  }
  //
  //  class RegFilePre extends FilePreview {
  //    preview() {
  //    }
  //  }
  //
  //  class FilePreviewFactory {
  //    get_preview(file_type) {
  //      switch (file_type) {
  //        case 'text':
  //          return new TextPre()
  //        case 'image':
  //          return new ImagePre()
  //        case 'audio':
  //          return new AudioPre()
  //        default:
  //          return new RegFilePre()
  //      }
  //    }
  //  }


  module.exports = {
    props: ['file_path'],
    ready: function () {
      console.log('mime type: ')
    },
    data: function () {
      return {
      }
    },
    computed: {
      mime_type: function () {
        return mime.lookup(path.basename(this.file_path)).split('/')[0]
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
