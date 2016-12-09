<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="pane sidebar padded-more" v-bind:style="{display: file_info.path == '' ? 'none' : 'block'}"
       v-if="file_info.type == 'text'">
    <div>
      <div class="form-group">
        <label>{{file_info.name}}</label>
        <textarea v-model="file_text" class="form-control" rows="5"></textarea>
      </div>
      <div class="form-actions">
        <button v-on:click="close_file" type="button" class="btn btn-form btn-default">关闭</button>
        <button v-on:click="save_file_text" type="button" class="btn btn-form btn-primary">保存</button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import mime from 'mime'
  import VDevice from '../core/vDevice'
  import path from 'path'
  import CommandManager from '../core/fs/commandManager'

  const {app, dialog} = require('electron').remote

  module.exports = {
    props: ['file_info'],
    ready () {
      this.init()
    },
    data: function () {
      return {
        file_text: 'test text file content',
        temp: ''
      }
    },
    events: {
      refresh () {
        this.init()
      }
    },
    methods: {
      init () {
        var vd = VDevice.getCommandManager()
        if (!vd) return
        vd.execute({
          method: 'readFile',
          args: [this.file_info.path],
          callback: (err, data) => {
            if (err) return
            this.file_text = data.toString()
          }
        })
      },
      close_file () {
        this.$dispatch('closePreview')
      },
      save_file_text () {
        var vd = VDevice.getCommandManager()
        if (!vd) return
        vd.execute({
          method: 'writeFile',
          args: [this.file_info.path, this.file_text],
          callback: (err, data) => {
            if (err) return
            dialog.showMessageBox({buttons: ['好的'], message: '保存成功'})
          }
        })
      }
    }
  }

</script>