export default class SuperBlock {
  constructor (buf) {
    this.buf = buf
  }
  /* 0 inodes 计数 */
  // get s_nodes_count () {
  //   return this.buf.readInt32LE(0)
  // }
  // set s_nodes_count (val) {
  //   this.buf.writeInt32LE(val, 0)
  // }
  /* 4 blocks 计数 */
  get s_blocks_count () {
    return this.buf.readInt32LE(4)
  }
  set s_blocks_count (val) {
    this.buf.writeInt32LE(val, 4)
  }
  /* 8 保留的 blocks 计数 */
  // get s_r_blocks_count () {
  //   return this.buf.readInt32LE(8)
  // }
  // set s_r_blocks_count (val) {
  //   this.buf.writeInt32LE(val, 8)
  // }
  /* 12 空闲的 blocks 计数 */
  get s_free_blocks_count () {
    return this.buf.readInt32LE(12)
  }
  set s_free_blocks_count (val) {
    this.buf.writeInt32LE(val, 12)
  }
  /* 16 空闲的 inodes 计数 */
  // get s_free_inodes_count () {
  //   return this.buf.readInt32LE(16)
  // }
  // set s_free_inodes_count (val) {
  //   this.buf.writeInt32LE(val, 16)
  // }
  /* 20 第一个数据 block */
  get s_first_data_block () {
    return this.buf.readInt32LE(20)
  }
  set s_first_data_block (val) {
    this.buf.writeInt32LE(val, 20)
  }
  /* 24 block 的大小 */
  get s_log_block_size () {
    return this.buf.readInt32LE(24)
  }
  set s_log_block_size (val) {
    this.buf.writeInt32LE(val, 24)
  }
  /* 32 每 block group 的 block 数量 */
  // get s_blocks_per_group () {
  //   return this.buf.readInt32LE(32)
  // }
  // set s_blocks_per_group (val) {
  //   this.buf.writeInt32LE(val, 32)
  // }
  /* 40 每 block group 的 inode 数量 */
  // get s_inodes_per_group () {
  //   return this.buf.readInt32LE(40)
  // }
  // set s_inodes_per_group (val) {
  //   this.buf.writeInt32LE(val, 40)
  // }
}
