<template>
  <div class="shoplist_container">
    <ul v-if="shopListArr.length" v-load-more="loaderMore" type="1">
      <router-link v-for="item in shopListArr" tag="li" :key="item.id" class="shop_li" :to="{path: 'shop', query: {geohash, id: item.id}}">
        <section>
          <img :src="getImgPath(item.image_path)" class="shop_img" alt="">
        </section>
        <hgroup class="shop_right">
          <header class="shop_detail_header">
            <h4 :class="item.is_premium? 'premium':''"  class="shop_title ellipsis">{{item.name}}</h4>
            <ul class="shop_detail_ul">
              <li v-for="item in item.supports" :key="item.id" class="supports">{{item.icon_name}}</li>
            </ul>
          </header>
          <section class="rating_order_num">
            <section class="rating_order_num_left">
              <div class="rating_section">
                <rating-star :rating="item.rating"></rating-star>
                <span class="rating_num">{{item.rating}}</span>
              </div>
              <div class="order_section">
                月售{{item.recent_order_num}}单
              </div>
            </section>
            <section class="rating_order_num_right" v-if="item.delivery_mode">
              <span class="delivery_style delivery_right">准时达</span>
              <span class="delivery_style delivery_left">{{item.delivery_mode.text}}</span>
            </section>
          </section>
          <section class="fee_distance">
            <section class="fee">
              ￥{{item.float_minimum_order_amount}}起送
              <span class="segmentation">/</span>
              {{item.piecewise_agent_fee.tips}}
              <span class="segmentation">/</span>
              {{item.average_cost}}
            </section>
            <section class="distance_time">
              <span>
                {{item.distance > 1000 ? (item.distance/1000).toFixed(2) + 'km' : item.distance + 'm'}}
                <span class="segmentation">/</span>
              </span>
              <span class="order_time">{{item.order_lead_time}}分钟</span>
            </section>
          </section>
        </hgroup>
      </router-link>
    </ul>
    <p v-else class="empty_data">没有更多了</p>
    <aside class="return_top" @click="backTop" v-if="showBackStatus">
      <svg class="back_top_svg">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#back-top.7a234e5"></use>
      </svg>
    </aside>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
  </div>
</template>

<script>
import {shopList} from '@/service/getData'
import {mapState} from 'vuex'
import {getImgPath, loadMore} from './mixin.js'
import {showBack, animate} from '@/config/mUtils'
import ratingStar from '@/components/common/ratingStar'
import loading from '@/components/common/loading'
export default {
  data () {
    return {
      shopListArr: [], // 店铺列表数据
      offset: 0,  // 批次加载店铺列表，每次加载20个 limit = 20
      preventRepeatReuqest: false, // 到达底部加载数据，防止重复加载
      showBackStatus: false, // 显示返回顶部按钮
      showLoading: true // 显示加载动画
    }
  },
  components: {
    ratingStar,
    loading
  },
  props: ['geohash', 'restaurantCateGoryId'],
  computed: {
    ...mapState(['latitude', 'longitude'])
  },
  mounted () {
    this.initData()
  },
  mixins: [getImgPath, loadMore],
  methods: {
    async initData () {
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCateGoryId)
      this.shopListArr = [...res]
      this.hideLoading()
      // 开始监听 scrollTop的值，达到一定程度后显示返回顶部按钮
      showBack(status => {
        this.showBackStatus = status
      })
    },
    hideLoading () {
      if (process.env.NODE_ENV !== 'development') {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          clearTimeout(this.timer)
          this.showLoading = false
        }, 500)
      } else {
        this.showLoading = false
      }
    },
    async loaderMore () {
      // 防止重复请求
      if (this.preventRepeatReuqest) {
        return
      }
      this.showLoading = true
      this.preventRepeatReuqest = true
      // 数据的定位加20位
      this.offset += 20
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCateGoryId)
      this.hideLoading()
      this.shopListArr = [...this.shopListArr, ...res]
      // 当获取数据小于20，说明没有更多数据，不需要再次请求数据
      if (res.length < 20) {
        return
      }
      this.preventRepeatReuqest = false
    },
    backTop () {
      animate(document.body, {scrollTop: '0'}, 400, 'ease-out')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import 'src/style/mixin';
  .shoplist_container{
    background-color: #fff;
    padding-bottom: 2rem;
  }
  .shop_li{
    display: flex;
    border-bottom: 0.025rem solid #f1f1f1;
    padding: 0.7rem 0.4rem;
  }
  .shop_img{
    @include wh(2.7rem, 2.7rem);
    display: block;
    margin-right: 0.4rem;
  }
  .shop_right{
    flex: auto;
    .shop_detail_header{
      @include fj;
      align-items: center;
      .shop_title{
        width: 8.5rem;
        color: #333;
        padding-top: .01rem;
        @include font(0.65rem, 0.65rem, 'PingFangSC-Regular');
        font-weight: 700;
      }
      .premium::before{
        content: '品牌';
        display: inline-block;
        font-size: 0.5rem;
        line-height: .6rem;
        background-color: #ffd930;
        padding: 0 0.1rem;
        border-radius: 0.1rem;
        margin-right: 0.2rem;
        vertical-align: top;
      }
      .shop_detail_ul{
        display: flex;
        .supports{
          @include sc(0.5rem, #999);
          border: 0.025rem solid #f1f1f1;
          padding: 0.04rem;
          border-radius: 0.08rem;
          margin-left: 0.05rem;
        }
      }
    }
    .rating_order_num{
      @include fj(space-between);
      height: 0.6rem;
      margin-top: 0.52rem;
      .rating_order_num_left{
        @include fj(flex-start);
        .rating_section{
          display: flex;
          .rating_container{
            margin-top:0.15rem;
          }
          .rating_num{
            @include sc(0.4rem, #ff6000);
            margin: 0 0.2rem;
          }
        }
        .order_section{
            @include sc(0.4rem, #666);
        }
      }
      .rating_order_num_right{
        display: flex;
        align-items: center;
        .delivery_style{
          font-size: 0.4rem;
          padding: 0.04rem 0.08rem 0;
          border-radius: 0.08rem;
          margin-left: 0.08rem;
          border: 1px;
        }
        .delivery_left{
          color: #fff;
          background-color: $blue;
          border: 0.025rem solid $blue;
        }
        .delivery_right{
          color: $blue;
          border: 0.025rem solid $blue;
        }
      }
    }
    .fee_distance{
      margin-top: 0.52rem;
      @include fj;
      @include sc(0.5rem, #666);
      .fee{
        @include sc(0.5rem, #666);
      }
      .distance_time{
        span{
          color: #999;
        }
        .order_time{
          color: $blue;
        }
        .segmentation{
          color: #ccc;
        }
      }
    }
  }
  .loader_more{
    @include font(0.6rem, 3);
    text-align: center;
      color: #999;
  }
  .empty_data{
    @include sc(0.5rem, #666);
    text-align: center;
    line-height: 2rem;
  }
  .return_top{
    position: fixed;
    bottom: 3rem;
    right: 1rem;
    background:#fff;
    border: .02rem solid #999;
    border-radius: 50%;
    display:flex;
    align-items: center;
    justify-content: center;
    @include wh(2rem, 2rem);
    .back_top_svg{
      @include wh(1rem, 1rem);
      fill: #999;
    }
  }
  .loading-enter-active, .loading-leave-active {
    transition: opacity 1s
  }
  .loading-enter, .loading-leave-active {
    opacity: 0
  }
</style>
