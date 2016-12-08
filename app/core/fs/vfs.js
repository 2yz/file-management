export default class FSInterface {
  constructor() {
    this._type = 'vfs'
  }

  createFile() {
    this._notImplementedError()
  }

  rmFile() {
    this._notImplementedError()
  }

  writeFile() {
    this._notImplementedError()
  }

  readFile() {
    this._notImplementedError()
  }

  createDir() {
    this._notImplementedError()
  }

  rmDir() {
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

  stat() {
    this._notImplementedError()
  }

  rename() {
    this._notImplementedError()
  }

  remove() {
    this._notImplementedError()
  }

  reloadDir() {
    this._notImplementedError()
  }

  isUndoAble(method) {
    return this[method + 'Undo'] !== undefined
  }

  _notImplementedError() {
    throw new Error('Not Implemented Error!')
  }


}
