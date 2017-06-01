import fetch from '../config/fetch'
import * as home from './tempdata/home'
import * as login from './tempdata/login'
import * as city from './tempdata/city'
import * as msite from './tempdata/msite'
import * as food from './tempdata/food'

/**
 *创建临时数据
 */
const setpromise = data => {
  return new Promise((resolve, reject) => {
    resolve(data)
  })
}
var cityGuess, hotcity, groupcity, getUser, mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin, currentcity, searchplace, msiteAddress, msiteFoodTypes, shopList, foodCategory, foodDelivery, foodActivity
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

  mobileCode = phone => fetch('GET', 'v4/mobile/verify_code/send', {
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

  /**
   * 获取当前所在城市
   */

  currentcity = number => fetch('GET', '/v1/cities/' + number, {})

  /**
   * 获取搜索地址
   */

  searchplace = (cityid, value) => fetch('GET', '/v1/pois/', {
    type: 'search',
    city_id: cityid,
    keyword: value
  })

  /**
   * 获取msite页面地址信息
   */
  msiteAddress = geohash => fetch('GET', '/v2/pois/' + geohash, {})

  /**
   * 获取msite页面食品分类的列表
   */
  msiteFoodTypes = geohash => fetch('GET', 'v2/index_entry/', {
    geohash,
    group_type: '1',
    'flags[]': 'F'
  })

  /**
   * 获取msite商铺列表
   */
  shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
    let supportStr = ''
    support_ids.forEach(item => {
      if (item.status) {
        supportStr += '&support_ids[] = ' +item.id
      }
    })
    let data = {
      latitude,
      longitude,
      offset,
      limit: '20',
      'extras[]': 'activities',
      keyword: '',
      restaurant_category_id,
      'restaurant_category_ids[]': restaurant_category_ids,
      order_by,
      'delivery_mode[]': delivery_mode + supportStr
    }
    return fetch('GET', '/shopping/restaurants', data)
  }

  /**
   * 获取food页面的 category 种类列表
   */
  foodCategory = (latitude, longitude) => fetch('GET', '/shopping/v2/restaurant/category/', {
    latitude,
    longitude
  })

  /**
   * 获取food页面的配送方式
   */
  foodDelivery = (latitude, longitude) => fetch('GET', '/shopping/v1/restaurants/delivery_modes/', {
    latitude,
    longitude,
    kw: ''
  })

  /**
   * 获取food页面的商家属性活动列表
   */
  foodActivity = (latitude, longitude) => fetch('GET', '/shopping/v1/restaurants/activity_attributes/', {
    latitude,
    longitude,
    kw: ''
  })
} else {
  // home
  cityGuess = () => setpromise(home.guesscity)
  hotcity = () => setpromise(home.hotcity)
  groupcity = () => setpromise(home.groupcity)
  // login
  getUser = () => setpromise(login.userInfo)
  mobileCode = phone => setpromise(login.validateToken)
  accountLogin = (username, password, captchaCode) => setpromise(login.userInfo)
  checkExsis = (checkNumber, type) => setpromise(login.checkExsts)
  getcaptchas = () => setpromise(login.captchas)
  // city
  currentcity = () => setpromise(city.currentcity)
  searchplace = () => setpromise(city.searchdata)
  // msite
  msiteAddress = geohash => setpromise(msite.msiteAddress)
  msiteFoodTypes = geohash => setpromise(msite.foodTypes)
  shopList = (latitude, longitude, offset) => setpromise(msite.shopList)
  //food
  foodCategory = (latitude, longitude) => setpromise(food.category)
  foodDelivery = (latitude, longitude) => setpromise(food.delivery)
  foodActivity = (latitude, longitude) => setpromise(food.activity)
}

/**
 * 以下Api接口不需要进行反向代理
 */
sendLogin = (code, mobile, validataToken) => setpromise(login.userInfo)

export {cityGuess, hotcity, groupcity, getUser, mobileCode, checkExsis, sendLogin, getcaptchas, accountLogin, currentcity, searchplace, msiteAddress, msiteFoodTypes, shopList, foodCategory, foodDelivery, foodActivity}
