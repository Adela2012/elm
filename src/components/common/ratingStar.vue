<template>
  <div class="rating_container">
    <section class="star_container">
      <svg class="grey_fill" v-for="num in 5" :key="num">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rating-star"></use>
      </svg>
    </section>
    <div :style="'width:' + rating*2/5 + 'rem'" class="star_overflow">
      <section class="star_container">
        <svg class="orange_fill" v-for="num in 5" :key="num">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#rating-star"></use>
        </svg>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: ['rating']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import '../../style/mixin';
  .rating_container{
        position: relative;
        @include wh(2rem, .4rem);
        left: calc(50% - 1rem);
        .star_overflow{
            overflow: hidden;
            position: relative;
            height: 100%;
        }
        .star_container{
            position: absolute;
            display: flex;
            width: 2rem;
            height: 0.4rem;
            .grey_fill{
                fill: #d1d1d1;
            }
            .orange_fill{
                fill: #ff9a0d;
            }
        }
    }
</style>
