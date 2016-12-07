<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="window">
    <header class="toolbar toolbar-header">
      <div class="toolbar-actions">
        <div class="btn-group">
          <button v-on:click="open_root_dir" class="btn btn-default">
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
        <div class="btn-group pull-right">
          <button v-on:click="write" class="btn btn-default">写回磁盘</button>
        </div>
        <div class="btn-group pull-right">
          <button v-on:click="mount" class="btn btn-default">挂载</button>
          <button v-on:click="unmount" class="btn btn-default">卸载</button>
          <button v-on:click="format" class="btn btn-default">格式化</button>
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
        <preview v-bind:file_path.sync="file_path" v-bind:style="{display: file_path === '' ? 'none': 'block'}">

        </preview>

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
    <footer class="toolbar toolbar-footer">
      <!--<h1 class="title">磁盘文件路径：{{device_path}} ， 总空间：{{size}} 字节， 剩余空间：{{free_size}} 字节</h1>-->
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import fs from 'fs'
  import path from 'path'
  import mime from 'mime'
  import DeviceOld from './core/device_old'
  import VFS from './core/vfs_old'
  import FILE_TYPE from './core/const/file_type'
  const {app, dialog} = require('electron').remote

  import ItemComponent from './component/item'

  import FSFactory from './core/fs/factory'
  import VDevice from './core/vDevice'

  import Preview from './component/Preview'

  var fs_name = 'my-fs'
  var device = null
  var vfs_old = null
  var userData = app.getPath('userData')



  export default {
    ready () {
      VDevice.initial('native')
      // debug
      this.commandManager = VDevice.getCommandManager()
      this.cd('/')

      /*
       try {
       device = DeviceOld.read(fs_name)
       } catch (e) {
       device = DeviceOld.create(fs_name)
       }
       if (!device) {
       dialog.showMessageBox({buttons: ['好的'], message: '无法读取/创建磁盘'})
       return
       }
       this.mount()
       */
    },
    data () {
      return {
        currentPath: '/',
        files: [],
        file_path: '',
        // debug
        commandManager: null,

        // old
        inode_index: 0,
        items: [],
        size: 0,
        free_size: 0,
        // 界面模式
        mode: '',
        // 新建
        new_file_name: '',
        new_dir_name: '',
        // 文件
        file_inode: 0,
        file_name: '',
        file_text: '',
        // 图像文件
        file_image_src: '',
        // 音乐文件
        file_audio_src: '',
        // 重命名
        file_name_rename: '',
        // 设备路径
        device_path: path.join(userData, fs_name)
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
        console.log(files)
        this.currentPath = currentPath
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
       * @deprecated temporary
       */
      openFile (file) {
        var mimeType = mime.lookup(file)
        try {
          switch (mimeType.split('/')[0]) {
            case 'text':
              this.openTextFile(file)
              break
            case 'image':
              this.openImageFile(file)
              break
            case 'audio':
              this.openAudioFile(file)
              break
            default:
              this.openRegFile(file)
              break
          }
        } catch (e) {
          dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
        }
      },
      /**
       * @deprecated temporary
       */
      openRegFile (file) {
        this.file_name = path.basename(file)
        this.mode = 'file'
      },
      /**
       * @deprecated temporary
       */
      openTextFile (file) {
        this.file_name = path.basename(file)
        VDevice.getCommandManager().execute({
          method: 'readFile',
          args: [file],
          callback: (err, data) => {
            if (err) return
            this.file_text = data.toString()
          }
        })
        this.mode = 'text'
      },
      /**
       * @deprecated temporary
       */
      openImageFile (file) {
        this.file_name = path.basename(file)
        this.mode = 'image'
        VDevice.getCommandManager().execute({
          method: 'readFile',
          args: [file],
          callback: (err, data) => {
            if (err) return
            var arr = ['data:' + mime.lookup(file) + ';base64,']
            arr.push(data.toString('base64'))
            this.file_image_src = arr.join('')
          }
        })
      },
      /**
       * @deprecated temporary
       */
      openAudioFile (file) {
        this.file_name = path.basename(file)
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
      },
      /**
       * @deprecated temporary
       */
      openRename (file) {
        this.file_name = file
        this.file_name_rename = ''
        this.mode = 'rename'
      },
      /**
       * @deprecated temporary
       */
      renameFile () {
        VDevice.getCommandManager().execute({
          method: 'rename',
          args: [
            this.file_name,
            path.join(path.dirname(this.file_name), this.file_name_rename)
          ],
          callback: (err) => {
            if (err) return
            this.refresh()
          }
        })
      },
      /**
       * @deprecated temporary
       */
      showCreate () {
        if (this.mode === 'create') {
          this.mode = ''
        } else {
          this.mode = 'create'
        }
      },
      /**
       * @deprecated temporary
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
       * @deprecated temporary
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
       * @deprecated temporary
       */
      importFile () {
        dialog.showOpenDialog({
          properties: ['openFile']
        }, function (files) {
          files.forEach(this.importLocalFile)
        }.bind(this))
      },
      /**
       * @deprecated since version 0.2.0
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

      // old
      /**
       * @deprecated
       */
      read_dir (inode_index) {
        this.inode_index = inode_index
        var items = []
        var dir = vfs_old.read_dir(inode_index)
        for (var i = 0; i < dir.length; ++i) {
          var entry = dir[i]
          if (entry.inode > 0) {
            var inode = vfs_old.inode_table[entry.inode - 1]
            items.push({
              inode: entry.inode, file_type: entry.file_type, name: entry.name,
              i_mode: inode.i_mode, i_size: inode.i_size, i_mtime: inode.i_mtime,
              mime_type: mime.lookup(entry.name)
            })
          }
        }
        this.items = items
        this.size = vfs_old.super_block.block_size * vfs_old.super_block.blocks_count
        this.free_size = vfs_old.super_block.block_size * vfs_old.super_block.free_blocks_count
        this.mode = ''
      },
      /**
       * @deprecated
       */
      refreshOld () {
        this.read_dir(this.inode_index)
      },
      /**
       * @deprecated
       */
      format () {
        if (!device) return dialog.showMessageBox({buttons: ['好的'], message: '无磁盘'})
        if (vfs_old) return dialog.showMessageBox({buttons: ['好的'], message: '请先卸载文件系统'})
        VFS.format(device, 1024)
        dialog.showMessageBox({buttons: ['好的'], message: '格式化成功'})
      },
      /**
       * @deprecated since version 0.2.0
       */
      mount () {
        if (!device) return
        if (vfs_old) return dialog.showMessageBox({buttons: ['好的'], message: '已挂载'})
        vfs_old = VFS.mount(device)
        if (!vfs_old) return dialog.showMessageBox({buttons: ['好的'], message: '未格式化，无法挂载'})
        this.read_dir(1)
        dialog.showMessageBox({buttons: ['好的'], message: '挂载成功'})
      },
      /**
       * @deprecated since version 0.2.0
       */
      unmount () {
        vfs_old = null
        this.inode_index = 0
        this.items = []
        this.size = 0
        this.free_size = 0
        dialog.showMessageBox({buttons: ['好的'], message: '卸载成功'})
      },
      /**
       * @deprecated since version 0.2.0
       */
      write () {
        if (!device) return
        if (device.write()) dialog.showMessageBox({buttons: ['好的'], message: '写回成功'})
        else dialog.showMessageBox({buttons: ['好的'], message: '写回失败'})
      },
      /**
       * @deprecated since version 0.2.0
       */
      create_dir () {
        try {
          vfs_old.create_dir(this.new_dir_name, this.inode_index)
          this.new_dir_name = ''
          this.refreshOld()
        } catch (e) {
          dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
        }
      },
      /**
       * @deprecated since version 0.2.0
       */
      create_reg_file () {
        try {
          vfs_old.create_reg_file(null, this.new_file_name, this.inode_index)
          this.new_file_name = ''
          this.refreshOld()
        } catch (e) {
          dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
        }
      },
      /**
       * @deprecated since version 0.2.0
       */
      import_file () {
        dialog.showOpenDialog({
          properties: ['openFile']
        }, function (files) {
          files.forEach(this.import_local_file)
        }.bind(this))
      },
      /**
       * @deprecated since version 0.2.0
       */
      import_local_file (file_path) {
        fs.readFile(file_path, function (err, data) {
          try {
            if (err) return dialog.showMessageBox({buttons: ['好的'], message: err.toString()})
            var file_name = path.parse(file_path).base
            vfs_old.create_reg_file(data, file_name, this.inode_index)
            this.refreshOld()
          } catch (e) {
            dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
          }
        }.bind(this))
      },
      /**
       * @deprecated since version 0.2.0
       */
      export_file () {
        var export_dir_path = path.join(userData, fs_name + '-exported')
        var export_path = path.join(export_dir_path, this.file_name)
        try {
          fs.accessSync(export_dir_path)
        } catch (e) {
          fs.mkdirSync(export_dir_path)
        }
        fs.writeFile(export_path, vfs_old.read_file(this.file_inode), function (err) {
          if (err) return dialog.showMessageBox({buttons: ['好的'], message: err.toString()})
          dialog.showMessageBox({buttons: ['好的'], message: '文件已导出至 ' + export_path})
        })
      },
      /**
       * @deprecated since version 0.2.0
       */
      show_create () {
        if (!vfs_old) {
          dialog.showMessageBox({buttons: ['好的'], message: '未挂载文件系统'})
          return
        }
        if (this.mode === 'create') this.mode = ''
        else this.mode = 'create'
      },
      /**
       * @deprecated since version 0.2.0
       */
      remove_file (item) {
        vfs_old.remove_file(item.inode, this.inode_index)
        this.refreshOld()
      },
      /**
       * @deprecated since version 0.2.0
       */
      open_dir (item) {
        this.read_dir(item.inode)
      },
      /**
       * @deprecated since version 0.2.0
       */
      open_root_dir () {
        if (!vfs_old) {
          dialog.showMessageBox({buttons: ['好的'], message: '未挂载文件系统'})
          return
        }
        this.read_dir(1)
      },
      /**
       * @deprecated since version 0.2.0
       */
      open_file (item) {
        try {
          switch (item.mime_type.split('/')[0]) {
            case 'text':
              this.open_text_file(item)
              break
            case 'image':
              this.open_image_file(item)
              break
            case 'audio':
              this.open_audio_file(item)
              break
            default:
              this.open_reg_file(item)
              break
          }
        } catch (e) {
          dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
        }
      },
      /**
       * @deprecated since version 0.2.0
       */
      open_reg_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.mode = 'file'
      },
      /**
       * @deprecated since version 0.2.0
       */
      open_text_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.file_text = vfs_old.read_file(item.inode).toString()
        this.mode = 'text'
      },
      /**
       * @deprecated since version 0.2.0
       */
      open_image_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.mode = 'image'
        var arr = ['data:' + item.mime_type + ';base64,']
        arr.push(vfs_old.read_file(item.inode).toString('base64'))
        this.file_image_src = arr.join('')
      },
      /**
       * @deprecated since version 0.2.0
       */
      open_audio_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.mode = 'audio'
        var arr = ['data:' + item.mime_type + ';base64,']
        arr.push(vfs_old.read_file(item.inode).toString('base64'))
        this.file_audio_src = arr.join('')
      },
      /**
       * @deprecated since version 0.2.0
       */
      close_file () {
        this.file_inode = 0
        this.file_name = ''
        this.file_text = ''
        this.mode = ''
      },
      /**
       * @deprecated since version 0.2.0
       */
      save_file_text () {
        vfs_old.update_file(Buffer.from(this.file_text), this.file_inode)
        this.close_file()
        this.refreshOld()
        dialog.showMessageBox({buttons: ['好的'], message: '保存成功'})
      },
      /**
       * @deprecated since version 0.2.0
       */
      open_rename (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.file_name_rename = ''
        this.mode = 'rename'
      },
      /**
       * @deprecated since version 0.2.0
       */
      rename_file () {
        try {
          vfs_old.rename_file(this.file_name_rename, this.file_inode, this.inode_index)
          this.close_rename()
          this.refreshOld()
        } catch (e) {
          dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
        }
      },
      /**
       * @deprecated since version 0.2.0
       */
      close_rename () {
        this.file_inode = 0
        this.file_name = ''
        this.file_name_rename = ''
        this.mode = ''
      },
      /**
       * @deprecated since version 0.2.0
       */
      is_reg_file (item) {
        return item.file_type === FILE_TYPE.EXT2_FT_REG_FILE
      },
      /**
       * @deprecated since version 0.2.0
       */
      is_dir (item) {
        return item.file_type === FILE_TYPE.EXT2_FT_DIR && item.name !== '.' && item.name !== '..'
      },
      /**
       * @deprecated since version 0.2.0
       */
      is_current_dir (item) {
        return item.file_type === FILE_TYPE.EXT2_FT_DIR && item.name === '.'
      },
      /**
       * @deprecated since version 0.2.0
       */
      is_up_dir (item) {
        return item.file_type === FILE_TYPE.EXT2_FT_DIR && item.name === '..'
      }
    },

    events: {
      openMsg (msg) {
        var command = VDevice.getCommandManager()
        if (msg.isFile) {
          console.log('I have to log now')
          this.file_path = msg.file
          console.log(msg.file)
          this.openFile(msg.file)
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
