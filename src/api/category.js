import request from '@/utils/request'
// 获取产品分类
export const getCategoryData = () => {
  return request.get('/category/list')
}
