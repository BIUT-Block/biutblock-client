import {verify} from 'jsonwebtoken'

const key = 'MongoX-Block'

export default {
  install: function (Vue, options) {
    let jwt = {
      verifyToken: (token) => {
        let decoded
        try {
          decoded = verify(token, key)
        } catch (err) {
          decoded = 'InvalidToken'
        }
        return decoded
      }
    }
    Object.defineProperty(Vue.prototype, '$JWT', {value: jwt})
  }
}
