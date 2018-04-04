var express = require('express')
var router = express.Router()
var routerMap = require('./dealMap')

router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.map = function(a, route) {
  route = route || ''
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        router.map(a[key], route + key)
        break
      // get: function(){ ... }
      case 'function':
        router[key](route, a[key])
        break
    }
  }
}
// router.map({
//   '/list': {
//     get: users.list,
//     delete: users.delete,
//     '/:uid': {
//       get: users.get,
//       '/pets': {
//         get: pets.list,
//         '/:pid': {
//           delete: pets.delete
//         }
//       }
//     }
//   }
// })
router.map({
  '/combineList': {
    post: routerMap.imageDeal.post
  },
  '/imageInfo/:imageUrl': {
    get: routerMap.imageInfo.get
  },
  '/imageInfo/:getter/:imageUrl': {
    get: routerMap.imageInfo.get
  }
})

module.exports = router
