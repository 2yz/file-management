export default class FSInterface {
  constructor() {
    this._type = 'vfs'
  }

  /**
   * Excute Command
   * @param {Object} employee - The employee who is responsible for the project.
   * @param {string} employee.name - The name of the employee.
   * @param {string} employee.department - The employee's department.
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
