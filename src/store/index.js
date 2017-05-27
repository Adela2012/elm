import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  userInfo: null, // 用户信息
  login: true, // 是否登录
  geohash: 'wtw3sm0q087', // 地址geohash值
  choosedAddress: null, // 选择地址
  addressIndex: null, // 选择地址的索引值
  latitude: '', // 当前位置纬度
  longitude: '' // 当前位置经度
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
