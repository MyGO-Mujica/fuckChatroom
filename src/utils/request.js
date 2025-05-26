import axios from 'axios'
import { ElMessage } from 'element-plus'

// 基础 URL
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const instance = axios.create({
  baseURL,
  timeout: 10000,
})

// 请求拦截器（无需 token，直接返回 config）
instance.interceptors.request.use(
  (config) => {
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 处理业务逻辑
    if (res.data.code === '1') {
      return res.data // 返回核心数据
    }
    // 处理业务失败
    ElMessage.error(res.data.msg || '服务器异常')
    return Promise.reject(new Error(res.data.msg || '服务器异常'))
  },
  (err) => {
    // 默认错误处理
    ElMessage.error(err.response?.data?.msg || '服务器异常')
    return Promise.reject(err)
  }
)


export default instance

