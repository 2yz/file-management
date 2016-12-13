<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <tr v-on:dblclick="open()">
    <td>{{name}}</td>
    <td>{{type}}</td>
    <td>
      <span v-if="isFile">{{mimeType}}</span>
    </td>
    <td>{{size}} 字节</td>
    <td>{{mtime | date_filter}}</td>
    <td>
      <div>
        <button v-on:click="open()" class="btn btn-mini btn-default">
          打开
        </button>
        <button v-on:click="rename()" class="btn btn-mini btn-default">
          重命名
        </button>
        <button v-on:click="remove()" class="btn btn-mini btn-default">
          删除
        </button>
      </div>
    </td>
  </tr>
</template>

<script type="text/ecmascript-6">
  import path from 'path'
  import mime from 'mime'
  import VDevice from '../core/vdevice'

  export default {
    props: ['file'],
    ready () {
      this.init()
    },
    data () {
      return {
        name: '',
        type: '',
        mimeType: '',
        size: '',
        mtime: null,
        stats: null,
        isFile: null
      }
    },
    methods: {
      init () {
        this.name = path.basename(this.file)
        VDevice.getCommandManager().execute({
          method: 'stat', args: [this.file, (err, stat) => {
            if (err) return
            this.type = stat.type
            this.mimeType = mime.lookup(this.name)
            this.size = stat.size
            this.mtime = stat.mtime
            this.stats = stat.stats
            this.isDirectory = stat.stats.isDirectory()
            this.isFile = stat.stats.isFile()
          }]
        })
      },
      reload () {
        this.init()
      },
      open () {
        this.$dispatch('openMsg', {
          file: this.file,
          isDirectory: this.isDirectory,
          isFile: this.isFile
        })
      },
      rename () {
        this.$dispatch('renameMsg', {
          file: this.file,
          isDirectory: this.isDirectory,
          isFile: this.isFile
        })
      },
      remove () {
        this.$dispatch('removeMsg', {
          file: this.file,
          isDirectory: this.isDirectory,
          isFile: this.isFile
        })
      }
    }

  }
</script>
