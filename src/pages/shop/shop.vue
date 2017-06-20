<template>
  <div>
    <div class="shop_container">
      <header class="shop_detail_header" :style="{zIndex: showActivities? '14':'10'}">
        <img :src="getImgPath(shopDetailData.image_path)" class="header_cover_img" alt="">
        <div class="description_header">
          <!--<nav class="shop-header-navBar_ibFIP_0">
          <router-link>
            <svg>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use>
            </svg>
          </router-link>
          </nav> -->
          <router-link to="/shop/shopDetail" class="description_top">
            <div class="description_left">
              <img :src="getImgPath(shopDetailData.image_path)" alt="">
            </div>
            <div class="description_right">
              <h4 class="description_title ellipsis">
                {{shopDetailData.name}}
              </h4>
              <p class="description_text">商家配送/{{shopDetailData.order_lead_time}}分钟送达/配送费￥{{shopDetailData.float_delivery_fee}}</p>
              <p class="description_promotion ellipsis">公告：{{promotionInfo}}</p>
            </div>
             <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
                <path d="M0 0 L8 7 L0 14"  stroke="#fff" stroke-width="1" fill="none"/>
            </svg>
          </router-link>
          <footer class="description_footer" v-if="shopDetailData.activities.length" @click="showActivities = true">
            <p class="ellipsis">
              <span class="tip_icon" :style="{backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}">{{shopDetailData.activities[0].icon_name}}</span>
              <span>{{shopDetailData.activities[0].description}}(APP专享)</span>
            </p>
            <p>{{shopDetailData.activities.length}}个活动</p>
          </footer>
        </div>
      </header>
      <transition name="fade">
        <div class="activities_details" v-if="showActivities">
          <div class="activities_content">
            <h2 class="activities_shoptitle">{{shopDetailData.name}}</h2>
            <h3 class="activities_ratingstar">
              <rating-star :rating="shopDetailData.rating"></rating-star>
            </h3>
            <div class="activities_list">
              <header class="activities_title_style"><span>优惠信息</span></header>
              <ul>
                <li v-for="item in shopDetailData.activities" :key="item.id">
                  <span class="activities_icon" :style="{backgroundColor: '#' +item.icon_color, borderColor: '#' + item.icon_color}">{{item.icon_name}}</span>
                  <span>{{item.description}}(APP专享)</span>
                </li>
              </ul>
            </div>
            <div class="activities_shopinfo">
              <header class="activities_title_style"><span>商家公告</span></header>
              <p>{{promotionInfo}}</p>
            </div>
          </div>
          <svg width="60" height="60" class="close_activities" @click.stop="showActivities = false">
              <circle cx="30" cy="30" r="25" stroke="#555" stroke-width="1" fill="none"/>
              <line x1="22" y1="38" x2="38" y2="22" style="stroke:#999;stroke-width:2"/>
              <line x1="22" y1="22" x2="38" y2="38" style="stroke:#999;stroke-width:2"/>
          </svg>
        </div>
      </transition>
      <div class="change_show_type">
        <div>
          <span :class="{activity_show: changeShowType == 'food'}" @click="changeShowType='food'">商品</span>
        </div>
        <div>
          <span :class="{activity_show: changeShowType == 'rating'}" @click="changeShowType='rating'">评价</span>
        </div>
      </div>
      <transition name="fade-choose">
        <div v-show="changeShowType == 'food'" class="food_container">
          <div class="menu_container">
            <div class="menu_left" id="wrapper_menu">
              <ul>
                <li v-for="(item,index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu: index == menuIndex}">
                  <img :src="getImgPath(item.icon_url)" v-if="item.icon_url" alt="">
                  <span>{{item.name}}</span>
                  <span class="category_num" v-if="categoryNum[index]&&item.type==1">{{categoryNum[index]}}</span>
                </li>
              </ul>
            </div>
            <div class="menu_right">
              <ul>
                <li v-for="(item, index) in menuList" :key="index">
                  <header class="menu_detail_header">
                    <div class="menu_detail_header_left">
                      <strong class="menu_item_title">{{item.name}}</strong>
                      <span class="menu_item_description">{{item.description}}</span>
                    </div>
                    <span class="menu_detail_header_right"></span>
                    <p class="description_tip" v-if="index == TitleDetailIndex">
                      <span>{{item.name}}</span>
                      {{item.description}}
                    </p>
                  </header>
                  <div v-for="(foods, foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                    <router-link :to="{path: 'shop/foodDetail',query:{image_path:foods.image_path,
                      description:foods.description,
                      month_sales:foods.month_sales,
                      name: foods.name,
                      rating:foods.rating,
                      rating_count:foods.rating_count,
                      satisfy_rate:foods.satisfy_rate,
                      foods,
                      shopId}}" tag="div" class="menu_detail_link">
                        <div class="menu_food_img">
                          <img :src="getImgPath(foods.image_path)" alt="">
                        </div>
                        <div class="menu_food_description">
                          <h3 class="food_description_head">
                            <strong class="description_foodname">{{foods.name}}</strong>
                            <ul v-if="foods.attributes.length" class="attributes_ul">
                              <li v-for="(attribute,foodindex) in foods.attributes" :key="foodindex" :style="{color: '#'+attribute.icon_color, borderColor: '#'+attribute.icon_color}" :class="{attribute_new: attribute.icon_name == '新'}">
                                <p :style="{color:attribute.icon_name == '新'?'#fff':'#'+attribute.icon_color}">{{attribute.icon_name == '新'?'新品':attribute.icon_name}}</p>
                              </li>
                            </ul>
                          </h3>
                          <p class="food_description_content">{{foods.description}}</p>
                          <p class="food_description_sale_rating">
                            <span>月售{{foods.month_sales}}份</span>
                            <span>好评率{{foods.satisfy_rate}}%</span>
                          </p>
                          <p v-if="foods.activity" class="food_activity">
                            <span :style="{color:'#'+foods.activity.image_text_color,borderColor:'#'+foods.activity.icon_color}">{{foods.activity.image_text}}</span>
                          </p>
                        </div>
                      </router-link>
                      <footer class="menu_detail_footer">
                        <div class="food_price">
                          <span>￥</span>
                          <span>{{foods.specfoods[0].price}}</span>
                          <span v-if="foods.specifications.length">起</span>
                        </div>
                      </footer>
                  </div>
                </li>
              </ul>
            </div>
         </div>
       </div>
      </transition> 
      <transition name="fade-choose">
        <div class="rating_container" id="ratingContainer" v-show="changeShowType == 'rating'">
          <div v-load-more="loaderMoreRating" type="2">
            <div>
              <header class="rating_header">
                <div class="rating_header_left">
                  <p>{{shopDetailData.rating}}</p>
                  <p>综合评价</p>
                  <p>高于周边商家{{(ratingScoresData.compare_rating*100).toFixed(1)}}%</p>
                </div>
                <div class="rating_header_right">
                  <p>
                    <span>服务态度</span>
                    <rating-star :rating="ratingScoresData.service_score"></rating-star>
                    <span class="rating_num">{{ratingScoresData.service_score.toFixed(1)}}</span>
                  </p>
                  <p>
                    <span>菜品评价</span>
                    <rating-star :rating="ratingScoresData.food_score"></rating-star>
                    <span class="rating_num">{{ratingScoresData.food_score.toFixed(1)}}</span>
                  </p>
                  <p>
                    <span>送达时间</span>
                    <span class="delivery_time">{{shopDetailData.order_lead_time}}分钟</span>
                  </p>
                </div>
              </header>
              <ul class="tag_list_ul">
                <li v-for="(item,index) in ratingTagsList" :key="index" :class="{unsatisfied: item.unsatisfied, tagActivity: ratingTagsIndex == index}" @click="changeTgeIndex(index, item.name)">{{item.name}}({{item.count}})</li>
              </ul>
              <ul class="rating_list_ul">
                <li v-for="(item, index) in ratingList" :key="index" class="rating_list_li">
                  <img :src="getImgPath(item.avatar)" class="ratign_list_li" alt="">
                  <section class="rating_list_details">
                    <header>
                      <div class="username_star">
                        <p class="username">{{item.username}}</p>
                        <p class="star_desc">
                          <rating-star :rating="item.rating_star"></rating-star>
                          <span class="item_spent_desc">{{item.time_spent_desc}}</span>
                        </p>
                      </div>
                      <time class="rated_at">
                        {{item.rated_at}}
                      </time>
                    </header>
                    <div class="rating_text">{{item.rating_text}}</div>
                    <div class="reply_text">{{item.reply_text}}</div>
                    <ul class="food_img_ul">
                      <li v-for="(item, index) in item.item_ratings" :key="index">
                        <img :src="getImgPath(item.image_hash)" v-if="item.image_hash" alt="">
                      </li>
                    </ul>
                    <ul class="food_name_ul">
                      <li v-for="(item,index) in item.item_ratings" :key="index" class="ellipsis">{{item.food_name}}</li>
                    </ul>
                  </section>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <loading v-show="showLoading || loadRatings"></loading>

  </div>
</template>

<script>
import {msiteAddress, shopDetails, foodMenu, getRatingList, ratingScores, ratingTags} from '@/service/getData'
import {getImgPath, loadMore} from '@/components/common/mixin'
import {mapState, mapMutations} from 'vuex'
import ratingStar from '@/components/common/ratingStar'
import loading from '@/components/common/loading'
export default {
  data () {
    return {
      geohash: '',
      shopId: null,
      showActivities: false,
      changeShowType: 'food',
      shopDetailData: null, // 商铺详情
      categoryNum: [],
      menuList: [], // 食品列表
      menuIndex: 0,
      menuIndexChange: true,
      TitleDetailIndex: null,
      ratingList: null, // 评价列表
      ratingTagsIndex: 0,
      ratingTagName: '',
      ratingScroll: null,
      loadRatings: false, // 加载更多评论是否显示加载组件
      showLoading: true,
      preventRepeatRequest: false, // 防止多次出发数据请求
      ratingScoresData: null, // 评价总体分数
      ratingTagsList: null, // 评价分类列表
      ratingOffset: 0 // 评价获取数据offset值
    }
  },
  created () {
    this.geohash = this.$route.query.geohash
    this.shopId = this.$route.query.id
  },
  mounted () {
    this.initData()
  },
  mixins: [getImgPath, loadMore],
  components: {
    ratingStar,
    loading
  },
  computed: {
    ...mapState([
      'latitude', 'longitude'
    ]),
    promotionInfo: function () {
      return this.shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'
    }
  },
  methods: {
    ...mapMutations([
      'RECORD_ADDRESS'
    ]),
    async initData () {
      if (!this.latitude) {
        let res = await msiteAddress(this.geohash)
        this.RECORD_ADDRESS(res)
      }
      // 获取商铺信息
      this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude)
      // 获取商铺食品列表
      this.menuList = await foodMenu(this.shopId)
      // 评论列表
      this.ratingList = await getRatingList(this.ratingOffset, this.shopId)
      // 商铺评论详情
      this.ratingScoresData = await ratingScores(this.shopId)
      // 评论Tag列表
      this.ratingTagsList = await ratingTags(this.shopId)
      // 加载隐藏动画
      this.hideLoading()
    },
    // 获取不同类型的评论列表
    async changeTgeIndex (index, name) {
      this.ratingTagsIndex = index
      this.ratingOffset = 0
      this.ratingTagName = name
      let res = await getRatingList(this.ratingOffset, name)
      this.ratingList = [...res]
      this.$nextTick(() => {
        this.ratingScroll.refresh()
      })
    },
    // 加载更多评论
    async loaderMoreRating () {
      if (this.preventRepeatRequest) {
        return
      }
      this.loadRatings = true
      this.preventRepeatRequest = true
      this.ratingOffset += 10
      let ratingDate = await getRatingList(this.ratingOffset, this.rating.TagName)
      this.ratingList = [...this.ratingList, ...ratingDate]
      this.loadRatings = false
      if (ratingDate.length >= 10) {
        this.preventRepeatRequest = false
      }
    },
    hideLoading () {
      if (process.env.NODE_ENV !== 'development') {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          clearTimeout(this.timer)
          this.showLoading = false
        }, 600)
      } else {
        this.showLoading = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import 'src/style/mixin';
  .rating_container{position:static;}
  @keyframes mymove{
     0%   { transform: scale(1) }
     25%  { transform: scale(.8) }
     50%  { transform: scale(1.1) }
     75%  { transform: scale(.9) }
     100% { transform: scale(1) }
  }
  @-moz-keyframes mymove{
     0%   { transform: scale(1) }
     25%  { transform: scale(.8) }
     50%  { transform: scale(1.1) }
     75%  { transform: scale(.9) }
     100% { transform: scale(1) }
  }
  @-webkit-keyframes mymove{
     0%   { transform: scale(1) }
     25%  { transform: scale(.8) }
     50%  { transform: scale(1.1) }
     75%  { transform: scale(.9) }
     100% { transform: scale(1) }
  }
  @-o-keyframes mymove{
     0%   { transform: scale(1) }
     25%  { transform: scale(.8) }
     50%  { transform: scale(1.1) }
     75%  { transform: scale(.9) }
     100% { transform: scale(1) }
  }
  .shop_container{
      display: flex;
      flex-direction: column;
      position: absolute;
      right: 0;
      left: 0;
      height: 100%;
  }
  
  .shop_detail_header{
      overflow: hidden;
      position: relative;
      .header_cover_img{
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 9;
          filter: blur(10px);
      }
      .shop-header-navBar_ibFIP_0 {
          position: relative;
          color:#fff;
            svg {
                width: 0.8rem;
                height: 0.8rem;
            }
      }
      .description_header{
          position: relative;
          z-index: 10;
          background-color: rgba(119,103,137,.43);
          padding: 0.4rem 0 0.2rem 0.4rem;
          width: 100%;
          overflow: hidden;
          .description_top{
              display: flex;
              .description_left{
                  margin-right: 0.3rem;
                  img{
                      @include wh(2.9rem, 2.9rem);
                      display: block;
                      border-radius: 0.15rem;
                  }
              }
              .description_right{
                  flex: 1;
                  .description_title{
                      @include sc(.75rem, #fff);
                      font-weight: bold;
                      width: 100%;
                      margin-bottom: 0.25rem;
                  }
                  .description_text{
                      @include sc(.45rem, #fff);
                      margin-bottom: 0.25rem;
                  }
                  .description_promotion{
                      @include sc(.45rem, #fff);
                      width: 11.5rem;
                  }
              }
              .description_arrow{
                  @include ct;
                  right: 0.3rem;
                  z-index: 11;
              }
          }
          .description_footer{
              @include fj;
              margin-top: 0.5rem;
              padding-right: 0.5rem;
              p{
                  @include sc(.5rem, #fff);
                  span{
                      color: #fff;
                  }
                  .tip_icon{
                      padding: 0 .04rem;
                      border: 0.025rem solid #fff;
                      border-radius: 0.1rem;
                      font-size: .4rem;
                      display: inline-block;
                  }
              }
              .ellipsis{
                  width: 84%;
              }
              // .footer_arrow{
              //     @include wh(.45rem, .45rem);
              //     position: absolute;
              //     right: .3rem;
              // }
          }
      }
  }
  .activities_details{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #262626;
      z-index: 200;
      padding: 1.25rem;
      .activities_content{
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        overflow-y:auto;
        overflow-x:hidden;
        border: 1.25rem solid transparent;
        border-top-width:1.8rem;
        border-bottom-width:4rem;
      }
      .activities_shoptitle{
          text-align: center;
          @include sc(.8rem, #fff);
      }
      .activities_ratingstar{
          display: flex;
          justify-content: center;
          transform: scale(2.2);
          margin-top: .7rem;
      }
      .activities_list{
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          @include sc(.5rem, #fff);
          li{
              margin-bottom: .2rem;
              .activities_icon{
                  // padding: 0 .02rem;
                  display: inline-block;
                  border: 0.025rem solid #fff;
                  border-radius: 0.1rem;
              }
              span{
                  color: #fff;
                  line-height: .6rem;
              }
          }
      }
      .activities_shopinfo{
          p{
              line-height: .7rem;
              @include sc(.5rem, #fff);
          }
      }
      .activities_title_style{
          text-align: center;
          margin-bottom: 1rem;
          span{
              @include sc(.5rem, #fff);
              border: 0.025rem solid #555;
              padding: .2rem .4rem;
              border-radius: 0.5rem;
          }

      }
      .close_activities{
          position: absolute;
          bottom: 1rem;
          @include cl;
      }
  }
          
  .food_container{
      display: flex;
      flex: 1;
      padding-bottom: 2rem;
  }
  .menu_container{
      display: flex;
      flex: 1;
      overflow-y: hidden;
      .menu_left{
          background-color: #f8f8f8;
          width: 3.8rem;
          .menu_left_li{
              padding: .7rem .25rem;
              border-bottom: 0.025rem solid #ededed;
              box-sizing: border-box;
              border-left: 0.15rem solid #f8f8f8;
              position: relative;
              line-height:.6rem;
              font-size:.6rem;
              img{
                  @include wh(.4rem, .6rem);
                  vertical-align:middle;
              }
              span{
                  @include sc(.6rem, #666);
              }
              .category_num{
                  position: absolute;
                  top: .1rem;
                  right: .1rem;
                  background-color: #ff461d;
                  line-height: .6rem;
                  text-align: center;
                  border-radius: 50%;
                  border: 0.025rem solid #ff461d;
                  min-width: .6rem;
                  height: .6rem;
                  @include sc(.5rem, #fff);
                  font-family: Helvetica Neue,Tahoma,Arial;
              }
          }
          .activity_menu{
              border-left: 0.15rem solid #3190e8;
              background-color: #fff;
              span:nth-of-type(1){
                  font-weight: bold;
              }
          }
      }
      .menu_right{
          flex: 4;
          overflow-y: auto;
          .menu_detail_header{
              width: 100%;
              padding: .2rem .4rem;
              position: relative;
              @include fj;
              align-items: center;
              line-height:.6rem;
              .menu_detail_header_left{
                  width: 11rem;
                  white-space: nowrap;
                  overflow: hidden;
                  .menu_item_title{
                      @include sc(.6rem, #666);
                      font-weight: bold;
                  }
                  .menu_item_description{
                      @include sc(.5rem, #999);
                      width: 30%;
                      overflow: hidden;
                  }
              }
              .menu_detail_header_right{
                  @include wh(.5rem, 1rem);
                  display: block;
                  @include bis('../../images/icon_point.png');
                  background-size: 100% .4rem;
                  background-position: left center;
              }
              .description_tip{
                  background-color: #39373a;
                  opacity: 0.95;
                  @include sc(.5rem, #fff);
                  position: absolute;
                  top: 1.5rem;
                  z-index: 14;
                  width: 8rem;
                  right: .2rem;
                  padding: .5rem .4rem;
                  border: 1px;
                  border-radius: .2rem;
                  span{
                      color: #fff;
                      line-height: .6rem;
                      font-size: .55rem;
                  }
              }
              .description_tip::after{
                  content: '';
                  position: absolute;
                  @include wh(.4rem, .4rem);
                  background-color: #39373a;
                  top: -.5rem;
                  right: .7rem;
                  transform: rotate(-45deg) translateY(.41rem);
              }
          }
          .menu_detail_list{
              background-color: #fff;
              padding: .6rem .4rem;
              border-bottom: 1px solid #f8f8f8;
              position: relative;
              overflow: hidden;            
              .menu_detail_link{
                  display:flex;
                  .menu_food_img{
                      margin-right: .4rem;
                      img{
                          @include wh(2rem, 2rem);
                          display: block;
                      }
                  }
                  .menu_food_description{
                      width: 100%;
                      .food_description_head{
                          @include fj;
                          margin-bottom: .2rem;
                          .description_foodname{
                              @include sc(.7rem, #333);
                          }
                          .attributes_ul{
                              display: flex;
                              li{
                                  font-size: .3rem;
                                  height: .6rem;
                                  line-height: .35rem;
                                  padding: .1rem;
                                  border: 1px solid #666;
                                  border-radius: 0.3rem;
                                  margin-right: .1rem;
                                  transform: scale(.8);
                                  p{
                                      white-space: nowrap;
                                      line-height: .4rem;
                                  }
                              }
                              .attribute_new{
                                  position: absolute;
                                  top: 0;
                                  left: 0;
                                  background-color: #4cd964;
                                  @include wh(2rem, 2rem);
                                  display: flex;
                                  align-items: flex-end;
                                  transform: rotate(-45deg) translate(-.1rem, -1.5rem);
                                  border: none;
                                  border-radius: 0;
                                  p{
                                      @include sc(.4rem, #fff);
                                      text-align: center;
                                      flex: 1;
                                  }
                              }
                          }
                      }
                      .food_description_content{
                          @include sc(.5rem, #999);
                          line-height: .6rem;
                      }
                      .food_description_sale_rating{
                          line-height: .8rem;
                          span{
                              @include sc(.5rem, #333);
                          }
                      }
                      .food_activity{
                          line-height: .4rem;
                          span{
                              font-size: .3rem;
                              border: 1px solid currentColor;
                              border-radius: 0.3rem;
                              padding: .08rem;
                              display: inline-block;
                              transform: scale(.8);
                              margin-left: -0.35rem;

                          }
                      }
                  }
              }
              .menu_detail_footer{
                  margin-left: 2.4rem;
                  font-size: 0;
                  margin-top: .3rem;
                  @include fj;
                  .food_price{
                      span{
                          font-family: 'Helvetica Neue',Tahoma,Arial;
                      }
                      span:nth-of-type(1){
                          @include sc(.5rem, #f60);
                          margin-right: .05rem;
                      }
                      span:nth-of-type(2){
                          @include sc(.7rem, #f60);
                          font-weight: bold;
                          margin-right: .3rem;
                      }
                      span:nth-of-type(3){
                          @include sc(.5rem, #666);
                      }
                  }
              }
          }
      }
  }
  .buy_cart_container{
      position: absolute;
      background-color: #3d3d3f;
      bottom: 0;
      left: 0;
      z-index: 13;
      display: flex;
      @include wh(100%, 2rem);
      .cart_icon_num{
          flex: 1;
          .cart_icon_container{
              display: flex;
              background-color: #3d3d3f;
              position: absolute;
              padding: .4rem;
              border: 0.18rem solid #444;
              border-radius: 50%;
              left: .5rem;
              top: -.7rem;
              .cart_icon{
                  @include wh(1.2rem, 1.2rem);
              }
              .cart_list_length{
                  position: absolute;
                  top: -.25rem;
                  right: -.25rem;
                  background-color: #ff461d;
                  line-height: .7rem;
                  text-align: center;
                  border-radius: 50%;
                  border: 0.025rem solid #ff461d;
                  min-width: .7rem;
                  height: .7rem;
                  @include sc(.5rem, #fff);
                  font-family: Helvetica Neue,Tahoma,Arial;
              }
          }
          .move_in_cart{
              animation: mymove .5s ease-in-out;
          }
          .cart_icon_activity{
               background-color: #3190e8;
          }
          .cart_num{
              @include ct;
              left: 3.5rem;

              div{
                  color: #fff;
              }
              div:nth-of-type(1){
                  font-size: .8rem;
                  font-weight: bold;
                  margin-bottom: .1rem;
              }
              div:nth-of-type(2){
                  font-size: .4rem;   
              }
          }
      }
      .gotopay{
          position: absolute;
          right: 0;
          background-color: #535356;
          @include wh(5rem, 100%);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          .gotopay_button_style{
              @include sc(.7rem, #fff);
              font-weight: bold;
          }
      }
      .gotopay_acitvity{
          background-color: #4cd964;
      }
  }
  .cart_food_list{
      position: fixed;
      width: 100%;
      padding-bottom: 2rem;
      z-index: 12;
      bottom: 0;
      left: 0;
      background-color: #fff;
      header{
          @include fj;
          align-items: center;
          padding: .3rem .6rem;
          background-color: #eceff1;
          svg{
              @include wh(.6rem,.6rem);
              vertical-align: middle;
          }
          h4{
              @include sc(.7rem, #666);
          }
          .clear_cart{
              @include sc(.6rem, #666);
          }
      }
      .cart_food_details{
          background-color: #fff;
          max-height: 20rem;
          overflow-y: auto;
          .cart_food_li{
              @include fj;
              padding: .6rem .5rem;
              .cart_list_num{
                  width: 55%;
                  p:nth-of-type(1){
                      @include sc(.7rem, #666);
                      font-weight: bold;
                  }
                  p:nth-of-type(2){
                      @include sc(.4rem, #666);
                  }
              }
              .cart_list_price{
                  font-size: 0;
                  span:nth-of-type(1){
                      @include sc(.6rem, #f60);
                      font-family: Helvetica Neue,Tahoma;

                  }
                  span:nth-of-type(2){
                      @include sc(.7rem, #f60);
                      font-family: Helvetica Neue,Tahoma;
                      font-weight: bold;
                  }
              }
              .cart_list_control{
                  display: flex;
                  align-items: center;
                  span{
                      display: flex;
                      align-items: center;
                      justify-content: center;
                  }
                  svg{
                      @include wh(.9rem, .9rem);
                      fill: #3190e8;
                  }
                  .specs_reduce_icon{
                      fill: #999;
                  }
                  .cart_num{
                      @include sc(.65rem, #666);
                      min-width: 1rem;
                      text-align: center;
                      font-family: Helvetica Neue,Tahoma;
                  }
              }
          }
      }
  }
  .screen_cover{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0,0,0,.3);
      z-index: 11;
  }
  .change_show_type{
      display: flex;
      background-color: #fff;
      padding: .1rem 0 .5rem;
      border-bottom: 1px solid #ebebeb;
      div{
          flex: 1;
          text-align: center;
          span{
              @include sc(.65rem, #666);
              padding: .2rem .1rem;
              border-bottom: 0.12rem solid #fff;
          }
          .activity_show{
              color: #3190e8;
              border-color: #3190e8;
          }
      }
  }
  .rating_container{
      flex: 1;
      overflow-y: hidden;
      flex-direction: column;
      // p, span, li, time{
          // font-family: Helvetica Neue,Tahoma,Arial;
      // }
      .rating_header{
          display: flex;
          background-color: #fff;
          padding: .8rem .5rem;
          margin-bottom: 0.5rem;
          .rating_header_left{
              flex: 2.5;
              text-align: center;
              padding-right: .5rem;
              border-right: 1px solid #eee;
              p:nth-of-type(1){
                  @include sc(1.2rem, #f60);
              }
              p:nth-of-type(2){
                  @include sc(.65rem, #666);
                  margin-bottom: .1rem;
              }
              p:nth-of-type(3){
                  @include sc(.4rem, #999);
              }
          }
          .rating_header_right{
              flex: 4;
              p{
                  font-size: .65rem;
                  line-height: 1rem;
                  display: flex;
                  align-items: center;
                  justify-content: flex-start;
                  padding-left:.8rem;
                  span:nth-of-type(1){
                      color: #666;
                      margin-right: .6rem;
                  }
                  .rating_num{
                      width: 2rem;
                      @include sc(.55rem, #f60);
                  }
                  .delivery_time{
                      @include sc(.4rem, #999);
                  }
              }
          }
      }
      .tag_list_ul{
          display: flex;
          flex-wrap: wrap;
          background-color: #fff;
          padding: .5rem;
          li{
              @include sc(.6rem, #6d7885);
              padding: .3rem .3rem;
              background-color: #ebf5ff;
              border-radius: 0.2rem;
              border: 1px;
              margin: 0 .4rem .2rem 0;
          }
          .unsatisfied{
              background-color: #f5f5f5;
              color: #aaa;
          }
          .tagActivity{
              background-color: #3190e8;
              color: #fff;
          }
      }
      .rating_list_ul{
          background-color: #fff;
          padding: 0 .5rem;
          .rating_list_li{
              border-top: 1px solid #f1f1f1;
              display: flex;
              padding: .6rem 0;
              .user_avatar{
                  @include wh(1.5rem, 1.5rem);
                  border: 0.025rem;
                  border-radius: 50%;
                  margin-right: .8rem;
              }
              .rating_list_details{
                  flex: 1;
                  header{
                      display: flex;
                      flex: 1;
                      justify-content: space-between;
                      margin-bottom: .3rem;
                      .username_star{
                          @include sc(.55rem, #666);
                          .username{
                              color: #666;
                              margin-bottom: .2rem;
                          }
                          .star_desc{
                              display: flex;
                              align-items: center;
                              .time_spent_desc{
                                  @include sc(.55rem, #666)
                                  margin-left: .15rem;
                              }
                          }
                      }
                      .rated_at{
                          @include sc(.4rem, #999);
                      }
                  }
                  .rating_text{
                    @include sc(0.6rem,#333);
                    margin-bottom:0.4rem;
                  }
                  .reply_text{
                    position:relative;
                    margin: .266667rem 0;
                    padding: .266667rem;
                    background: #f3f3f3;
                    border-radius: .12rem;
                    @include sc(0.6rem,#333);
                    &:after{
                      content: " ";
                      position: absolute;
                      bottom: 100%;
                      left: .6rem;
                      width: 0;
                      height: 0;
                      border-style: solid;
                      border-width: 0 .3rem .3rem;
                      border-color: transparent transparent #f3f3f3;
                      background-color: white;
                    }
                  }
                  .food_img_ul{
                      display: flex;
                      flex-wrap: wrap;
                      margin-bottom: .4rem;
                      li{
                          img{
                              @include wh(3rem, 3rem);
                              margin-right: .4rem;
                              display: block;
                          }
                      }
                  }
                  .food_name_ul{
                      display: flex;
                      flex-wrap: wrap;
                      li{
                          @include sc(.55rem, #999);
                          width: 2.2rem;
                          padding: .2rem;
                          border: 0.025rem solid #ebebeb;
                          border-radius: 0.15rem;
                          margin-right: .3rem;
                          margin-bottom: 4px;
                      }
                  }
              }
          }
      }
  }
  .specs_cover{
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.4);
      z-index: 17;
  }
  .specs_list{
      position: fixed;
      top: 35%;
      left: 15%;
      width: 70%;
      background-color: #fff;
      z-index: 18;
      border: 1px;
      border-radius: 0.2rem;
      .specs_list_header{
          h4{
              @include sc(.7rem, #222);
              font-weight: normal;
              text-align: center;
              padding: .5rem;
          }
          .specs_cancel{
              position: absolute;
              right: .5rem;
              top: .5rem;
          }
      }
      .specs_details{
          padding: .5rem;
          .specs_details_title{
              @include sc(.6rem, #666);
          }
          ul{
              display: flex;
              flex-wrap: wrap;
              padding: .4rem 0;
              li{
                  font-size: .6rem;
                  padding: .3rem .5rem;
                  border: 0.025rem solid #ddd;
                  border-radius: .2rem;
                  margin-right: .5rem;
              }
              .specs_activity{
                  border-color: #3199e8;
                  color: #3199e8;
              }
          }
      }
      .specs_footer{
          @include fj;
          align-items: center;
          background-color: #f9f9f9;
          padding: 0.5rem;
          border: 1px;
          border-bottom-left-radius: .2rem;
          border-bottom-right-radius: .2rem;
          .specs_price{
              span{
                  color: #ff6000;
              }
              span:nth-of-type(1){
                  font-size: .5rem;
              }
              span:nth-of-type(2){
                  font-size: .8rem;
                  font-weight: bold;
                  font-family: Helvetica Neue,Tahoma;
              }
          }
          .specs_addto_cart{
              @include wh(4rem, 1.3rem);
              background-color: #3199e8;
              border: 1px;
              border-radius: 0.15rem;
              @include sc(.6rem, #fff);
              text-align: center;
              line-height: 1.3rem;
          }
      }
  }
  .show_delete_tip{
      position: fixed;
      top: 50%;
      left: 15%;
      width: 70%;
      transform: translateY(-50%);
      background-color: rgba(0,0,0,.8);
      z-index: 18;
      @include sc(.65rem, #fff);
      text-align: center;
      padding: .5rem 0;
      border: 1px;
      border-radius: 0.25rem;
  }
  .move_dot{
      position: fixed;
      bottom: 30px;
      left: 30px;
  
      svg{
          @include wh(.9rem, .9rem);
          fill: #3190e8;
      }
  }
  .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
  }
  .fade-enter, .fade-leave-active {
      opacity: 0;
  }
  .fade-choose-enter-active, .fade-choose-leave-active {
      transition: opacity .5s;
  }
  .fade-choose-leave, .fade-choose-leave-active {
      display: none;
  }
  .fade-choose-enter, .fade-choose-leave-active {
      opacity: 0;
  }
  .router-slid-enter-active, .router-slid-leave-active {
      transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
      transform: translate3d(2rem, 0, 0);
      opacity: 0;
  }
  .toggle-cart-enter-active, .toggle-cart-leave-active {
      transition: all .3s ease-out;
  }
  .toggle-cart-enter, .toggle-cart-leave-active {
      transform: translateY(100%);
  }

</style>
