<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div v-if="mime_type === 'image'">
    <image-preview v-bind:file_path="file_path">

    </image-preview>
  </div>
  <div v-if="mime_type === 'audio'">
    <image-preview v-bind:file_path="file_path">

    </image-preview>
  </div>
  <div v-if="mime_type === 'image'">
    <image-preview v-bind:file_path="file_path">

    </image-preview>
  </div>
</template>


<style>

</style>


<script>
  import mime from 'mime'
  import VDevice from '../core/vDevice'
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
    ready: function () {
      this.mime_type = mime.lookup(this.file_path)
    },
    props: ['file_path'],
    data: function () {
      return {
        mime_type: '',
        file_name: ''
      }
    },
    methods: {
    },
    components: {
      TextPreview,
      ImagePreview,
      AudioPreview
    }
  }


</script>
