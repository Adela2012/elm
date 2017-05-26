<template>
  <div>
    <head-top signin-up="msite">
      <router-link :to="'/search/' + geohash" class="link_search" slot="search">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <circle cx="9" cy="9" r="8" stroke="rgb(255,255,255)" stroke-width="2" fill="none"/>
          <line x1="15" y1="15" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
        </svg>
      </router-link>
      <router-link to="/home" slot="msite-title" class="msite_title">
        <span class="title_text ellipsis">{{msiteTitle}}</span>
      </router-link>
    </head-top>
    <nav class="msite_nav">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide food_types_container"></div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </nav>
  </div>
</template>

<script>
import headTop from '@/components/header/head'
import {msiteAddress, msiteFoodTypes} from '@/service/getData'
import {mapMutations} from 'vuex'
// import '@/plugins/swiper.min.js'
// import '@/style/swiper.min.css'
export default {
  data () {
    return {
      msiteTitle: '请选择地址...', // msiet页面头部标题
      foodTypes: [], // 食品分类列表
      geohash: '',
      hasGetData: false // 是否已经获取地理位置数据，成功后获取商铺列表信息
    }
  },
  async beforeMount () {
    this.geohash = this.$route.query.geohash || 'wtw3sm0q087'
    // 保存geohash到vuex
    this.SAVE_GEOHASH(this.geohash)
    // 获取位置信息
    let res = await msiteAddress(this.geohash)
    this.msiteTitle = res.name
    // 记录当前经度纬度
    this.RECORD_ADDRESS(res)
    this.hasGetData = true
  },
  mounted () {
    msiteFoodTypes(this.geohash).then(res => {
      let resLength = res.resLength
      let resArr = res.concat([]) // 返回一个新的数组
      let foodArr = []
      for (let i = 0, j = 0; i < resLength; i += 8, j++) {
        foodArr[j] = resArr.splice(0, 8)
      }
      this.foodTypes = foodArr
    }).then(() => {
      // new Swiper('.swiper-container', {
      //   pagination: '.swiper-pagination',
      //   loop: true
      // })
    })
  },
  methods: {
    ...mapMutations(['SAVE_GEOHASH', 'RECORD_ADDRESS'])
  },
  components: {
    headTop
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import 'src/style/mixin';
  .link_search{
    left: .8rem;
    @include wh(.8rem, .9rem);
    @include ct;
  }
  .msite_title{
    @include center;
        width: 50%;
        color: #fff;
        text-align: center;
        margin-left: -0.5rem;
        .title_text{
            @include sc(0.8rem, #fff);
            text-align: center;
            display: block;
        }
  }
  .msite_nav{
    padding-top: 2.1rem;
    background-color: #fff;
    border-bottom: 0.025rem solid $bc;
    .swiper-container{
      @include wh(100%, auto);
      padding-bottom: 0.6rem;
      .swiper-pagination{
        bottom: 0.2rem;
      }
    }
  }
  .food_types_container{
    display:flex;
    flex-wrap: wrap;
    .link_to_food{
      width: 25%;
      padding: 0.3rem 0rem;
      @include fj(center);
      figure{
        img{
          margin-bottom: 0.3rem;
          @include wh(1.8rem, 1.8rem);
        }
        figcaption{
          text-align: center;
          @include sc(0.55rem, #666);
        }
      }
    }
  }
  .shop_list_container{
    margin-top: .4rem;
    border-top: 0.025rem solid $bc;
    background-color: #fff;
    .shop_header{
      .shop_icon{
        fill: #999;
        margin-left: 0.6rem;
        vertical-align: middle;
        @include wh(0.6rem, 0.6rem);
      }
      .shop_header_title{
        color: #999;
        @include font(0.55rem, 1.6rem);
      }
    }
  }
</style>
