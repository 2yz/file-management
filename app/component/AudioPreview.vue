<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
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
</template>

<script>

  import mime from 'mime'
  import VDevice from '../core/vDevice'

  module.exports = {
    props: ['file_path'],
    data: function () {
      return {

      }
    },
    methods: {
      ready: function () {
        this.openAudioFile(this.file_path)
      },
      /**
       * @deprecated temporary
       */
      openAudioFile (file) {
        this.mode = 'audio'
        VDevice.getCommandManager().execute({
          method: 'readFile',
          args: [file],
          callback: (err, data) => {
            if (err) return
            var arr = ['data:' + mime.lookup(file) + ';base64,']
            arr.push(data.toString('base64'))
            this.file_audio_src = arr.join('')
          }
        })
//        var arr = ['data:' + item.mime_type + ';base64,']
//        arr.push(vfs_old.read_file(item.inode).toString('base64'))
//        this.file_audio_src = arr.join('')
      }
    }
  }
</script>