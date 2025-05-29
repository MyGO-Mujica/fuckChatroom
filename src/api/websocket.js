import { useUserStore } from '@/stores'
import router from '@/router'
let ws = null
let reconnectTimer = null
const messageCallbacks = new Map()
let currentUrl = ''
let isManuallyClosed = false
let reconnectAttempts = 0 // 当前已重连次数
const maxReconnectAttempts = 3 // 最大重连次数

/**
 * 建立 WebSocket 连接（可多次调用自动防重连）
 * @param {ws://172.16.0.211:8080/chat} url - ws 地址
 */
export const connectWebSocket = (url) => {
  const userStore = useUserStore()
  const token = userStore.token

  if (!token) {
    console.warn('连接 WebSocket 失败：缺少 token')
    ElMessage.warning('连接失败：请先登录')
    return
  }

  const fullUrl = `${url}/${encodeURIComponent(token)}`
  currentUrl = url // 用于重连时保留原始地址

  if (ws && ws.readyState === WebSocket.OPEN) {
    console.log('WebSocket 已连接，无需重复连接')
    return
  }

  if (ws) {
    // 如果之前有连接，先关闭
    ws.close()
  }

  ws = new WebSocket(fullUrl)

  ws.onopen = () => {
    ElMessage.success('聊天连接已建立')
    reconnectAttempts = 0 // 连接成功，重置重连次数
  }

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data.systemMsg) {
        ElMessage.success(data.content)
      } else {
        const callback = messageCallbacks.get('chat')
        if (callback) {
          callback(null, data)
        }
      }
    } catch (error) {
      console.error('消息解析失败:', error)
      ElMessage.error('消息格式错误')
    }
  }

  ws.onerror = (error) => {
    console.error('WebSocket 错误:', error)
    ElMessage.error('聊天连接异常')
  }

  ws.onclose = () => {
    console.log('WebSocket 连接关闭')
    ElMessage.warning('聊天连接已断开')
    ws = null

    // 如果不是用户主动关闭，才重连
    if (!isManuallyClosed) {
      tryReconnect()
    } else {
      isManuallyClosed = false // 恢复默认状态，防止影响下一次连接
    }
  }
}

/**
 * 发送聊天消息
 * @param {string} username
 * @param {string} content
 * @returns {Promise}
 */
export const sendChatMessage = (username, content, avatar) => {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      ElMessage.error('聊天连接未建立')
      return reject(new Error('聊天连接未建立'))
    }
    ws.send(JSON.stringify({ username, content, avatar }))
    resolve()
  })
}

/**
 * 注册聊天消息回调
 * @param {function} callback - 接收参数 (error, data)
 */
export const onChatMessage = (callback) => {
  messageCallbacks.set('chat', callback)
}

/**
 * 主动关闭 WebSocket 连接
 */
export const closeWebSocket = () => {
  if (ws) {
    isManuallyClosed = true
    ws.close()
    ws = null
  }
}

/**
 * 判断 WebSocket 是否处于打开状态
 * @returns {boolean}
 */
export const isWebSocketOpen = () => {
  return ws?.readyState === WebSocket.OPEN
}

/**
 * 断线重连机制，间隔3秒重连一次
 */
const tryReconnect = () => {
  if (reconnectTimer) return
  // 超过最大重连次数
  if (reconnectAttempts >= maxReconnectAttempts) {
    ElMessage.error('无法连接到服务器，请重新登录')
    router.push('/login')
  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      reconnectAttempts++
      console.warn(`正在尝试第 ${reconnectAttempts} 次重连...`)
      connectWebSocket(currentUrl)
    }
  }, 3000)
}
