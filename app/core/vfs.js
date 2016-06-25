import INode from './inode'
import Directory from './directory'
import I_MODE from './const/i_mode'
import FILE_TYPE from './const/file_type'

export default class VFS {
  constructor (device) {
    this.device = device
    this.super_block = device.super_block
    this.block_size = this.super_block.block_size
    this.inode_table = device.inode_table
    this.data_bitmap_buffer = device.data_bitmap_buffer
    this.data_block_buffer = device.data_block_buffer
  }

  set_1_bitmap (index) {
    var n = index % 8
    var i = Math.floor(index / 8)
    this.data_bitmap_buffer[i] = this.data_bitmap_buffer[i] | (1 << n)
  }

  set_0_bitmap (index) {
    var n = index % 8
    var i = Math.floor(index / 8)
    this.data_bitmap_buffer[i] = this.data_bitmap_buffer[i] & (~(1 << n))
  }

  not_bitmap (index) {
    var n = index % 8
    var i = Math.floor(index / 8)
    this.data_bitmap_buffer[i] = this.data_bitmap_buffer[i] ^ (1 << n)
  }

  get_bitmap (index) {
    var n = index % 8
    var i = Math.floor(index / 8)
    return (this.data_bitmap_buffer[i] & (1 << n)) >> n
  }

  get_free_block_index () {
    for (var i = 0; i < this.super_block.blocks_count; ++i) {
      if (!this.get_bitmap(i)) return i
    }
    throw new Error('No Free Block!')
  }

  write (buf, inode) {
    inode.i_mtime = new Date()
    var blocks_count = Math.ceil(buf.length / this.block_size)
    for (var i = 0; i < blocks_count; ++i) {
      var buf_block = buf.slice(this.block_size * i, this.block_size * (i + 1))
      var block_index = this.get_free_block_index()
      var block = this.data_block_buffer.slice(this.block_size * block_index, this.block_size * (block_index + 1))
      buf_block.copy(block)
      this.set_1_bitmap(block_index)
      --this.super_block.free_blocks_count
      inode.i_block.push(block_index)
    }
  }

  read (inode) {
    inode.i_atime = new Date()
    var buf_list = []
    for (var i = 0; i < inode.i_block.length; ++i) {
      buf_list.push(this.data_block_buffer.slice(this.block_size * inode.i_block[i], this.block_size * (inode.i_block[i] + 1)))
    }
    var buf = Buffer.concat(buf_list)
    return buf.slice(0, inode.i_size)
  }

  remove (inode) {
    inode.i_dtime = new Date()
    for (var i = 0; i < inode.i_block.length; ++i) {
      this.set_0_bitmap(inode.i_block[i])
      ++this.super_block.free_blocks_count
    }
    inode.i_block = []
    inode.i_size = 0
  }

  read_file (inode_index) {
    if (inode_index > this.inode_table.length) throw new Error('Out of inode_table range')
    var inode = this.inode_table[inode_index - 1]
    return this.read(inode)
  }

  update_file (buf, inode_index) {
    var inode = this.inode_table[inode_index - 1]
    this.remove(inode)
    inode.i_size = buf.length
    this.write(buf, inode)
  }

  rename_file (name, inode_index, parent_inode_index) {
    this.check_same_name(name, parent_inode_index)
    var parent = JSON.parse(this.read_file(parent_inode_index).toString())
    for (var i = 0; i < parent.length; ++i) {
      if (parent[i].inode === inode_index) {
        parent[i].name = name
        this.update_file(Buffer.from(JSON.stringify(parent)), parent_inode_index)
        return true
      }
    }
    return false
  }

  remove_file (inode_index, parent_inode_index) {
    // remove_file
    this.remove(this.inode_table[inode_index - 1])
    // remove_from_parent
    var parent = JSON.parse(this.read_file(parent_inode_index).toString())
    for (var i = 0; i < parent.length; ++i) {
      if (parent[i].inode === inode_index) {
        parent[i].inode = 0
        this.update_file(Buffer.from(JSON.stringify(parent)), parent_inode_index)
        return true
      }
    }
    return false
  }

  check_same_name (name, parent_inode_index) {
    var parent = this.read_dir(parent_inode_index)
    for (var i = 0; i < parent.length; ++i) {
      if (parent[i].name === name) throw new Error('创建失败，已存在同名文件/文件夹')
    }
  }

  create_reg_file (buf, name, parent_inode_index) {
    if (!buf) buf = Buffer.alloc(0)
    // check_same_name
    this.check_same_name(name, parent_inode_index)
    // create_reg_file
    var file_inode_index = this.inode_table.length + 1
    var inode = INode.create(I_MODE.EXT2_S_IFREG, buf.length)
    this.write(buf, inode)
    this.inode_table.push(inode)
    // add_reg_file_to_parent
    var parent = JSON.parse(this.read_file(parent_inode_index).toString())
    parent.push({inode: file_inode_index, file_type: FILE_TYPE.EXT2_FT_REG_FILE, name: name})
    this.update_file(Buffer.from(JSON.stringify(parent)), parent_inode_index)
    return this.inode_table.length
  }

  create_dir (name, parent_inode_index) {
    // check_same_name
    this.check_same_name(name, parent_inode_index)
    // create_dir
    var dir_inode_index = this.inode_table.length + 1
    var buf = Buffer.from(JSON.stringify(Directory.create(dir_inode_index, parent_inode_index)))
    var inode = INode.create(I_MODE.EXT2_S_IFDIR, buf.length)
    this.write(buf, inode)
    this.inode_table.push(inode)
    // add_dir_to_parent
    var parent = JSON.parse(this.read_file(parent_inode_index).toString())
    parent.push({inode: dir_inode_index, file_type: FILE_TYPE.EXT2_FT_DIR, name: name})
    this.update_file(Buffer.from(JSON.stringify(parent)), parent_inode_index)
    return this.inode_table.length
  }

  create_root_dir () {
    var buf = Buffer.from(JSON.stringify(Directory.create_root()))
    var inode = INode.create(I_MODE.EXT2_S_IFDIR, buf.length)
    this.write(buf, inode)
    this.inode_table.push(inode)
    return this.inode_table.length
  }

  read_dir (inode_index) {
    return JSON.parse(this.read_file(inode_index).toString())
  }

  remove_dir (inode_index, parent_inode_index) {
    // TODO deep remove
    this.remove_file(inode_index, parent_inode_index)
  }

  static format (device, block_size) {
    if (!device || !block_size) return false
    device.super_block = {
      block_size: block_size, // block 的大小
      blocks_count: device.size / block_size, // data blocks 计数
      free_blocks_count: device.size / block_size // data blocks 计数
    }
    device.inode_table = []
    device.data_bitmap_buffer = Buffer.alloc(device.size / block_size / 8)
    var vfs = new VFS(device)
    vfs.create_root_dir()
    return true
  }
  static mount (device) {
    if (device.super_block && device.inode_table && device.data_bitmap_buffer && device.data_block_buffer) {
      return new VFS(device)
    } else {
      return null
    }
  }
}
