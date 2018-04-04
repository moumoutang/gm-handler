/**
 * author: leeds
 * gm gettsFunction include:
 * size - returns the size (WxH) of the image
 * orientation - returns the EXIF orientation of the image
 * format - returns the image format (gif, jpeg, png, etc)
 * depth - returns the image color depth
 * color - returns the number of colors
 * res - returns the image resolution
 * filesize - returns image filesize
 * identify - returns all image data available. Takes an optional format string
 */
const GET_F = require('./const').GET_F
function getFun (img, method) {
  return new Promise((resolve, reject) => {
    if (GET_F.indexOf(method) < 0) {
      reject(errF.errorFormat(method + 'is not a gm get function'))
    }
    img[method]((err, value) => {
      if (value) {
        let _re = {}
        _re[method] = value
        resolve({
          status: 'succ',
          data: _re
        })
      } else {
        reject({
          status: 'fail',
          err: err
        })
      }
    })
  })
}
module.exports = {
  getFun: getFun
}
