<script setup>
import { ref, /*onMounted, onBeforeUnmount,*/ nextTick } from 'vue'
// import { connectWebSocket, closeWebSocket, sendChatMessage, onChatMessage } from '@/api/websocket'
//import { getHistoryMessage } from '@/api/user'
import 'emoji-picker-element'
import { useUserStore } from '@/stores'
import './chatRoom.css'

const userStore = useUserStore()
// const wsUrl = 'ws://[ip]:[port]/chat'
// 数据
const message = ref('')
const messages = ref([])
const showEmoji = ref(false)
const messagesContainer = ref(null)

// sendMessage 函数定义
function sendMessage() {
  if (message.value.trim() === '') return
  const newMessage = {
    username: userStore.user.username,
    text: message.value,
    time: formatTime(new Date()),
    type: 'sent',
  }
  messages.value.push(newMessage)
  message.value = ''
  scrollToBottom()
  setTimeout(() => {
    const replyMessage = {
      text: `我收到了你的消息: ${newMessage.text}`,
      time: formatTime(new Date()),
      type: 'received',
    }
    // 测试
    // sendChatMessage(userStore.user.username, message.value)
    messages.value.push(replyMessage)
    scrollToBottom()
  }, 1000)
}
// // 发送消息
// async function sendMessage() {
//   if (message.value.trim() === '') return

//   const newMessage = {
//     username: userStore.user.username,
//     text: message.value,
//     time: formatTime(new Date()),
//     type: 'sent',
//   }
//   // 先本地加入消息列表
//   messages.value.push(newMessage)

//   try {
//     // 发送给服务器
//     await sendChatMessage(userStore.user.username, message.value)
//   } catch (error) {
//     // 如果发送失败，可以提示或处理
//     console.error('发送失败:', error)
//   }

//   message.value = ''
//   scrollToBottom()
// }

// 初始化加载历史消息
// async function loadHistory() {
//   try {
//     const res = await getHistoryMessage()
//     if (Array.isArray(res.data)) {
//       const formattedMessages = res.data.map(msg => ({
//         username: msg.username,
//         text: msg.content,
//         time: formatTime(new Date(msg.time || Date.now())),
//         type: msg.username === userStore.user.username ? 'sent' : 'received',
//       }))
//       messages.value.push(...formattedMessages)
//       scrollToBottom()
//     }
//   } catch (error) {
//     console.error('获取历史消息失败:', error)
//   }
// }
// // 监听新消息
// onChatMessage((err, data) => {
//   if (err) return
//   const msg = {
//     username: data.username,
//     text: data.content,
//     time: formatTime(new Date()),
//     type: 'received',
//   }
//   messages.value.push(msg)
//   scrollToBottom()
// })

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

// 组件挂载时，连接 WebSocket 并注册消息回调
// onMounted(() => {
//   connectWebSocket(wsUrl)
//    loadHistory()
// })

// // 组件卸载时，关闭连接
// onBeforeUnmount(() => {
//   closeWebSocket()
// })
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
            src="https://api.dicebear.com/7.x/bottts/svg?seed=a2"
            alt="对方头像"
            class="avatar-left"
          />
          <div class="message-content">
            <div class="message-header">
              <span class="message-username">{{ msg.username }}</span>
              <span class="message-time">{{ msg.time }}</span>
            </div>

            <div class="message-bubble">
              <p>{{ msg.text }}</p>
            </div>
          </div>
          <img
            v-if="msg.type === 'sent'"
            :src="userStore.user.avatar"
            alt="我的头像"
            class="avatar-right"
          />
        </div>

        <!-- 自己消息 -->
        <div class="message sent">
          <div class="message-content">
            <div class="message-header">
              <span class="message-username">{{ userStore.user.username }}</span>
              <span class="message-time">10:32</span>
            </div>
            <div class="message-bubble">
              <p>我</p>
            </div>
          </div>
          <img :src="userStore.user.avatar" alt="我的头像" class="avatar-right" />
        </div>
        <!-- 对方消息 -->
        <div class="message received">
          <img
            src="https://api.dicebear.com/7.x/bottts/svg?seed=a4"
            alt="对方头像"
            class="avatar-left"
          />
          <div class="message-content">
            <div class="message-header">
              <span class="message-username">对方用户名</span>
              <span class="message-time">10:35</span>
            </div>
            <div class="message-bubble">
              <p>我也很好，最近在学习，感觉还不错。</p>
            </div>
          </div>
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
