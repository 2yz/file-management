<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
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
</template>

<script>

  import mime from 'mime'
  import VDevice from '../core/vDevice'

  module.exports = {
    ready: function () {
      this.openTextFile(this.file_path)
    },
    props: ['file_path'],
    methods: {
      /**
       * @deprecated temporary
       */
      openTextFile (file) {
        VDevice.getCommandManager().execute({
          method: 'readFile',
          args: [file],
          callback: (err, data) => {
            if (err) return
            this.file_text = data.toString()
          }
        })
//        this.file_text = vfs_old.read_file(item.inode).toString()
        this.mode = 'text'
      }
    }
  }
</script>