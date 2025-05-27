import axios from 'axios'
import { ElMessage } from 'element-plus'

const baseURL = 'http://172.16.0.213:8080'

const instance = axios.create({
  baseURL,
  timeout: 10000,
})

instance.interceptors.request.use(
  (config) => {
    console.log('请求配置:', config) // 调试：打印请求配置
    return config
  },
  (err) => Promise.reject(err),
)

instance.interceptors.response.use(
  (res) => {
    // 处理业务逻辑
    if (res.data.code === 1 ) {
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
