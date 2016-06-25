import FILE_TYPE from './const/file_type'

export default class Directory {
  static create (dir_inode_index, parent_inode_index) {
    return [
      {inode: dir_inode_index, file_type: FILE_TYPE.EXT2_FT_DIR, name: '.'},
      {inode: parent_inode_index, file_type: FILE_TYPE.EXT2_FT_DIR, name: '..'}
    ]
  }
  static create_root () {
    return [{inode: 1, file_type: FILE_TYPE.EXT2_FT_DIR, name: '.'}, {inode: 0, file_type: FILE_TYPE.EXT2_FT_DIR, name: '..'}]
  }
}
