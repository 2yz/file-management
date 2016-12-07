<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
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
        <!--<button v-on:click="export_file" type="button" class="btn btn-form btn-default">导出</button>-->
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script>

  import mime from 'mime'
  import VDevice from '../core/vDevice'
  import CommandManager from '../core/fs/commandManager'


  module.exports = {
    props: ['file_path'],
    ready: function () {
      this.openImageFile(this.file_path)
    },
    data: function () {
      return {
        file_path: ''
      }
    },
    methods: {
      /**
       * @deprecated temporary
       */
      openImageFile (file) {
        this.mode = 'image'
        var vd = VDevice.getCommandManager()
        if (!vd) {
          return
        }
        vd.execute({
          method: 'readFile',
          args: [file],
          callback: (err, data) => {
            if (err) return
            var arr = ['data:' + mime.lookup(file) + ';base64,']
            arr.push(data.toString('base64'))
            this.file_image_src = arr.join('')
          }
        })
      },

      close_file (file) {
        this.file_path = ''
      }
    }
  }
</script>