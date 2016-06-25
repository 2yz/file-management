import Ext2SuperBlock from './ext2_super_block'

export default class BlockGroup {
  constructor(buf, block_size) {
    this.buf = buf
    this.super_block = new Ext2SuperBlock(buf.slice(1, block_size))
  }

  static create () {
  }
}
