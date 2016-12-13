import fs from 'fs'
import FSInterface from './vfs'


export default class FSUnix extends FSInterface {
  constructor() {
    super()
    this._type = 'unix'
  }

  readDir(path, callback) {
    fs.readdir(path, callback)
  }

  stat(path, callback) {
    fs.stat(path, (err, stats) => {
      if (err) {
        callback(err, null)
        return
      }
      var type = 'other'
      if (stats.isFile()) {
        type = 'file'
      } else if (stats.isDirectory) {
        type = 'directory'
      }
      callback(null, {
        type: type,
        size: stats.size,
        mtime: stats.mtime,
        ctime: stats.ctime,
        stats: stats
      })
    })
  }

}
