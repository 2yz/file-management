<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">

  <h2>
    {{msg}}
  </h2>

  <!--文件-->
  <div class="pane-sm sidebar padded-more" v-bind:style="{ display: mode === 'file' ? 'block' : 'none' }">
    <div>
      <div class="form-group">
        <label>{{file_name}}</label>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-form btn-default">关闭</button>
        <button type="button" class="btn btn-form btn-default">导出</button>
      </div>
    </div>
  </div>

  <!--文本-->
  <div class="pane sidebar padded-more" v-bind:style="{ display: mode === 'text' ? 'block' : 'none' }">
    <div>
      <div class="form-group">
        <label>{{file_name}}</label>
        <!--将这里替换成另一个组件-->
        <div class="form-actions">
          <button type="button" class="btn btn-form btn-default">关闭</button>
          <button type="button" class="btn btn-form btn-default">导出</button>
          <button type="button" class="btn btn-form btn-primary">保存</button>
        </div>
      </div>
    </div>
  </div>
    <!--图片-->
    <div class="pane sidebar padded-more" v-bind:style="{ display: mode === 'image' ? 'block' : 'none' }">
      <div>
        <div class="form-group">
          <label>{{file_name}}</label>
        </div>
        <div class="form-group">
          <!--将这里替换成另一个组件-->
          <image-preview>

          </image-preview>
          <img v-bind:src="file_image_src" style="width: 100%;"/>
        </div>
        <div class="form-actions">
          <button class="btn btn-form btn-default">关闭</button>
          <button class="btn btn-form btn-default">导出</button>
        </div>
      </div>
    </div>

    <!--音频-->
    <div class="pane sidebar padded-more" v-bind:style="{ display: mode === 'audio' ? 'block' : 'none' }">
      <div>
        <div class="form-group">
          <label>{{file_name}}</label>
        </div>
        <div class="form-group">
          <audio v-bind:src="file_audio_src" controls="controls"></audio>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-form btn-default">关闭</button>
          <button type="button" class="btn btn-form btn-default">导出</button>
        </div>
      </div>
    </div>

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
  import Device from './core/device'
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
    props: ['msg'],
    data: function () {
      return {
        file_name: 'this is file name',
        mode: 'block',
        file_image_src: ''
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
