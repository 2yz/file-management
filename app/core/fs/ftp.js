import JSFtp from 'jsftp'
import path from 'path'
import FSInterface from './vfs'


export default class FSFtp extends FSInterface {
  constructor(options) {
    super()
    this._type = 'ftp'
    this._options = options
    this.ftp = new JSFtp({
      host: options.host,
      port: options.port, // defaults to 21
      user: options.user, // defaults to "anonymous"
      pass: options.pass // defaults to "@anonymous"
    })
    this.cache = {}
  }

  readDir(file, callback) {


  }

}
