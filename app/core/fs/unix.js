import fs from 'fs'
import FSInterface from './vfs'


export default class FSUnix extends FSInterface {
  constructor() {
    super()
    this._type = 'unix'
  }

  readDir(path) {
    return fs.readdirSync(path)
  }

}
