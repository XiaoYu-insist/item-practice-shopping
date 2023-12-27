import request from '@/utils/request'
// 获取图形验证码
export const getPicCode = () => {
  return request.get('/captcha/image', { platform: 'H5' })
}
// 获取短信验证码
export const getMsgCode = (captchaCode, captchaKey, mobile) => {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode,
      captchaKey,
      mobile
    }
  })
}
// 手机验证码登录
export const codeLogin = (smsCode, mobile) => {
  return request.post('/passport/login', {
    form: {
      smsCode,
      mobile,
      isParty: false,
      partyData: {}
    }
  })
}
