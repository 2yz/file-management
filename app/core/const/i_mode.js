/* file format */
const I_MODE = {
  EXT2_S_IFSOCK: 0xC000, // socket
  EXT2_S_IFLNK: 0xA000, // symbolic link
  EXT2_S_IFREG: 0x8000,	// regular file
  EXT2_S_IFBLK: 0x6000,	// block device
  EXT2_S_IFDIR: 0x4000,	// directory
  EXT2_S_IFCHR: 0x2000,	// character device
  EXT2_S_IFIFO: 0x1000	// fifo
}
export default I_MODE
