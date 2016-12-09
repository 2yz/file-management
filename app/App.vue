<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="window">
    <header class="toolbar toolbar-header">
      <div class="toolbar-actions">
        <div class="btn-group">
          <button v-on:click="openRootDir" class="btn btn-default">
            <span class="icon icon-home"></span>&nbsp;根目录
          </button>
          <button v-on:click="back" v-bind:disabled="!isBack" v-bind:class="{ 'active': !isBack }"
                  class="btn btn-default">
            <span class="icon icon-left"></span>&nbsp;返回
          </button>
          <button v-on:click="forward" v-bind:disabled="!isForward" v-bind:class="{ 'active': !isForward }"
                  class="btn btn-default">
            <span class="icon icon-right"></span>&nbsp;前进
          </button>
          <button v-on:click="undo" v-bind:disabled="!isUndo" v-bind:class="{ 'active': !isUndo }"
                  class="btn btn-default">
            <span class="icon icon-back"></span>&nbsp;撤销
          </button>
          <button v-on:click="redo" v-bind:disabled="!isRedo" v-bind:class="{ 'active': !isRedo }"
                  class="btn btn-default">
            <span class="icon icon-forward"></span>&nbsp;重做
          </button>
        </div>
        <div class="btn-group">
          <button v-on:click="showCreate" class="btn btn-default">
            <span class="icon icon-plus"></span>&nbsp;新建
          </button>
        </div>
      </div>
    </header>
    <div class="window-content">
      <div class="pane-group">
        <div class="pane-sm sidebar padded-more" v-bind:style="{ display: mode === 'create' ? 'block' : 'none' }">
          <div>
            <div class="form-group">
              <div>
                <label>新建文件夹</label>
                <button v-on:click="createDir" type="button" class="btn btn-mini btn-default" style="float: right;">
                  新建
                </button>
              </div>
              <input v-model="new_dir_name" class="form-control" placeholder="文件夹名">
            </div>
            <div class="form-group">
              <div>
                <label>新建文件</label>
                <button v-on:click="createRegFile" type="button" class="btn btn-mini btn-default"
                        style="float: right;">新建
                </button>
              </div>
              <input v-model="new_file_name" class="form-control" placeholder="文件名">
            </div>
            <div class="form-group">
              <div>
                <label>导入文件</label>
                <button v-on:click="importFile" type="button" class="btn btn-mini btn-default" style="float: right;">
                  导入
                </button>
              </div>
            </div>
          </div>
        </div>

        <!--文件信息-->
        <div class="pane">
          <table class="table-striped">
            <thead>
            <tr>
              <th>文件名</th>
              <th>文件类型</th>
              <th>MIME type</th>
              <th>文件大小</th>
              <th>修改日期</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="file in files" is="item-component" v-bind:file="file"></tr>
            </tbody>
          </table>
        </div>


        <!--文件预览-->
        <preview></preview>

        <!--重命名-->
        <div class="pane-sm sidebar padded-more" v-bind:style="{ display: mode === 'rename' ? 'block' : 'none' }">
          <div>
            <div class="form-group">
              <label>现在的名称：{{file_name}}</label>
              <input v-model="file_name_rename" class="form-control" placeholder="输入新名称">
            </div>
            <div class="form-actions">
              <button v-on:click="close_rename" type="button" class="btn btn-form btn-default">关闭</button>
              <button v-on:click="renameFile" type="button" class="btn btn-form btn-primary">重命名</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import fs from 'fs'
  import path from 'path'
  import mime from 'mime'
  import FSFactory from './core/fs/factory'
  import VDevice from './core/vDevice'
  import ItemComponent from './component/ItemComponent'
  import Preview from './component/Preview'

  const {app, dialog} = require('electron').remote

  export default {
    ready () {
      VDevice.initial('native')
      this.commandManager = VDevice.getCommandManager()
      this.cd('/')
    },
    data () {
      return {
        currentPath: '/',
        files: [],

        file_info: {
          path: '',
          name: '',
          type: ''
        },

        commandManager: null,

        // deprecated
        mode: '', // 界面模式
        new_file_name: '', // 新建
        new_dir_name: '', // 文件
        file_path: '',
        file_name: '',
        file_name_rename: '' // 重命名
      }
    },

    computed: {
      isBack () {
        return this.commandManager ? this.commandManager.isBack() : false
      },
      isForward () {
        return this.commandManager ? this.commandManager.isForward() : false
      },
      isUndo () {
        return this.commandManager ? this.commandManager.isUndo() : false
      },
      isRedo () {
        return this.commandManager ? this.commandManager.isRedo() : false
      }
    },

    methods: {
      cd (pathStr) {
        var command = VDevice.getCommandManager()
        command.cd(pathStr, this._cdCallback)
      },
      refresh () {
        VDevice.getCommandManager().refresh(this._cdCallback)
      },
      _cdCallback (err, files, currentPath) {
        if (err) return
        this.files = files
        this.currentPath = currentPath
      },
      openRootDir() {
        this.cd('/')
      },
      back () {
        VDevice.getCommandManager().back(this._cdCallback)
      },
      forward () {
        VDevice.getCommandManager().forward(this._cdCallback)
      },
      undo () {
        VDevice.getCommandManager().undo()
      },
      redo () {
        VDevice.getCommandManager().redo()
      },

      /**
       * @deprecated since v0.2
       */
      openRename (file) {
        this.file_path = file
        this.file_name = path.basename(file)
        this.file_name_rename = ''
        this.mode = 'rename'
      },
      /**
       * @deprecated since v0.2
       */
      renameFile () {
        VDevice.getCommandManager().execute({
          method: 'rename',
          args: [
            this.file_path,
            path.join(path.dirname(this.file_path), this.file_name_rename)
          ],
          callback: (err) => {
            if (err) return
            this.refresh()
          }
        })
      },
      /**
       * @deprecated since v0.2
       */
      showCreate () {
        if (this.mode === 'create') {
          this.mode = ''
        } else {
          this.mode = 'create'
        }
      },
      /**
       * @deprecated since v0.2
       */
      createDir () {
        VDevice.getCommandManager().execute({
          method: 'createDir',
          args: [
            path.join(this.currentPath, this.new_dir_name)
          ],
          callback: (err) => {
            if (err) return
            this.refresh()
          }
        })
      },
      /**
       * @deprecated since v0.2
       */
      createRegFile () {
        VDevice.getCommandManager().execute({
          method: 'createFile',
          args: [
            path.join(this.currentPath, this.new_file_name)
          ],
          callback: (err) => {
            if (err) return
            this.refresh()
          }
        })
      },
      /**
       * @deprecated since v0.2
       */
      importFile () {
        dialog.showOpenDialog({
          properties: ['openFile']
        }, function (files) {
          files.forEach(this.importLocalFile)
        }.bind(this))
      },
      /**
       * @deprecated since v0.2
       */
      importLocalFile (file_path) {
        fs.readFile(file_path, (err, data) => {
          if (err) {
            dialog.showMessageBox({buttons: ['好的'], message: err.toString()})
            return
          }
          VDevice.getCommandManager().execute({
            method: 'writeFile',
            args: [
              path.join(this.currentPath, path.basename(file_path)),
              data
            ],
            callback: (err) => {
              if (err) return
              this.refresh()
            }
          })
        })
      },
      /**
       * @deprecated since v0.2
       */
      close_rename () {
        this.file_path = ''
        this.file_name = ''
        this.file_name_rename = ''
        this.mode = ''
      }
    },

    events: {
      openMsg (msg) {
        var command = VDevice.getCommandManager()
        if (msg.isFile) {
          this.$broadcast('openPreview', msg)
        } else if (msg.isDirectory) {
          this.cd(msg.file)
        }
      },
      renameMsg (msg) {
        this.openRename(msg.file)
      },
      removeMsg (msg) {
      },
      refreshMsg (msg) {
        this.refresh()
      }
    },

    components: {
      ItemComponent,
      Preview
    }
  }
</script>

<style>
</style>
