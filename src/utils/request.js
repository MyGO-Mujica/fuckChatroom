import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
const baseURL = 'http://172.16.0.211:8080'

const instance = axios.create({
  baseURL,
  timeout: 10000,
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    const useStore = useUserStore()
    if (useStore.token) {
      config.headers.Authorization = useStore.token
    }
    return config
  },
  (err) => Promise.reject(err),
)

instance.interceptors.response.use(
  (res) => {
    // 处理业务逻辑
    if (res.data.code === 1) {
      return res.data // 返回核心数据
    }
    // 处理业务失败
    ElMessage.error(res.data.msg || '服务器异常')
    return Promise.reject(new Error(res.data.msg || '服务器异常'))
  },
  (err) => {
    ElMessage.error(err.response?.data?.msg || '服务器异常')
    return Promise.reject(err)
  },
)

export default instance
