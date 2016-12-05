<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">


  <!--应该是各种文件类型的组件-->
  <!--<div v-if="item.mimetype === 'text'">-->
  <!--<text-preview>-->

  <!--</text-preview>-->
  <!--</div>-->
  <div v-if="item.mimetype === 'image'">
    <image-preview v-bind:img_src="">

    </image-preview>
  </div>
  <!--<div v-if="item.mimetype === 'audio'">-->
  <!--<image-preview>-->

  <!--</image-preview>-->
  <!--</div>-->
  <!--<div v-if="item.mimetype === 'image'">-->
  <!--<image-preview>-->

  <!--</image-preview>-->
  <!--</div>-->

  <!--重命名-->
  <div class="pane-sm sidebar padded-more" v-bind:style="{ display: mode === 'rename' ? 'block' : 'none' }">
    <div>
      <div class="form-group">
        <label>现在的名称：{{file_name}}</label>
        <input v-model="file_name_rename" class="form-control" placeholder="输入新名称">
      </div>
      <div class="form-actions">
        <button class="btn btn-form btn-default">关闭</button>
        <button class="btn btn-form btn-primary">重命名</button>
      </div>
    </div>
  </div>
</template>


<style>

</style>


<script>
  import fs from 'fs'
  import path from 'path'
  import mime from 'mime'
  //  import Device from './core/device'
  import VFS from './core/vfs_old'
  import FILE_TYPE from './core/const/file_type'
  import ImagePreview from './ImagePreview'
  //  import TextPreview from './TextPreview'
  //  import AudioPreview from './ImagePreview'

  class FilePreview {
    preview() {
    }
  }

  class TextPre extends FilePreview {
//    text = new String()
    preview() {
    }
  }

  class ImagePre extends FilePreview {
//    image_src = ''

    preview() {

    }
  }

  class AudioPre extends FilePreview {
//    audio_src = ''
    preview() {
    }
  }

  class RegFilePre extends FilePreview {
    preview() {
    }
  }

  class FilePreviewFactory {
    get_preview(file_type) {
      switch (file_type) {
        case 'text':
          return new TextPre()
        case 'image':
          return new ImagePre()
        case 'audio':
          return new AudioPre()
        default:
          return new RegFilePre()
      }
    }
  }


  module.exports = {
    // 来自父组件的数据（必要的）
    props: ['file_path'],
    data: function () {
      return {
        img_src: ''
      }
    },
    methods: {
      init: function () {
        var factory = new FilePreviewFactory()
//        item.mime_type.split('/')[0]
        var file_preview = factory.get_preview()
        console.log(this.props)
      }
    },
    components: {
//      TextPreview,
      ImagePreview
//      AudioPreview
    }
  }


</script>
