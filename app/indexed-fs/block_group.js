export default class BlockGroup {
  constructor (buf) {
    this.buf = buf
    this.block_size = buf.readInt32LE(24)
    this.super_block = new SuperBlock(buf.slice(0, this.block_size))
    // this.ext2_group_desc = buf.slice(this.block_size, this.block_size * 2)
    // this.ext2_block_bitmap = buf.slice(this.block_size * 2, this.block_size * 3)
    // this.ext2_inode_bitmap = buf.slice(this.block_size * 3, this.block_size * 4)
    this.inode_table = buf.slice(this.block_size * 2, this.block_size * 258)
    this.data_bitmap = buf.slice(this.block_size * 258, this.block_size * 268)
    this.ext2_data = buf.slice(this.block_size * 268)
  }
  
  
}
