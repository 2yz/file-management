<template xmlns:v-bind="http://www.w3.org/1999/xhtml" xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="pane sidebar padded-more" v-bind:style="{ display: mode === 'audio' ? 'block' : 'none' }" v-if="file_info.type == 'audio'">
    <div>
      <div class="form-group">
        <label>{{file_info.name}}</label>
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
  module.exports = {
    props: ['file_info'],
    computed: {
      file_audio_src: function () {
        return 'asd'
      }
    },
    data: function () {

    },
    methods: {

    }
  }
</script>