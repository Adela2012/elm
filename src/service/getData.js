import fetch from '../config/fetch'
import * as home from './tempdata/home'
import * as login from './tempdata/login'

/**
 *创建临时数据
 */
const setpromise = data => {
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}
var cityGuess, hotcity, groupcity, getUser
// 编译环境使用真实数据
if (process.env.NODE_ENV === 'development') {
  /**
   * 获取首页默认地址
   */

  cityGuess = () => fetch('GET', '/v1/cities', {
    type: 'guess'
  })

  /**
   * 获取首页热门城市
   */

  hotcity = () => fetch('GET', '/v1/cities', {
    type: 'hot'
  })

  /**
   * 获取首页所有城市
   */

  groupcity = () => fetch('GET', '/v1/cities', {
    type: 'group'
  })

  /**
   * 获取用户信息
   */

  getUser = () => fetch('GET', 'v1/user', {})
} else {
  cityGuess = () => setpromise(home.guesscity)
  hotcity = () => setpromise(home.hotcity)
  groupcity = () => setpromise(home.groupcity)
  getUser = () => setpromise(login.userInfo)
}

export {cityGuess, hotcity, groupcity, getUser}
