import VFS from './vfs'

class FSCommand {
  /**
   * FSCommand constructor
   * @param {VFS} vfs
   */
  constructor(vfs) {
    if (!vfs) {
      throw new Error('require vfs param!')
    }
    this.vfs = vfs
  }

  /**
   * Execute Command
   * @param {Object} command - Command Object
   * @param {string} command.method - Command Method
   * @param {string[]} command.args - Command Args Array
   */
  execute(command) {
    try {
      return this.vfs[command.method].apply(this.vfs, command.args)
    } catch (err) {
      console.error(err)
    }
  }

}

export default FSCommand
