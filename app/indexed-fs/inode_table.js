export default class INodeTable {
  constructor (buf) {
    this.buf = buf
  }
  /* 0 File mode */
  get i_mode () {
    return this.buf.readInt16LE(0)
  }
  set i_mode (val) {
    this.buf.writeInt16LE(val, 0)
  }
}
