import fs from 'fs'
import path from 'path'
import FSInterface from './vfs'

export default class FSUnix extends FSInterface {
  constructor() {
    super()
    this._type = 'unix'
  }
  
  createFile(file, callback) {
    this.writeFile(file, '', callback)
  }

  createFileUndo(file, callback) {
    this.rmFile(file, callback)
  }
  
  rmFile(file, callback) {
    fs.unlink(file, callback)
  }

  writeFile(path, data, callback) {
    fs.writeFile(path, data, callback)
  }

  readFile(path, callback) {
    fs.readFile(path, callback)
  }

  createDir(file, callback) {
    fs.mkdir(file, callback)
  }

  createDirUndo(file, callback) {
    this.rmDir(file, callback)
  }
  
  rmDir(file, callback) {
    fs.rmdir(file, callback)
  }

  readDir(file, callback) {
    fs.readdir(file, (err, files) => {
      if (!err && files) {
        files = files.map(item => path.join(file, item))
      }
      callback(err, files, file)
    })
  }

  stat(path, callback) {
    fs.stat(path, (err, stats) => {
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

  remove(path, callback) {
    fs.stat(path, (err, stats) => {
      if (err) {
        callback(err, null)
        return
      }
      if (stats.isFile()) {
        fs.unlink(path, callback)
      } else if (stats.isDirectory()) {
        fs.rmdir(path, callback)
      }
    })
  }

  reloadDir(path, callback) {
    this.readDir(path, callback)
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
