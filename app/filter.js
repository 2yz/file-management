import Vue from 'vue'
import FILE_TYPE from './core/const/file_type'

Vue.filter('resolve_file_type', function (value) {
  switch (value) {
    case FILE_TYPE.EXT2_FT_DIR:
      return '文件夹'
    case FILE_TYPE.EXT2_FT_REG_FILE:
      return '文件'
  }
  return '未知'
})

Vue.filter('date_filter', function (value) {
  var time = new Date(value)
  return `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}  ${time.getHours()}:${time.getMinutes()}`
})

export default {}
