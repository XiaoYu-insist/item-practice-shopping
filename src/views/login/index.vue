<template>
  <div class="login">
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />
    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" @click="getPicCode" :src="picUrl" alt="">
        </div>
        <div class="form-item">
          <input v-model="smsCode" class="inp" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">
            {{totalSecond === second? '获取验证码':second+'后重新获取'}}
          </button>
        </div>
      </div>

      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
import { getPicCode, getMsgCode, codeLogin } from '@/api/login'
export default {
  name: 'LoginPage',
  data () {
    return {
      picUrl: '', // 获取图片
      picKey: '', // 获取key
      totalSecond: 60, // 总秒数
      second: 60, // 倒计时的秒数
      timer: null, // 定时器 id
      mobile: '', // 手机号
      picCode: '', // 图形验证码
      smsCode: ''// 手机验证码
    }
  },
  created () {
    this.getPicCode()
  },
  methods: {
    // 获取图形验证码
    async getPicCode () {
      const { data: { base64, key } } = await getPicCode()
      // console.log(res)
      this.picUrl = base64
      this.picKey = key
    },
    // 校验输入框内容
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('验证码错误，重新输入')
        return false
      }
      return true
    },
    async getCode () {
      if (!this.validFn()) {
        return
      }
      if (!this.timer && this.second === this.totalSecond) {
        await getMsgCode(this.picCode, this.picKey, this.mobile)
        this.$toast('发送成功，注意查收')
        // 点击获取验证码，开始倒计时
        this.timer = setInterval(() => {
          this.second--
          if (this.second <= 0) {
            clearInterval(this.timer)
            this.second = this.totalSecond
            this.timer = null
          }
        }, 1000)
      }
    },
    // 验证码是否正确
    async login () {
      if (!this.validFn()) {
        return
      }
      if (!/^\d{6}$/.test(this.smsCode)) {
        this.$toast('请输入正确的验证码')
        return
      }
      const res = await codeLogin(this.smsCode, this.mobile)
      // 存入钥匙和id
      this.$store.commit('user/setUserInfo', res.data)
      // 提示和转跳
      this.$toast('登录成功')
      const url = this.$route.query.backUrl || '/'
      this.$router.replace(url)
    }
  },
  // 退出钩子
  destroyed () {
    // 退出销毁定时器
    clearInterval(this.timer)
  }
}

</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
