import VFS from './vfs'
import FSDefault from './default'
import FSUnix from './unix'

/**
 * File System Factory
 * @param {String} type
 * @param {Object} options
 * @returns {VFS}
 */
function FSFactory (type, options) {
  var vfs = null
  switch (type) {
    case 'native':
      vfs = new FSUnix()
      break
    default:
      vfs = new FSDefault()
      break
  }
  if (!vfs) {
    throw new Error('Not supported FS type!')
  }
  return vfs
}

export default FSFactory
