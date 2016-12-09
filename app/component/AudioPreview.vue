<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="pane sidebar padded-more" v-if="file_info.type == 'audio'">
    <div>
      <div class="form-group">
        <label>{{file_info.name}}</label>
      </div>
      <div class="form-group">
        <audio v-bind:src="file_audio_src" controls="controls"></audio>
      </div>
      <div class="form-actions">
        <button v-on:click="close_file" type="button" class="btn btn-form btn-default">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>

  import mime from 'mime'
  import VDevice from '../core/vDevice'
  import path from 'path'

  module.exports = {
    props: ['file_info'],
    computed: {
      file_audio_src: function () {
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
      }
    },
    data: function () {
      return {
        file_audio_src: '',
        temp: ''
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