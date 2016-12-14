import fs from 'fs'
import path from 'path'
import FSInterface from './vfs'


export default class FSUnix extends FSInterface {
  constructor() {
    super()
    this._type = 'unix'
  }

  writeFile(file, data, callback) {
    fs.writeFile(file, data, callback)
  }

  readFile(file, callback) {
    fs.readFile(file, callback)
  }

  readDir(file, callback) {
    fs.readdir(file, (err, files) => {
      if (!err && files) {
        files = files.map(item => path.join(file, item))
      }
      callback(err, files, file)
    })
  }

  stat(file, callback) {
    fs.stat(file, (err, stats) => {
      if (err) {
        callback(err, null)
        return
      }
      stats.isDirectory()
      callback(null, {
        type: this._resolveFileType(stats.mode),
        size: stats.size,
        mtime: stats.mtime,
        ctime: stats.ctime,
        stats: stats
      })
    })
  }

  rename(oldPath, newPath, callback) {
    fs.rename(oldPath, newPath, callback)
  }
  
  renameUndo(oldPath, newPath, callback) {
    fs.rename(newPath, oldPath, callback)
  }

  remove(file, callback) {
    fs.stat(file, (err, stats) => {
      if (err) {
        callback(err, null)
        return
      }
      if (stats.isFile()) {
        fs.unlink(file, callback)
      } else if (stats.isDirectory()) {
        fs.rmdir(file, callback)
      }
    })
  }

  reloadDir(file, callback) {
    this.readDir(file, callback)
  }

  _resolveFileType(mode) {
    // TODO implement all file type
    switch (mode & fs.constants.S_IFMT) {
      case fs.constants.S_IFREG:
        return '文件'
      case fs.constants.S_IFDIR:
        return '文件夹'
    }
    return '其他'
  }

}
