function errFormat (err, code) {
  let errO = {
    succ: false
  }
  let type = Object.prototype.toString.call(err)
  if (type === '[object String]') {
    errO['msg'] = err
  } else {
    errO['err'] = err
  }
  if (code) {
    errO['code'] = code
  }
  return errO
}
function succFormat (data, ex) {
  let suc = {
    succ: true,
    data: data
  }
  if (ex && Object.prototype.toString.call(ex) === '[Object String]') {
    Object.assign(suc, ex)
  }
  return suc
}
module.exports = {errFormat, succFormat}
