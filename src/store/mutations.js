import {
  GET_USERINFO,
  RECORD_USERINFO,
  SAVE_GEOHASH,
  RECORD_ADDRESS
} from './mutation-types.js'

export default {
  [GET_USERINFO] (state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!info.message) {
      state.userInfo = {...info}
      let validity = 30
      let now = new Date()
      now.setTime(now.getTime() + validity * 24 * 60 * 60 * 1000)
      document.cookie = 'USERID = ' + info.user_id + '; expires = ' + now.toGMTString()
      document.cookie = 'SID = huRyTRd9QLij7NkbpHJoj3PQrx1eRiO6bAiw' + '; expires = ' + now.toGMTString()
    } else {
      state.userInfo = null
    }
  },
  // 记录用户信息
  [RECORD_USERINFO] (state, info) {
    state.userInfo = info
    state.login = true
    let validity = 30
    let now = new Date()
    now.setTime(now.getTime() + validity * 24 * 60 * 60 * 1000)
    document.cookie = 'USERID = ' + info.user_id + '; expires = ' + now.toGMTString()
    document.cookie = 'SID = huRyTRd9QLij7NkbpHJoj3PQrx1eRiO6bAiw' + '; expires = ' + now.toGMTString()
  },
  // 保存geohash
  [SAVE_GEOHASH] (state, geohash) {
    state.geohash = geohash
  },
  // 记录当前经度纬度
  [RECORD_ADDRESS] (state, {latitude, longitude}) {
    state.latitude = latitude
    state.longitude = longitude
  }
}
