<template>
  <div class="shoplist_container">
    <ul v-if="shopListArr.length">
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
          <h5 class="rating_order_num">
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
          </h5>
          <h5 class="fee_distance">
            <section class="fee">
              ￥{{item.float_minimum_order_amount}}起送
              <span class="segmentation">/</span>
              {{item.piecewise_agent_fee.tips}}
            </section>
            <section class="distance_time">
              <span>
                {{item.distance > 1000 ? (item.distance/1000).toFixed(2) + 'km' : item.distance + 'm'}}
                <span class="segmentation">/</span>
              </span>
              <span class="order_time">{{item.order_lead_time}}分钟</span>
            </section>
          </h5>
        </hgroup>
      </router-link>
    </ul>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
  </div>
</template>

<script>
import {shopList} from '@/service/getData'
import {mapState} from 'vuex'
import {getImgPath} from './mixin.js'
import ratingStar from '@/components/common/ratingStar'
import loading from '@/components/common/loading'
export default {
  data () {
    return {
      shopListArr: [], // 店铺列表数据
      offset: 0,
      showLoading: true
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
    console.log('dd', this.latitude, this.longitude)
    this.initData()
  },
  mixins: [getImgPath],
  methods: {
    async initData () {
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCateGoryId)
      this.shopListArr = [...res]
      this.hideLoading()
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
    .back_top_svg{
      @include wh(2rem, 2rem);
    }
  }
  .loading-enter-active, .loading-leave-active {
    transition: opacity 1s
  }
  .loading-enter, .loading-leave-active {
    opacity: 0
  }
</style>
