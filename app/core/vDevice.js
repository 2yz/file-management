import FSFactory from './fs/factory'
import CommandManager from './fs/commandManager'

var VDevice = (function () {
  var m_type = null
  var m_vfs = null
  var m_commandMangager = null

  return {
    initial(type, options) {
      m_type = type
      m_vfs = FSFactory(type, options)
      m_commandMangager = new CommandManager(m_vfs)
    },
    getVFS() {
      return m_vfs
    },
    getCommandManager() {
      return m_commandMangager
    }
  }
})()

export default VDevice
