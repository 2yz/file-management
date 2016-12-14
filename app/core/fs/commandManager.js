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
    this.currentPath = null
    this.backStack = []
    this.forwardStack = []
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
    this.vfs.readDir(path, function (err) {
      if (!err) {
        if (this.currentPath) {
          this.backStack.push(this.currentPath)
          if (this.forwardStack.length > 0) {
            this.forwardStack = []
          }
        }
        this.currentPath = path
      }
      if (callback) {
        callback.apply(callback, arguments)
      }
    }.bind(this))
  }

  back(callback) {
    if (this.backStack.length === 0) {
      callback(new Error('cannot back!'))
      return
    }
    var path = this.backStack.pop()
    this.vfs.readDir(path, function (err) {
      if (!err) {
        if (this.currentPath) {
          this.forwardStack.push(this.currentPath)
        }
        this.currentPath = path
      }
      if (callback) {
        callback.apply(callback, arguments)
      }
    }.bind(this))
  }

  forward(callback) {
    if (this.forwardStack.length === 0) {
      callback(new Error('cannot forward!'))
      return
    }
    var path = this.forwardStack.pop()
    this.vfs.readDir(path, function (err) {
      if (!err) {
        if (this.currentPath) {
          this.backStack.push(this.currentPath)
        }
        this.currentPath = path
      }
      if (callback) {
        callback.apply(callback, arguments)
      }
    }.bind(this))
  }

  isBack() {
    return this.backStack.length > 0
  }
  
  isForward() {
    return this.forwardStack.length > 0
  }

}

export default FSCommand
