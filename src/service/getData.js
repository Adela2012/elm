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
var cityGuess, hotcity, groupcity, getUser, mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin
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

  /**
   * 获取短信验证码
   */

  mobileCode = phone => fetch('POST', 'v4/mobile/verify_code/send', {
    captcha_code: '',
    mobile: phone,
    scene: 'login',
    type: 'sms'
  })

  getcaptchas = () => fetch('POST', 'v1/captchas', {})

  /**
   * 账号密码登录
   */

  accountLogin = (username, password, captchaCode) => fetch('POST', '/v2/login', {username, password, captchaCode})

  /**
   * 检测账户是否存在
   */

  checkExsis = (checkNumber, type) => fetch('GET', 'v1/users/exists', {
    [type]: checkNumber,
    type
  })
} else {
  cityGuess = () => setpromise(home.guesscity)
  hotcity = () => setpromise(home.hotcity)
  groupcity = () => setpromise(home.groupcity)
  getUser = () => setpromise(login.userInfo)
  mobileCode = phone => setpromise(login.validateToken)
  accountLogin = (username, password, captchaCode) => setpromise(login.userInfo)
  checkExsis = (checkNumber, type) => setpromise(login.checkExsts)
  getcaptchas = () => setpromise(login.captchas)
}

/**
 * 以下Api接口不需要进行反向代理
 */
sendLogin = (code, mobile, validataToken) => setpromise(login.userInfo)

export {cityGuess, hotcity, groupcity, getUser, mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin}
