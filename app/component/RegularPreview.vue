<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="pane-sm sidebar padded-more" v-if="file_info.type == 'application'">
    <div>
      <div class="form-group">
        <label>{{file_info.name}}</label>
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
    },
    data: function () {
      return {
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