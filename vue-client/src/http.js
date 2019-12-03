import axios from 'axios'
import router from './router/index'
import { Loading, Message } from 'element-ui'

let loading
// 开始加载动画
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '拼命加载中...',
    background: 'rbga(0,0,0,0.7)'
  })
}

// 结束加载动画
function endLoading() {
  loading.close()
}

// 请求拦截
axios.interceptors.request.use(
  config => {
  startLoading()
  if (localStorage.eleToken) {
    // 设置统一的请求header
    config.headers.Authorization = localStorage.eleToken
  }
  return config
  },
  error => Promise.reject(error))

// 响应拦截
axios.interceptors.response.use(
  response => {
    endLoading()
    return response
  },
  error => {
    // 错误提醒
    endLoading()
    Message.error(error.response.data)
    // 获取错误状态码
    const { status } = error.response
    if (status == 401) {
      Message.error('token失效，请重新登录！')
      // 清除token
      localStorage.removeItem('eleToken')
      // 跳
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default axios