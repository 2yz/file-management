<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
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
</template>

<script>
  module.exports = {
    ready: function () {
      this.openRegFile(this.file_path)
    },
    props: ['file_path'],
    methods: {
      openRegFile (file) {
        this.file_name = path.basename(file)
        this.mode = 'file'
      }
    }
  }
</script>