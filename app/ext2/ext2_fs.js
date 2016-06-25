import Ext2SuperBlock from './ext2_super_block'
import Ext2Block from './ext2_block'

export default class Ext2FS {
  constructor (buf) {
    var main_blocks = buf.slice(1024)
    this.super_block = new Ext2SuperBlock(main_blocks.slice(0, 1024))
    this.block = new Ext2Block(main_blocks.slice(0))
  }
  static create () {
    var block_size = 1024 // bytes
    var fs_size = 134217728 // bytes
    var buf = Buffer.alloc(fs_size)
    var super_block = new Ext2SuperBlock(buf.slice(1024, 1024 * 2))
    super_block.s_log_block_size = block_size
    return new Ext2FS(buf)
  }
}
