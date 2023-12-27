// 存储key值和id
const INFO_KEY = 'yx_shopping_info'
// 存储历史记录
const HISTORY_KEY = 'yx_history_list'
// 获取本地钥匙
export const getinfo = () => {
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : { userId: '', token: '' }
}
// 存储钥匙
export const setinfo = (info) => {
  localStorage.setItem(INFO_KEY, JSON.stringify(info))
}
// 退出，删除钥匙
export const removelnfo = () => {
  localStorage.removeItem(INFO_KEY)
}

// 本地历史存储

// 获取本地历史存储
export const getHistoryList = () => {
  const result = localStorage.getItem(HISTORY_KEY)
  return result ? JSON.parse(HISTORY_KEY) : []
}
// 导入本地存储

export const setHistoryList = (arr) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}
