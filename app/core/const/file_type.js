/*
 file_type
 8bit unsigned value used to indicate file type.
 */
const FILE_TYPE = {
  EXT2_FT_UNKNOWN: 0,   // Unknown File Type
  EXT2_FT_REG_FILE: 1,  // Regular File
  EXT2_FT_DIR: 2,       // Directory File
  EXT2_FT_CHRDEV: 3,    // Character Device
  EXT2_FT_BLKDEV: 4,    // Block Device
  EXT2_FT_FIFO: 5,      // Buffer File
  EXT2_FT_SOCK: 6,      // Socket File
  EXT2_FT_SYMLINK: 7    // Symbolic Link
}
export default FILE_TYPE
