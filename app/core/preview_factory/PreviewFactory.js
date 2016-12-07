import mime from 'mime'
import VDevice from '../core/vDevice'
import path from 'path'


 class FilePreview {
   preview() {
   }
 }

 class TextPre extends FilePreview {
//    text = new String()
   preview() {
   }
 }

 class ImagePre extends FilePreview {
//    image_src = ''

   preview() {

   }
 }

 class AudioPre extends FilePreview {
//    audio_src = ''
   preview() {
   }
 }

 class RegFilePre extends FilePreview {
   preview() {
   }
 }

 class FilePreviewFactory {
   get_preview(file_type) {
     switch (file_type) {
       case 'text':
         return new TextPre()
       case 'image':
         return new ImagePre()
       case 'audio':
         return new AudioPre()
       case 'regular':
         return new RegFilePre()
       default:
         throw new Error('not supported file type')
     }
   }
 }

 export default FilePreviewFactory

var a = {
  props: ['file_path'],
  ready: function () {
    this.mode = 'image'
  },
  data: function () {
    return {
      mode: 'image',
      file_name: '',
      temp: ''
    }
  },
  computed: {
    file_image_src: function () {
      console.log('file path: ' + this.file_path)
      var vd = VDevice.getCommandManager()
      if (!vd) {
        return
      } else {
        vd.execute({
          method: 'readFile',
          args: [this.file_path],
          callback: (err, data) => {
            if (err) return
            var arr = ['data:' + mime.lookup(this.file_path) + ';base64,']
            arr.push(data.toString('base64'))
            this.temp = arr.join('')
          }
        })
      }
      return this.temp
    },
    file_name: function () {
      return path.basename(this.file_path)
    }
  },
  methods: {
    close_file () {
      this.file_path = ''
      this.mode = ''
    }
  }
}