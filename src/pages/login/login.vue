<template>
  <div class="loginContainer">
    <head-top :head-title="loginWay? '登录':'密码登录'" goBack="true">
      <div slot="changeLogin" class="change_login" @click="loginWay=!loginWay">{{loginWay? "密码登录":"短信登录"}}</div>
    </head-top>
    <form class="loginForm" v-if="loginWay">
      <section class="input_container phone_number">
        <input type="text" placeholder="手机号" name="phone" maxlength="11" v-model="phoneNumber">
        <button @click.prevent="getVerifyCode" v-show="!computedTime" :class="{right_phone_number:rightPhoneNumber}">获取验证码</button>
        <button v-show="computedTime">已发送({{computedTime}})s</button>
      </section>
      <section class="input_container">
        <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
      </section>
    </form>
    <form v-else class="loginForm">
      <section class="input_container">
        <input type="text" placeholder="手机号/邮箱/用户名" v-model="userAccount">
      </section>
      <section class="input_container">
        <input v-if="!showPassword" type="password" placeholder="密码" v-model="passWord">
        <input v-else type="text" placeholder="密码" v-model="passWord">
        <div class="button_switch" :class="{change_to_text: showPassword}" @click="showPassword = !showPassword">
          <div class="circel_button" :class="{trans_to_right: showPassword}"></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
    </form>
    <p class="login_tips">
      温馨提示：未注册饿了么账号的手机号，登录时将自动注册，且代表您已同意<a href="https://h5.ele.me/service/agreement/">《用户服务协议》</a>
    </p>
    <div class="login_container" @click="mobileLogin">登录</div>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
  import headTop from '../../components/header/head'
  import {mapMutations} from 'vuex'
  import {checkExsis, mobileCode, sendLogin, accountLogin} from '../../service/getData'
  import alertTip from '../../components/common/alertTip'
  export default {
    data () {
      return {
        loginWay: false, // 登录方式，默认短信登录
        phoneNumber: null, // 电话号码
        mobileCode: null, // 短信验证码
        validateToken: null, // 获取短信是返回的验证值，登录时需要
        computedTime: 0, // 倒数计时
        showAlert: false,
        alertText: null,
        userAccount: null,
        passWord: null,
        showPassword: false
      }
    },
    components: {
      headTop,
      alertTip
    },
    computed: {
      rightPhoneNumber: function () {
        return /^1\d{10}$/gi.test(this.phoneNumber)
      }
    },
    methods: {
      ...mapMutations(['RECORD_USERINFO']),
      // 获取短信验证码
      async getVerifyCode () {
        if (this.rightPhoneNumber) {
          this.computedTime = 30
          this.timer = setInterval(() => {
            this.computedTime --
            if (this.computedTime === 0) {
              clearInterval(this.timer)
            }
          }, 1000)
          // 判断用户是否存在
          let exsis = await checkExsis(this.phoneNumber, 'mobile')
          if (exsis.message) {
            console.log(exsis.message)
            return
          } else if (!exsis.is_exists) {
            console.log('您输入的手机号尚未绑定')
            return
          }
          // 发送短信验证码
          let res = await mobileCode(this.phoneNumber)
          if (res.message) {
            console.log(res.message)
            return
          }
          this.validateToken = res.validateToken
        }
      },
      // 发送登录信息
      async mobileLogin () {
        if (this.loginWay) {
          console.log('d')
          if (!this.rightPhoneNumber) {
            this.showAlert = true
            this.alertText = '手机号码不正确'
            return
          } else if (!this.mobileCode) {
            this.showAlert = true
            this.alertText = '请填写短信验证码'
            return
          } else if (!(/^\d{6}$/gi.test(this.mobileCode))) {
            this.showAlert = true
            this.alertText = '短信验证码不正确'
            return
          }
          this.userInfo = await sendLogin(this.mobileCode, this.phoneNumber, this.validateToken)
        } else {
          if (!this.userAccount) {
            this.showAlert = true
            this.alertText = '请输入手机号/邮箱/用户名'
            return
          } else if (!this.passWord) {
            this.showAlert = true
            this.alertText = '请输入密码'
            return
          }
          this.userInfo = await accountLogin(this.userAccount, this.passWord, '')
        }
        // 如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
        if (!this.userInfo.user_id) {
          this.showAlert = true
          this.alertText = this.userInfo.message
          if (!this.loginWay) this.getCaptchaCode()
        } else {
          this.RECORD_USERINFO(this.userInfo)
          this.$router.go(-1)
        }
      },
      closeTip () {
        this.showAlert = false
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
 @import '../../style/mixin';

    .loginContainer{
        padding-top: 1.95rem;
    }
    .change_login{
        position: absolute;
        @include ct;
        right: 0.75rem;
        @include sc(.7rem, #fff);
    }

    .loginForm{
        background-color: #fff;
        margin-top: .6rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
                @include sc(.7rem, #666);
            }
            button{
                @include sc(.65rem, #fff);
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
        }
        .phone_number{
            padding: .3rem .8rem;
        }
        .captcha_code_container{
            height: 2.2rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .2rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2rem;
                    justify-content: center;
                    p{
                        @include sc(.55rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2rem;
                    }
                }
            }
        }
    }
    .login_tips{
        @include sc(.5rem, #999);
        padding: .4rem .6rem;
        line-height: .7rem;
        a{
            color: #3b95e9;
        }
    }
    .login_container{
        margin: 0 .5rem 1rem;
        @include sc(.7rem, #fff);
        background-color: #4cd964;
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;

    }
    .button_switch{
        background-color: #ccc;
        display: flex;
        align-items: center;
        justify-content: space-between;
        @include wh(2rem, .7rem);
        padding: 0 .2rem;
        border: 1px;
        border-radius: 0.5rem;
        position: relative;
        transition: all .3s;
        .circel_button{
            transition: all .3s;
            position: absolute;
            z-index: 1;
            @include wh(0.8rem, 0.8rem);
            left: -.06rem;
            top: -.05rem;
            box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0,0,0,.1);
            background-color: #f1f1f1;
            border-radius: 50%;

        }
        .trans_to_right{
            transform: translateX(1.3rem);
        }
        span{
            @include sc(.45rem, #fff);
            transform: translateY(.05rem);
            line-height: .6rem;
        }
        span:nth-of-type(1){
            opacity:0;
        }
        span:nth-of-type(2){
            transform: translateY(-.16rem);
        }
    }
    .change_to_text{
        background-color: #3190e8;
        span:nth-of-type(1){
            opacity:1;
        }
        span:nth-of-type(2){
            opacity:0;
        }
    }
    .to_forget{
        float: right;
        @include sc(.6rem, #3b95e9);
        margin-right: .3rem;
    }
</style>
