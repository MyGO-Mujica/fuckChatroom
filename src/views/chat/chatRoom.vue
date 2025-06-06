<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { connectWebSocket, closeWebSocket, sendChatMessage, onChatMessage } from '@/api/websocket'
import { getHistoryMessage } from '@/api/user'
import { useUserStore } from '@/stores'
import 'emoji-picker-element'
import './chatRoom.css'

const userStore = useUserStore()
const wsUrl = 'ws://172.16.0.214:8080/chat'

// 数据
const message = ref('')
const messages = ref([])
const showEmoji = ref(false)
const messagesContainer = ref(null)

// 发送消息
async function sendMessage() {
  if (message.value.trim() === '') return

  const newMessage = {
    username: userStore.user.username,
    content: message.value,
    avatar: userStore.user.avatar,
    time: formatTime(new Date()),
    type: 'sent',
  }

  // 先本地加入消息列表
  messages.value.push(newMessage)

  try {
    // 发送给服务器
    await sendChatMessage(userStore.user.username, message.value, userStore.user.avatar)
  } catch (error) {
    // 如果发送失败，可以提示或处理
    console.error('发送失败:', error)
  }

  message.value = ''
  scrollToBottom()
}

//初始化加载历史消息
async function loadHistory() {
  try {
    const res = await getHistoryMessage()
    if (Array.isArray(res.data)) {
      const formattedMessages = res.data.map((msg) => ({
        username: msg.username,
        content: msg.content,
        avatar: msg.avatar,
        time: formatTime(new Date(msg.time || Date.now())),
        type: msg.username === userStore.user.username ? 'sent' : 'received',
      }))
      messages.value.push(...formattedMessages)
      scrollToBottom()
    }
  } catch (error) {
    console.error('获取历史消息失败:', error)
  }
}
//监听新消息
onChatMessage((err, data) => {
  if (err) return
  const msg = {
    username: data.userName,
    content: data.content,
    avatar: data.avatar,
    time: formatTime(new Date()),
    type: 'received',
  }
  messages.value.push(msg)

  scrollToBottom()
})

// 增添emoji
function handleEmojiClick(event) {
  const emoji = event.detail.unicode
  message.value += emoji
  showEmoji.value = false
}
// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// 格式化时间
function formatTime(date) {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

//组件挂载时，连接 WebSocket 并注册消息回调
onMounted(() => {
  connectWebSocket(wsUrl)
  loadHistory()
})

// 组件卸载时，关闭连接
onBeforeUnmount(() => {
  closeWebSocket()
  userStore.removeToken()
  userStore.setUser({})
})
// 初始化时滚动到底部并打印 avatar 路径
nextTick(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="chat-container">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="user-info">
        <div>
          <h3 class="user-name">Kexie聊天室</h3>
        </div>
      </div>
    </div>

    <!-- 聊天内容区域 -->
    <div class="chat-messages" ref="messagesContainer">
      <!-- 消息列表 -->
      <div class="message-list">
        <!-- 动态渲染消息 -->
        <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.type]">
          <img
            v-if="msg.type === 'received'"
            :src="msg.avatar"
            alt="对方头像"
            class="avatar-left"
          />
          <div class="message-content">
            <div class="message-header">
              <span class="message-username">{{ msg.username }}</span>
              <span class="message-time">{{ msg.time }}</span>
            </div>

            <div class="message-bubble">
              <p>{{ msg.content }}</p>
            </div>
          </div>
          <img
            v-if="msg.type === 'sent'"
            :src="userStore.user.avatar"
            alt="我的头像"
            class="avatar-right"
          />
        </div>
      </div>
    </div>

    <!-- 聊天输入区域 -->
    <div class="chat-input">
      <div class="input-actions">
        <!-- 表情按钮 -->
        <button class="emoji-btn" @click="showEmoji = !showEmoji">😊</button>
        <div v-if="showEmoji" class="emoji-picker-container">
          <emoji-picker @emoji-click="handleEmojiClick"></emoji-picker>
        </div>
      </div>
      <div class="input-wrapper">
        <input type="text" placeholder="输入消息..." v-model="message" @keyup.enter="sendMessage" />
      </div>

      <button class="send-btn" @click="sendMessage">
        <span class="send-content">
          <span class="send.text">发送</span>
        </span>
      </button>
    </div>
  </div>
</template>
