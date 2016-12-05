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
    this.back = []
    this.forward = []
  }

  /**
   * Execute Command
   * @param {Object} command - Command Object
   * @param {string} command.method - Command Method
   * @param {Array} command.args - Command Args Array
   * @param {Function} command.callback - Command Callback
   */
  execute(command) {
    var callback = function (err) {
      if (!err) {
        // TODO undo
      }
      if (command.callback) {
        command.callback.apply(command.callback, arguments)
      }
    }

    var args = command.args.concat(callback)

    var func = this[command.method]
    if (func !== undefined) {
      func.apply(this, args)
    } else {
      this.vfs[command.method].apply(this.vfs, args)
    }
  }

  cd(path, callback) {
    this.vfs.readDir(path, callback)
  }

  back() {

  }

  forward() {

  }

  // readDir() {
  //
  // }

}

export default FSCommand
