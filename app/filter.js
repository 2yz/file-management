import Vue from 'vue'
import format from 'date-format'
import FILE_TYPE from './core/const/file_type'

Vue.filter('resolve_file_type_old', function (value) {
  switch (value) {
    case FILE_TYPE.EXT2_FT_DIR:
      return '文件夹'
    case FILE_TYPE.EXT2_FT_REG_FILE:
      return '文件'
  }
  return '未知'
})

Vue.filter('date_filter', function (value) {
  if (!value) {
    return ''
  }
  var date = new Date(value)
  return format('yyyy-MM-dd hh:mm:ss', date)
})

export default {}
