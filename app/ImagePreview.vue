<template>
  <div class="pane sidebar padded-more" v-bind:style="{ display: mode === 'image' ? 'block' : 'none' }">
    <div>
      <div class="form-group">
        <label>{{file_name}}</label>
      </div>
      <div class="form-group">
        <img v-bind:src="file_image_src" style="width: 100%;"/>
      </div>
      <div class="form-actions">
        <button class="btn btn-form btn-default">关闭</button>
        <button class="btn btn-form btn-default">导出</button>
      </div>
    </div>
  </div>
</template>

<style>

</style>

<script>
  module.exports = {
    props: [],
    data: function () {
      return {}
    },
    methods: {}
  }
</script>