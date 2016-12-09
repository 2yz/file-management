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
    this.undoStack = []
    this.redoStack = []
  }

  /**
   * Execute Command
   * @param {Object} command - Command Object
   * @param {string} command.method - Command Method
   * @param {Array} command.args - Command Args Array
   * @param {Function} command.callback - Command Callback
   */
  execute(command) {
    var args = command.args.concat(function (err) {
      if (!err) {
        if (this.isUndoAble(command.method)) {
          this.undoStack.push(command)
          if (this.redoStack.length > 0) {
            this.redoStack = []
          }
        } else if (this.vfs.isUndoAble(command.method)) {
          this.undoStack.push(command)
          if (this.redoStack.length > 0) {
            this.redoStack = []
          }
        }
      }
      if (command.callback) {
        command.callback.apply(command.callback, arguments)
      }
    }.bind(this))

    if (this[command.method] !== undefined) {
      this[command.method].apply(this, args)
    } else if (this.vfs[command.method] !== undefined) {
      this.vfs[command.method].apply(this.vfs, args)
    }
  }

  undo() {
    var self = this
    var command = this.undoStack.pop()
    var args = command.args.concat(function (err) {
      if (!err) {
        self.redoStack.push(command)
      }
      if (command.callback) {
        command.callback.apply(command.callback, arguments)
      }
    })

    var method = command.method + 'Undo'
    if (this[method] !== undefined) {
      this[method].apply(this, args)
    } else if (this.vfs[method] !== undefined) {
      this.vfs[method].apply(this.vfs, args)
    }
  }

  redo() {
    var command = this.redoStack.pop()
    var args = command.args.concat(function (err) {
      if (!err) {
        this.undoStack.push(command)
      }
      if (command.callback) {
        command.callback.apply(command.callback, arguments)
      }
    }.bind(this))

    var method = command.method
    if (this[method] !== undefined) {
      this[method].apply(this, args)
    } else if (this.vfs[method] !== undefined) {
      this.vfs[method].apply(this.vfs, args)
    }
  }

  isUndo() {
    return this.undoStack.length > 0
  }

  isRedo() {
    return this.redoStack.length > 0
  }

  isUndoAble(method) {
    return this[method + 'Undo'] !== undefined
  }

  cd(path, callback) {
    this.vfs.readDir(path, callback)
  }

  refresh(callback) {
    this.vfs.readDir(this.currentPath, callback)
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

  isBack() {
    return this.backStack.length > 0
  }

  isForward() {
    return this.forwardStack.length > 0
  }

  // readDir() {
  //
  // }

}

export default FSCommand
