import { getCartList, changeCount, delSelect } from '@/api/cart'
import Vue from 'vue'
import { Toast } from 'vant'
Vue.use(Toast)
export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList
    },
    // 接收过来的id参数修改
    toggleCheck (state, goodsId) {
      const goods = state.cartList.find((item) => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    // 全选按钮
    toggleAllCheck (state, flag) {
      state.cartList.forEach((item) => {
        item.isChecked = flag
      })
    },
    // 数量渲染
    changeCount (state, { goodsId, value }) {
      const obj = state.cartList.find((item) => item.goods_id === goodsId)
      obj.goods_num = value
    }
  },
  getters: {
    // 求所有商品累加总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter((item) => item.isChecked)
    },
    // 选中的总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的总价
    selPrice (state, getters) {
      return getters.selCartList
        .reduce(
          (sum, item) => sum + item.goods_num * item.goods.goods_price_min,
          0
        )
        .toFixed(2)
    },
    // 全选
    isAllChecked (state) {
      return state.cartList.every((item) => item.isChecked)
    }
  },
  actions: {
    async getCartAction (cxt) {
      const { data } = await getCartList()
      // 后台返回数据中，不包括复选框选中状态，为了实现将来的功能
      // 需要手动维护数据，给每一项，添加一个 isChecked状态（标记当前商品是否被选中）
      data.list.forEach((element) => {
        element.isChecked = true
      })
      cxt.commit('setCartList', data.list)
    },
    // 数量修改
    async changeCountAction (context, obj) {
      const { goodsId, value, skuId } = obj
      context.commit('changeCount', {
        goodsId,
        value
      })
      await changeCount(goodsId, value, skuId)
    },
    // 购物车商品删除功能
    async delSelect (cxt) {
      const selCartList = cxt.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      await delSelect(cartIds)
      Toast('删除成功')
      // console.log(11)
      cxt.dispatch('getCartAction')
    }
  }
}
