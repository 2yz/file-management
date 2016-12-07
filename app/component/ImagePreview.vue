<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="pane sidebar padded-more" v-bind:style="{display: file_path === '' ? 'none' : 'block'}">
    <div>
      <div class="form-group">
        <label>{{file_name}}</label>
        <span>{{text}}</span>
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
  import path from 'path'
  import CommandManager from '../core/fs/commandManager'


  module.exports = {
    props: ['file_path'],
    ready: function () {
      this.mode = 'image'
    },
    data: function () {
      return {
        mode: 'image',
        file_name: '',
        temp: ''
      }
    },
    computed: {
      file_image_src: function () {
        console.log('file path: ' + this.file_path)
        var vd = VDevice.getCommandManager()
        if (!vd) {
          return
        } else {
          vd.execute({
            method: 'readFile',
            args: [this.file_path],
            callback: (err, data) => {
              if (err) return
              var arr = ['data:' + mime.lookup(this.file_path) + ';base64,']
              arr.push(data.toString('base64'))
              this.temp = arr.join('')
            }
          })
        }
        return this.temp
      },
      file_name: function () {
        return path.basename(this.file_path)
      }
    },
    methods: {
      close_file () {
        this.file_path = ''
        this.mode = ''
      }
    }
  }
</script>