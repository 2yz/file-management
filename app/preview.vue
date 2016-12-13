<template>
  <!--文件-->
  <div class="pane-sm sidebar padded-more" v-bind:style="{ display: mode === 'file' ? 'block' : 'none' }">
    <div>
      <div class="form-group">
        <label>{{file_name}}</label>
      </div>
      <div class="form-actions">
        <button v-on:click="close_file" type="button" class="btn btn-form btn-default">关闭</button>
        <button v-on:click="export_file" type="button" class="btn btn-form btn-default">导出</button>
      </div>
    </div>
  </div>

  <!--文本-->
  <div class="pane sidebar padded-more" v-bind:style="{ display: mode === 'text' ? 'block' : 'none' }">
    <div>
      <div class="form-group">
        <label>{{file_name}}</label>
        <textarea v-model="file_text" class="form-control" rows="5"></textarea>
      </div>
      <div class="form-actions">
        <button v-on:click="close_file" type="button" class="btn btn-form btn-default">关闭</button>
        <button v-on:click="export_file" type="button" class="btn btn-form btn-default">导出</button>
        <button v-on:click="save_file_text" type="button" class="btn btn-form btn-primary">保存</button>
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
        <img v-bind:src="file_image_src" style="width: 100%;"/>
      </div>
      <div class="form-actions">
        <button v-on:click="close_file" type="button" class="btn btn-form btn-default">关闭</button>
        <button v-on:click="export_file" type="button" class="btn btn-form btn-default">导出</button>
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
        <button v-on:click="close_file" type="button" class="btn btn-form btn-default">关闭</button>
        <button v-on:click="export_file" type="button" class="btn btn-form btn-default">导出</button>
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
        <button v-on:click="close_rename" type="button" class="btn btn-form btn-default">关闭</button>
        <button v-on:click="rename_file" type="button" class="btn btn-form btn-primary">重命名</button>
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

  class file_preview {
    a = "asdsf";
    constructor(a) {
      this.a = a;
    }
  }



  module.exports = {
    data: function () {

    },
    methods: {
      asd: function () {

      },
      sdf: function () {

      },
      open_file (item) {
        try {
          switch (item.mime_type.split('/')[0]) {
            case 'text':
              this.open_text_file(item)
              break
            case 'image':
              this.open_image_file(item)
              break
            case 'audio':
              this.open_audio_file(item)
              break
            default:
              this.open_reg_file(item)
              break
          }
        } catch (e) {
          dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
        }
      },
      open_reg_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.mode = 'file'
      },
      open_text_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.file_text = vfs.read_file(item.inode).toString()
        this.mode = 'text'
      },
      open_image_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.mode = 'image'
        var arr = ['data:' + item.mime_type + ';base64,']
        arr.push(vfs.read_file(item.inode).toString('base64'))
        this.file_image_src = arr.join('')
      },
      open_audio_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.mode = 'audio'
        var arr = ['data:' + item.mime_type + ';base64,']
        arr.push(vfs.read_file(item.inode).toString('base64'))
        this.file_audio_src = arr.join('')
      }
    }
  }


</script>
