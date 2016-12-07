<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="pane sidebar padded-more" v-bind:style="{display: file_info.path == '' ? 'none' : 'block'}" v-if="file_info.type == 'text'">
    <div>
      <div class="form-group">
        <label>{{file_info.name}}</label>
        <textarea v-model="file_text" class="form-control" rows="5"></textarea>
      </div>
      <div class="form-actions">
        <button v-on:click="close_file" type="button" class="btn btn-form btn-default">关闭</button>
        <button v-on:click="export_file" type="button" class="btn btn-form btn-default">导出</button>
        <button v-on:click="save_file_text" type="button" class="btn btn-form btn-primary">保存</button>
      </div>
    </div>
  </div>
</template>

<script>

  import mime from 'mime'
  import VDevice from '../core/vDevice'
  import path from 'path'
  import CommandManager from '../core/fs/commandManager'



  module.exports = {
    props: ['file_info'],
    ready: function () {
    },
    data: function () {
      return {
        file_text: 'test text file content',
        temp: ''
      }
    },
    computed: {
      file_text: function () {
        console.log('file path: ' + this.file_info.path)
        var vd = VDevice.getCommandManager()
        if (!vd) {
          return
        } else {
          vd.execute({
            method: 'readFile',
            args: [this.file_info.path],
            callback: (err, data) => {
              if (err) return
//              this.file_text = data.toString()
              this.temp = data.toString()
            }
          })
        }
        return this.temp
      }
    },
    methods: {
      close_file () {
        this.file_info.path = ''
        this.file_info.type = ''
        this.file_info.name = ''
      }
    }
  }

</script>