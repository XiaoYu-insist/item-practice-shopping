import { getinfo, setinfo } from '@/utils/storage'

export default {
  // 开启命名空间
  namespaced: true,
  state () {
    return {
      userIofn: getinfo()
    }
  },
  getters: {},
  // 存入钥匙和id
  mutations: {
    setUserInfo (state, obj) {
      state.userIofn = obj
      setinfo(obj)
    }
  },
  actions: {
    logout (context) {
      // 退出清空token
      context.commit('setUserInfo', {})
      // 清空订单和购物车
      context.commit('cart/setCartList', [], { root: true })
    }
  }
}
