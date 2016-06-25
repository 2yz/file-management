export default class INode {
  static create (i_mode, i_size) {
    var time = new Date()
    var inode = {
      i_mode: i_mode,
      i_size: i_size,
      i_atime: time,
      i_mtime: time,
      i_dtime: undefined,
      i_block: []
    }
    return inode
  }
}
