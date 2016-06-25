<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div class="window">
    <header class="toolbar toolbar-header">
      <div class="toolbar-actions">
        <div class="btn-group">
          <button v-on:click="open_root_dir" class="btn btn-default">
            <span class="icon icon-home"></span>&nbsp;根目录
          </button>
        </div>
        <div class="btn-group">
          <button v-on:click="show_create" class="btn btn-default">
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
                <button v-on:click="create_dir" type="button" class="btn btn-mini btn-default" style="float: right;">新建</button>
              </div>
              <input v-model="new_dir_name" class="form-control" placeholder="文件夹名">
            </div>
            <div class="form-group">
              <div>
                <label>新建文件</label>
                <button v-on:click="create_reg_file" type="button" class="btn btn-mini btn-default" style="float: right;">新建</button>
              </div>
              <input v-model="new_file_name" class="form-control" placeholder="文件名">
            </div>
            <div class="form-group">
              <div>
                <label>导入文件</label>
                <button v-on:click="import_file" type="button" class="btn btn-mini btn-default" style="float: right;">导入</button>
              </div>
            </div>
          </div>
        </div>
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
            <tr v-for="item in items">
              <td>{{item.name}}</td>
              <td>{{item.file_type | resolve_file_type}}</td>
              <td>
                <span v-if="is_reg_file(item)">{{item.mime_type}}</span>
              </td>
              <td>{{item.i_size}} 字节</td>
              <td>{{item.i_mtime | date_filter}}</td>
              <td>
                <div v-if="is_reg_file(item)">
                  <button v-on:click="open_file(item)" class="btn btn-mini btn-default">
                    打开
                  </button>
                  <button v-on:click="open_rename(item)" class="btn btn-mini btn-default">
                    重命名
                  </button>
                  <button v-on:click="remove_file(item)" class="btn btn-mini btn-default">
                    删除
                  </button>
                </div>
                <div v-if="is_dir(item)">
                  <button v-on:click="open_dir(item)" class="btn btn-mini btn-default">
                    打开
                  </button>
                  <button v-on:click="open_rename(item)" class="btn btn-mini btn-default">
                    重命名
                  </button>
                  <button v-on:click="remove_file(item)" class="btn btn-mini btn-default">
                    删除
                  </button>
                </div>
                <div v-if="is_current_dir(item)">
                  <button v-on:click="open_dir(item)" class="btn btn-mini btn-default">
                    当前目录
                  </button>
                </div>
                <div v-if="is_up_dir(item)">
                  <button v-on:click="open_dir(item)" class="btn btn-mini btn-default">
                    返回上级目录
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
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
        <div class="pane sidebar padded-more" v-bind:style="{ display: mode === 'image' ? 'block' : 'none' }">
          <div>
            <div class="form-group">
              <label>{{file_name}}</label>
            </div>
            <div class="form-group">
              <img v-bind:src="file_image_src" style="width: 100%;"/>
            </div>
            <div class="form-actions">
              <button v-on:click="close_file" type="button" class="btn btn-form btn-default">关闭</button>
              <button v-on:click="export_file" type="button" class="btn btn-form btn-default">导出</button>
            </div>
          </div>
        </div>
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
        <div class="pane-sm sidebar padded-more" v-bind:style="{ display: mode === 'rename' ? 'block' : 'none' }">
          <div>
            <div class="form-group">
              <label>现在的名称：{{file_name}}</label>
              <input v-model="file_name_rename" class="form-control" placeholder="输入新名称">
            </div>
            <div class="form-actions">
              <button v-on:click="close_rename" type="button" class="btn btn-form btn-default">关闭</button>
              <button v-on:click="rename_file" type="button" class="btn btn-form btn-primary">重命名</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="toolbar toolbar-footer">
      <h1 class="title">磁盘文件路径：{{device_path}} ， 总空间：{{size}} 字节， 剩余空间：{{free_size}} 字节</h1>
    </footer>
  </div>
</template>

<script>
  import fs from 'fs'
  import path from 'path'
  import mime from 'mime'
  import Device from './core/device'
  import VFS from './core/vfs'
  import FILE_TYPE from './core/const/file_type'
  const {app, dialog} = require('electron').remote

  var fs_name = 'my-fs'
  var device = null
  var vfs = null
  var userData = app.getPath('userData')

  export default {
    ready () {
      try {
        device = Device.read(fs_name)
      } catch (e) {
        console.log('device read error:', e)
        device = Device.create(fs_name)
      }
      if (!device) {
        dialog.showMessageBox({buttons: ['好的'], message: '无法读取/创建磁盘'})
        return
      }
      this.mount()
    },
    data () {
      return {
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
    methods: {
      read_dir (inode_index) {
        this.inode_index = inode_index
        var items = []
        var dir = vfs.read_dir(inode_index)
        for (var i = 0; i < dir.length; ++i) {
          var entry = dir[i]
          if (entry.inode > 0) {
            var inode = vfs.inode_table[entry.inode - 1]
            items.push({
              inode: entry.inode, file_type: entry.file_type, name: entry.name,
              i_mode: inode.i_mode, i_size: inode.i_size, i_mtime: inode.i_mtime,
              mime_type: mime.lookup(entry.name)
            })
          }
        }
        this.items = items
        this.size = vfs.super_block.block_size * vfs.super_block.blocks_count
        this.free_size = vfs.super_block.block_size * vfs.super_block.free_blocks_count
        this.mode = ''
      },
      refresh () {
        this.read_dir(this.inode_index)
      },
      format () {
        if (!device) return dialog.showMessageBox({buttons: ['好的'], message: '无磁盘'})
        if (vfs) return dialog.showMessageBox({buttons: ['好的'], message: '请先卸载文件系统'})
        VFS.format(device, 1024)
        dialog.showMessageBox({buttons: ['好的'], message: '格式化成功'})
      },
      mount () {
        if (!device) return
        if (vfs) return dialog.showMessageBox({buttons: ['好的'], message: '已挂载'})
        vfs = VFS.mount(device)
        if (!vfs) return dialog.showMessageBox({buttons: ['好的'], message: '未格式化，无法挂载'})
        this.read_dir(1)
        dialog.showMessageBox({buttons: ['好的'], message: '挂载成功'})
      },
      unmount () {
        vfs = null
        this.inode_index = 0
        this.items = []
        this.size = 0
        this.free_size = 0
        dialog.showMessageBox({buttons: ['好的'], message: '卸载成功'})
      },
      write () {
        if (!device) return
        if (device.write()) dialog.showMessageBox({buttons: ['好的'], message: '写回成功'})
        else dialog.showMessageBox({buttons: ['好的'], message: '写回失败'})
      },
      create_dir () {
        try {
          vfs.create_dir(this.new_dir_name, this.inode_index)
          this.new_dir_name = ''
          this.refresh()
        } catch (e) {
          dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
        }
      },
      create_reg_file () {
        try {
          vfs.create_reg_file(null, this.new_file_name, this.inode_index)
          this.new_file_name = ''
          this.refresh()
        } catch (e) {
          dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
        }
      },
      import_file () {
        dialog.showOpenDialog({
          properties: ['openFile']
        }, function (files) {
          files.forEach(this.import_local_file)
        }.bind(this))
      },
      import_local_file (file_path) {
        fs.readFile(file_path, function (err, data) {
          try {
            if (err) return dialog.showMessageBox({buttons: ['好的'], message: err.toString()})
            var file_name = path.parse(file_path).base
            vfs.create_reg_file(data, file_name, this.inode_index)
            this.refresh()
          } catch (e) {
            dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
          }
        }.bind(this))
      },
      export_file () {
        var export_dir_path = path.join(userData, fs_name + '-exported')
        var export_path = path.join(export_dir_path, this.file_name)
        try {
          fs.accessSync(export_dir_path)
        } catch (e) {
          fs.mkdirSync(export_dir_path)
        }
        fs.writeFile(export_path, vfs.read_file(this.file_inode), function (err) {
          if (err) return dialog.showMessageBox({buttons: ['好的'], message: err.toString()})
          dialog.showMessageBox({buttons: ['好的'], message: '文件已导出至 ' + export_path})
        })
      },
      show_create () {
        if (!vfs) {
          dialog.showMessageBox({buttons: ['好的'], message: '未挂载文件系统'})
          return
        }
        if (this.mode === 'create') this.mode = ''
        else this.mode = 'create'
      },
      remove_file (item) {
        vfs.remove_file(item.inode, this.inode_index)
        this.refresh()
      },
      open_dir (item) {
        this.read_dir(item.inode)
      },
      open_root_dir () {
        if (!vfs) {
          dialog.showMessageBox({buttons: ['好的'], message: '未挂载文件系统'})
          return
        }
        this.read_dir(1)
      },
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
      open_reg_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.mode = 'file'
      },
      open_text_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.file_text = vfs.read_file(item.inode).toString()
        this.mode = 'text'
      },
      open_image_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.mode = 'image'
        var arr = ['data:' + item.mime_type + ';base64,']
        arr.push(vfs.read_file(item.inode).toString('base64'))
        this.file_image_src = arr.join('')
      },
      open_audio_file (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.mode = 'audio'
        var arr = ['data:' + item.mime_type + ';base64,']
        arr.push(vfs.read_file(item.inode).toString('base64'))
        this.file_audio_src = arr.join('')
      },
      close_file () {
        this.file_inode = 0
        this.file_name = ''
        this.file_text = ''
        this.mode = ''
      },
      save_file_text () {
        vfs.update_file(Buffer.from(this.file_text), this.file_inode)
        this.close_file()
        this.refresh()
        dialog.showMessageBox({buttons: ['好的'], message: '保存成功'})
      },
      open_rename (item) {
        this.file_inode = item.inode
        this.file_name = item.name
        this.file_name_rename = ''
        this.mode = 'rename'
      },
      rename_file () {
        try {
          vfs.rename_file(this.file_name_rename, this.file_inode, this.inode_index)
          this.close_rename()
          this.refresh()
        } catch (e) {
          dialog.showMessageBox({buttons: ['好的'], message: e.toString()})
        }
      },
      close_rename () {
        this.file_inode = 0
        this.file_name = ''
        this.file_name_rename = ''
        this.mode = ''
      },
      is_reg_file (item) {
        return item.file_type === FILE_TYPE.EXT2_FT_REG_FILE
      },
      is_dir (item) {
        return item.file_type === FILE_TYPE.EXT2_FT_DIR && item.name !== '.' && item.name !== '..'
      },
      is_current_dir (item) {
        return item.file_type === FILE_TYPE.EXT2_FT_DIR && item.name === '.'
      },
      is_up_dir (item) {
        return item.file_type === FILE_TYPE.EXT2_FT_DIR && item.name === '..'
      }
    }
  }
</script>

<style>
</style>
