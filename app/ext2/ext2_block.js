import Ext2SuperBlock from './ext2_super_block'

export default class Ext2Block {
  constructor (buf) {
    this.buf = buf
    this.block_size = buf.readInt32LE(24)
    this.ext2_super_block = new Ext2SuperBlock(buf.slice(0, this.block_size))
    this.ext2_group_desc = buf.slice(this.block_size, this.block_size * 2)
    this.ext2_block_bitmap = buf.slice(this.block_size * 2, this.block_size * 3)
    this.ext2_inode_bitmap = buf.slice(this.block_size * 3, this.block_size * 4)
    this.ext2_inode_table = buf.slice(this.block_size * 4, this.block_size * (4 + 214))
    this.ext2_data = buf.slice(this.block_size * (4 + 214))
  }
  write_directory (id) {

  }
}
