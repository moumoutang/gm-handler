let fs = require('fs')
let ImagePath = process.cwd() + '/temp/'
/**
 * 
 * @param {*} arr 
 */
function deleteTempImage(arr) {
    arr.forEach(item => {
        fs.unlinkSync(ImagePath + item.path + '.png')
    })
}

module.exports = {deleteTempImage}

