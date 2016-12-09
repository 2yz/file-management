<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="pane sidebar padded-more" v-bind:style="{display: file_info.path == '' ? 'none' : 'block'}" v-if="file_info.type == 'image'">
    <div>
      <div class="form-group">
        <label>{{file_info.name}}</label>
      </div>
      <div class="form-group">
        <img v-bind:src="file_image_src" style="width: 100%;"/>
      </div>
      <div class="form-actions">
        <button v-on:click="close_file" type="button" class="btn btn-form btn-default">关闭</button>
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


  module.exports = {
    props: ['file_info'],
    ready: function () {
    },
    data: function () {
      return {
        file_name: '',
        temp: ''
      }
    },
    computed: {
      file_image_src: function () {
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
              var arr = ['data:' + mime.lookup(this.file_info.path) + ';base64,']
              arr.push(data.toString('base64'))
              this.temp = arr.join('')
            }
          })
        }
        return this.temp
      },
      file_name: function () {
        return path.basename(this.file_info.path)
      },
      mime_type: function () {
        return mime.lookup(path.basename(this.file_info.path)).split('/')[0]
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