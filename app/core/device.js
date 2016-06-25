import fs from 'fs'
import path from 'path'
const {app} = require('electron').remote
var userData = app.getPath('userData')

export default class Device {
  constructor (name, super_block, inode_table, data_bitmap_buffer, data_block_buffer) {
    this.name = name
    this.size = data_block_buffer.length
    this.super_block = super_block
    this.inode_table = inode_table
    this.data_bitmap_buffer = data_bitmap_buffer
    this.data_block_buffer = data_block_buffer
  }
  write () {
    try {
      fs.accessSync(path.join(userData, this.name))
    } catch (e) {
      fs.mkdirSync(path.join(userData, this.name))
    }
    try {
      fs.writeFileSync(path.join(userData, this.name, 'super_block'), JSON.stringify(this.super_block))
      fs.writeFileSync(path.join(userData, this.name, 'inode_table'), JSON.stringify(this.inode_table))
      fs.writeFileSync(path.join(userData, this.name, 'data_bitmap_buffer'), this.data_bitmap_buffer)
      fs.writeFileSync(path.join(userData, this.name, 'data_block_buffer'), this.data_block_buffer)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
  static read (name) {
    fs.accessSync(name)
    var super_block = JSON.parse(fs.readFileSync(path.join(userData, name, 'super_block')).toString())
    var inode_table = JSON.parse(fs.readFileSync(path.join(userData, name, 'inode_table')).toString())
    var data_bitmap_buffer = fs.readFileSync(path.join(userData, name, 'data_bitmap_buffer'))
    var data_block_buffer = fs.readFileSync(path.join(userData, name, 'data_block_buffer'))
    return new Device(name, super_block, inode_table, data_bitmap_buffer, data_block_buffer)
  }
  static create (name) {
    var data_size = 128 * 1024 * 1024 // bytes
    var data_block_buffer = Buffer.alloc(data_size)
    return new Device(name, null, null, null, data_block_buffer)
  }
}
