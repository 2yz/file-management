export default class FSInterface {
  constructor() {
    this._type = 'vfs'
  }

  /**
   * Excute Command
   * @param {Object} command - Command Object
   * @param {string} command.method - Command Method
   * @param {string[]} command.args - Command Args Array
   */
  execute(command) {

  }

  createFile() {
    this._notImplementedError()
  }

  readFile() {
    this._notImplementedError()
  }

  updateFile() {
    this._notImplementedError()
  }

  deleteFile() {
    this._notImplementedError()
  }

  renameFile() {
    this._notImplementedError()
  }

  readDir() {
    this._notImplementedError()
  }

  _notImplementedError() {
    throw new Error('Not Implemented Error!')
  }


}
